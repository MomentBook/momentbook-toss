import {
  startTransition,
  useDeferredValue,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  FixedBottomCTA,
  List,
  ListHeader,
  ListRow,
  Loader,
  Result,
  Top,
} from '@toss/tds-mobile'
import './App.css'
import {
  FetchAlbumPhotosPermissionError,
  fetchMomentbookAlbumPhotos,
  getRuntimeEnvironment,
  triggerSuccessHaptic,
  type RuntimeEnvironment,
} from './lib/appsInToss'
import {
  buildTimelineFromPhotos,
  normalizeTossAlbumPhotos,
  readBrowserPhotoFiles,
  type ClusterMode,
  type PhotoAsset,
  type TimelineCluster,
} from './lib/momentbook'

type FlowStatus = 'idle' | 'ready' | 'clustering' | 'complete' | 'error'

type MomentbookState = {
  status: FlowStatus
  photos: PhotoAsset[]
  timeline: TimelineCluster[]
  resultMode: ClusterMode | null
  errorMessage: string | null
}

type MomentbookAction =
  | { type: 'photosSelected'; photos: PhotoAsset[] }
  | { type: 'clusteringStarted' }
  | { type: 'clusteringFinished'; timeline: TimelineCluster[]; mode: ClusterMode }
  | { type: 'failed'; message: string }

const runtimeCopy: Record<
  RuntimeEnvironment,
  {
    badge: string
    helper: string
    pickerLabel: string
    emptyDescription: string
  }
> = {
  browser: {
    badge: '브라우저 미리보기',
    helper: '브라우저에서는 기기 사진첩 대신 파일 선택기로 흐름을 검증할 수 있어요.',
    pickerLabel: '사진 파일 선택하기',
    emptyDescription: '기기 사진첩 대신 테스트할 사진 파일을 골라 흐름을 확인해 보세요.',
  },
  sandbox: {
    badge: '샌드박스',
    helper: '샌드박스에서는 Toss 사진첩 권한과 선택 흐름을 실제와 가깝게 점검할 수 있어요.',
    pickerLabel: 'Toss 사진첩에서 가져오기',
    emptyDescription: '샌드박스에서 사진첩 권한과 선택 흐름을 먼저 검증해 보세요.',
  },
  toss: {
    badge: 'Toss 앱',
    helper: 'Toss 앱 안에서 사진 선택부터 결과 확인까지 실제 사용자 흐름으로 점검할 수 있어요.',
    pickerLabel: 'Toss 사진첩에서 가져오기',
    emptyDescription: '토스 앱 안에서 사진첩에서 사진을 고르고 바로 타임라인 결과를 확인해 보세요.',
  },
}

function createInitialState(): MomentbookState {
  return {
    status: 'idle',
    photos: [],
    timeline: [],
    resultMode: null,
    errorMessage: null,
  }
}

function reducer(state: MomentbookState, action: MomentbookAction): MomentbookState {
  switch (action.type) {
    case 'photosSelected':
      return {
        status: 'ready',
        photos: action.photos,
        timeline: [],
        resultMode: null,
        errorMessage: null,
      }
    case 'clusteringStarted':
      return {
        ...state,
        status: 'clustering',
        timeline: [],
        resultMode: null,
        errorMessage: null,
      }
    case 'clusteringFinished':
      return {
        ...state,
        status: 'complete',
        timeline: action.timeline,
        resultMode: action.mode,
        errorMessage: null,
      }
    case 'failed':
      return {
        ...state,
        status: 'error',
        timeline: [],
        resultMode: null,
        errorMessage: action.message,
      }
    default:
      return state
  }
}

function App() {
  const [runtime] = useState<RuntimeEnvironment>(() => getRuntimeEnvironment())
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState)
  const deferredPhotos = useDeferredValue(state.photos)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const copy = runtimeCopy[runtime]
  const photoCount = deferredPhotos.length
  const timelineCount = state.timeline.length
  const samplePhotos = deferredPhotos.slice(0, 6)
  const remainingPhotos = Math.max(0, deferredPhotos.length - samplePhotos.length)
  const canCreateTimeline = deferredPhotos.length > 0 && state.status !== 'clustering'
  const statusMessage = getStatusMessage(state)
  const primaryCtaLabel = getPrimaryCtaLabel(state, copy)

  const handlePickPhotos = async () => {
    if (state.status === 'clustering') {
      return
    }

    if (runtime === 'browser') {
      fileInputRef.current?.click()
      return
    }

    try {
      const albumPhotos = await fetchMomentbookAlbumPhotos()

      if (albumPhotos.length === 0) {
        return
      }

      startTransition(() => {
        dispatch({
          type: 'photosSelected',
          photos: normalizeTossAlbumPhotos(albumPhotos),
        })
      })
    } catch (error) {
      dispatch({
        type: 'failed',
        message: getPhotoSelectionMessage(error),
      })
    }
  }

  const handleBrowserSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''

    if (nextFiles.length === 0) {
      return
    }

    try {
      const nextPhotos = await readBrowserPhotoFiles(nextFiles)

      startTransition(() => {
        dispatch({
          type: 'photosSelected',
          photos: nextPhotos,
        })
      })
    } catch (error) {
      dispatch({
        type: 'failed',
        message: getPhotoSelectionMessage(error),
      })
    }
  }

  const handleCreateTimeline = async () => {
    if (!canCreateTimeline) {
      return
    }

    dispatch({ type: 'clusteringStarted' })

    try {
      const result = await buildTimelineFromPhotos(state.photos)

      startTransition(() => {
        dispatch({
          type: 'clusteringFinished',
          timeline: result.timeline,
          mode: result.mode,
        })
      })

      void triggerSuccessHaptic()
    } catch (error) {
      dispatch({
        type: 'failed',
        message: getClusteringMessage(error),
      })
    }
  }

  const handlePrimaryAction = async () => {
    if (state.status === 'clustering') {
      return
    }

    if (timelineCount > 0) {
      await handlePickPhotos()
      return
    }

    if (photoCount > 0) {
      await handleCreateTimeline()
      return
    }

    await handlePickPhotos()
  }

  const showPreparationState =
    photoCount > 0 && timelineCount === 0 && state.status !== 'clustering' && state.status !== 'error'

  return (
    <main className="app-shell">
      <div className="screen-shell">
        <section className="surface-card">
          <Top
            upper={
              <div className="top-badge-row">
                <span className="top-badge top-badge--brand">Momentbook</span>
                <span className="top-badge">{copy.badge}</span>
                {state.resultMode === 'demo' ? (
                  <span className="top-badge top-badge--demo">Demo</span>
                ) : null}
              </div>
            }
            title={<Top.TitleParagraph>사진을 순간별 타임라인으로 정리해요</Top.TitleParagraph>}
            subtitleBottom={
              <Top.SubtitleParagraph>{copy.helper}</Top.SubtitleParagraph>
            }
            right={
              photoCount > 0 && state.status !== 'clustering' ? (
                <Top.RightButton
                  variant="weak"
                  size="small"
                  onClick={() => void handlePickPhotos()}
                >
                  사진 다시 선택
                </Top.RightButton>
              ) : undefined
            }
            lower={
              <div className="hero-metrics">
                <div className="hero-metric">
                  <span>선택 사진</span>
                  <strong>{formatCount(photoCount, '장')}</strong>
                </div>
                <div className="hero-metric">
                  <span>현재 상태</span>
                  <strong>{getStatusLabel(state.status)}</strong>
                </div>
                <div className="hero-metric">
                  <span>타임라인 묶음</span>
                  <strong>{formatCount(timelineCount, '개')}</strong>
                </div>
              </div>
            }
          />
        </section>

        <section className="surface-card">
          <ListHeader
            title={
              <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
                진행 상태
              </ListHeader.TitleParagraph>
            }
            description={
              <ListHeader.DescriptionParagraph>{statusMessage}</ListHeader.DescriptionParagraph>
            }
          />

          <List>
            <ListRow
              left={
                <ListRow.AssetText shape="squircle" size="medium">
                  사진
                </ListRow.AssetText>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="선택한 사진"
                  bottom={
                    photoCount > 0 ? formatPhotoRange(deferredPhotos) : '아직 선택한 사진이 없어요.'
                  }
                />
              }
              right={<span className="info-pill">{formatCount(photoCount, '장')}</span>}
            />
            <ListRow
              left={
                <ListRow.AssetText shape="squircle" size="medium">
                  상태
                </ListRow.AssetText>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="생성 상태"
                  bottom={statusMessage}
                />
              }
              right={<span className={`status-pill is-${state.status}`}>{getStatusLabel(state.status)}</span>}
            />
            <ListRow
              left={
                <ListRow.AssetText shape="squircle" size="medium">
                  결과
                </ListRow.AssetText>
              }
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="타임라인 결과"
                  bottom={getResultModeCopy(state.resultMode, timelineCount)}
                />
              }
              right={<span className="info-pill">{formatCount(timelineCount, '개')}</span>}
            />
          </List>
        </section>

        {state.status === 'clustering' ? (
          <section className="surface-card">
            <div className="loader-panel" aria-live="polite">
              <Loader label="사진을 정리하고 있어요" size="large" type="primary" />
              <p className="support-copy">
                선택한 순서와 촬영 시점을 바탕으로 시간 흐름이 자연스러운 묶음을 만드는 중이에요.
              </p>
            </div>
          </section>
        ) : null}

        {state.status === 'error' ? (
          <section className="surface-card">
            <Result
              title="작업을 완료하지 못했어요"
              description={state.errorMessage ?? '잠시 후 다시 시도해 주세요.'}
            />
          </section>
        ) : null}

        <section className="surface-card">
          <ListHeader
            title={
              <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
                선택한 사진
              </ListHeader.TitleParagraph>
            }
            description={
              <ListHeader.DescriptionParagraph>
                {photoCount > 0
                  ? '대표 사진만 먼저 보여주고, 전체 선택은 타임라인 생성에 그대로 반영해요.'
                  : copy.emptyDescription}
              </ListHeader.DescriptionParagraph>
            }
            right={
              photoCount > 0 ? (
                <ListHeader.RightText typography="t7">
                  {formatPhotoRange(deferredPhotos)}
                </ListHeader.RightText>
              ) : undefined
            }
          />

          {photoCount > 0 ? (
            <>
              <div className="selection-summary">
                <strong>{formatCount(photoCount, '장')} 선택됨</strong>
                <p className="support-copy">
                  {runtime === 'browser'
                    ? '브라우저에서는 업로드한 파일의 정보로 순서를 유지해 타임라인을 만들어요.'
                    : 'Toss 사진첩에서 고른 순서와 사진 정보를 기준으로 타임라인을 만들어요.'}
                </p>
              </div>

              <div className="photo-grid">
                {samplePhotos.map((photo, index) => (
                  <figure className="photo-card" key={photo.id}>
                    <img src={photo.previewUrl} alt={`선택한 사진 ${index + 1}`} loading="lazy" />
                  </figure>
                ))}

                {remainingPhotos > 0 ? (
                  <div className="photo-card photo-card--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
                    <span>+{remainingPhotos}</span>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Result
              title="먼저 사진을 불러와 주세요"
              description="사진을 고르면 하단의 기본 액션으로 바로 타임라인을 만들 수 있어요."
            />
          )}
        </section>

        {showPreparationState ? (
          <section className="surface-card">
            <Result
              title="선택은 끝났어요"
              description="하단 버튼을 눌러 시간 흐름 기준의 타임라인을 생성해 보세요."
            />
          </section>
        ) : null}

        {timelineCount > 0 ? (
          <section className="surface-card">
            <ListHeader
              title={
                <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
                  생성된 타임라인
                </ListHeader.TitleParagraph>
              }
              description={
                <ListHeader.DescriptionParagraph>
                  {state.resultMode === 'demo'
                    ? '클러스터링 서버 주소가 없어 데모 규칙으로 묶은 결과를 보여주고 있어요.'
                    : '사진이 시간 흐름과 맥락에 따라 묶여 한눈에 보이도록 정리됐어요.'}
                </ListHeader.DescriptionParagraph>
              }
              right={
                <ListHeader.RightText typography="t7">
                  {formatCount(timelineCount, '개')}
                </ListHeader.RightText>
              }
            />

            <div className="timeline-stack">
              {state.timeline.map((cluster, index) => (
                <article className="timeline-card" key={cluster.id}>
                  <div className="timeline-card-head">
                    <div>
                      <p className="eyebrow">묶음 {String(index + 1).padStart(2, '0')}</p>
                      <h3>{cluster.title}</h3>
                    </div>
                    <span className="info-pill">{formatCount(cluster.photos.length, '장')}</span>
                  </div>

                  <p className="timeline-summary">{cluster.summary}</p>

                  <div className="timeline-meta">
                    <span>{formatClusterWindow(cluster)}</span>
                    <span>{cluster.photos[0]?.source === 'browser' ? '브라우저 파일' : 'Toss 사진첩'}</span>
                  </div>

                  <div className="timeline-preview-grid">
                    {cluster.photos.slice(0, 4).map((photo, photoIndex) => (
                      <figure className="timeline-preview" key={`${cluster.id}-${photo.id}`}>
                        <img
                          src={photo.previewUrl}
                          alt={`${cluster.title} 대표 사진 ${photoIndex + 1}`}
                          loading="lazy"
                        />
                      </figure>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <FixedBottomCTA
        loading={state.status === 'clustering'}
        disabled={state.status === 'clustering'}
        onClick={() => void handlePrimaryAction()}
      >
        {primaryCtaLabel}
      </FixedBottomCTA>

      <input
        ref={fileInputRef}
        accept="image/*"
        className="visually-hidden"
        multiple
        type="file"
        onChange={(event) => void handleBrowserSelection(event)}
      />
    </main>
  )
}

function getPrimaryCtaLabel(state: MomentbookState, copy: (typeof runtimeCopy)[RuntimeEnvironment]) {
  if (state.status === 'clustering') {
    return '타임라인 만드는 중'
  }

  if (state.timeline.length > 0) {
    return '다른 사진 고르기'
  }

  if (state.photos.length > 0) {
    return state.status === 'error' ? '타임라인 다시 만들기' : '타임라인 만들기'
  }

  return copy.pickerLabel
}

function getPhotoSelectionMessage(error: unknown) {
  if (error instanceof FetchAlbumPhotosPermissionError) {
    return '사진첩 권한을 허용하면 사진을 바로 불러올 수 있어요.'
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '사진을 불러오지 못했어요. 다시 시도해 주세요.'
}

function getClusteringMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '타임라인을 만들지 못했어요. 잠시 후 다시 시도해 주세요.'
}

function getStatusLabel(status: FlowStatus) {
  switch (status) {
    case 'idle':
      return '준비 중'
    case 'ready':
      return '생성 가능'
    case 'clustering':
      return '생성 중'
    case 'complete':
      return '완료'
    case 'error':
      return '재시도 필요'
    default:
      return '준비 중'
  }
}

function getStatusMessage(state: MomentbookState) {
  switch (state.status) {
    case 'idle':
      return '사진을 고르면 바로 시간 흐름 기준의 타임라인을 만들 수 있어요.'
    case 'ready':
      return `${formatCount(state.photos.length, '장')}이 준비됐어요. 이제 타임라인을 생성해 보세요.`
    case 'clustering':
      return '선택한 사진을 시간 흐름과 장면 맥락 기준으로 정리하고 있어요.'
    case 'complete':
      return `${formatCount(state.timeline.length, '개')}의 묶음으로 정리됐어요.`
    case 'error':
      return state.errorMessage ?? '잠시 후 다시 시도해 주세요.'
    default:
      return ''
  }
}

function getResultModeCopy(mode: ClusterMode | null, timelineCount: number) {
  if (timelineCount === 0) {
    return '아직 생성된 타임라인이 없어요.'
  }

  if (mode === 'demo') {
    return '데모 규칙으로 묶인 결과예요.'
  }

  if (mode === 'server') {
    return '서버 응답으로 생성된 결과예요.'
  }

  return '타임라인 생성이 완료됐어요.'
}

function formatCount(count: number, unit: string) {
  return `${count}${unit}`
}

function formatPhotoRange(photos: PhotoAsset[]) {
  const timestamps = photos
    .map((photo) => photo.capturedAt)
    .filter((timestamp): timestamp is string => timestamp != null)

  if (timestamps.length < 2) {
    return '선택 순서 기준'
  }

  const ordered = timestamps
    .map((timestamp) => new Date(timestamp))
    .sort((left, right) => left.getTime() - right.getTime())

  return `${formatShortDate(ordered[0])} - ${formatShortDate(ordered[ordered.length - 1])}`
}

function formatClusterWindow(cluster: TimelineCluster) {
  if (cluster.startedAt == null || cluster.endedAt == null) {
    return '선택 순서를 기준으로 묶였어요.'
  }

  const start = new Date(cluster.startedAt)
  const end = new Date(cluster.endedAt)

  return `${formatShortDate(start)} ${formatShortTime(start)} - ${formatShortTime(end)}`
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatShortTime(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default App
