import {
  startTransition,
  useDeferredValue,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
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
  }
> = {
  browser: {
    badge: 'Browser Preview',
    helper: '브라우저에서는 기기 파일을 여러 장 한 번에 올려볼 수 있어요.',
    pickerLabel: '기기에서 사진 가져오기',
  },
  sandbox: {
    badge: 'Sandbox',
    helper: '샌드박스에서는 토스 사진첩 흐름을 미리 확인할 수 있어요.',
    pickerLabel: '토스 사진첩에서 가져오기',
  },
  toss: {
    badge: 'Toss App',
    helper: '토스 안에서는 사진첩에서 바로 여러 장을 고를 수 있어요.',
    pickerLabel: '토스 사진첩에서 가져오기',
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
  const heroCount = deferredPhotos.length
  const timelineCount = state.timeline.length
  const samplePhotos = deferredPhotos.slice(0, 7)
  const remainingPhotos = deferredPhotos.length - samplePhotos.length
  const canCreateTimeline = deferredPhotos.length > 0 && state.status !== 'clustering'

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

  const statusMessage = getStatusMessage(state)

  return (
    <main className="app-shell">
      <div className="screen-shell">
        <section className="hero-section">
          <div className="hero-badge-row">
            <span className="runtime-badge">{copy.badge}</span>
            <span className="surface-badge">Momentbook Mini</span>
          </div>

          <div className="hero-copy">
            <p className="section-label">Photo clustering</p>
            <h1>사진 묶음을 장면별 타임라인으로 정리해요</h1>
            <p className="hero-description">
              여러 장을 한 번에 가져오면 가까운 순간끼리 묶어, 훑어보기 쉬운 타임라인으로 바로 보여줘요.
            </p>
          </div>
        </section>

        <section className="summary-card">
          <article className="summary-metric">
            <span>선택한 사진</span>
            <strong>{formatCount(heroCount, '장')}</strong>
            <small>{heroCount > 0 ? '한 번에 정리할 사진이에요.' : '아직 가져온 사진이 없어요.'}</small>
          </article>

          <article className="summary-metric">
            <span>현재 단계</span>
            <strong>{getStatusLabel(state.status)}</strong>
            <small>{statusMessage}</small>
          </article>

          <article className="summary-metric">
            <span>타임라인 묶음</span>
            <strong>{formatCount(timelineCount, '개')}</strong>
            <small>{timelineCount > 0 ? '장면 단위로 묶은 결과예요.' : '결과를 만들면 여기에 보여줘요.'}</small>
          </article>
        </section>

        <section className="flow-card">
          <div className="section-heading">
            <div>
              <p className="section-label">1. 사진 가져오기</p>
              <h2>한 번에 고르고 바로 시작해요</h2>
            </div>
            <span className="step-chip">{copy.badge}</span>
          </div>

          <p className="section-copy">{copy.helper}</p>

          <div className="cta-row">
            <button
              className="primary-button"
              type="button"
              onClick={() => void handlePickPhotos()}
              disabled={state.status === 'clustering'}
            >
              {heroCount > 0 ? '사진 다시 고르기' : copy.pickerLabel}
            </button>

            {heroCount > 0 ? (
              <button
                className="secondary-button"
                type="button"
                onClick={() => void handleCreateTimeline()}
                disabled={!canCreateTimeline}
              >
                타임라인 만들기
              </button>
            ) : null}
          </div>
        </section>

        <section className="progress-card">
          <div className="section-heading">
            <div>
              <p className="section-label">2. 진행 상태</p>
              <h2>한 화면에서 흐름을 바로 확인해요</h2>
            </div>
          </div>

          <div className="step-list" aria-label="진행 단계">
            <StepItem
              title="사진 선택"
              description="사진 묶음을 고르고 바로 확인해요."
              state={heroCount > 0 ? 'done' : 'active'}
            />
            <StepItem
              title="서버 클러스터링"
              description="가까운 장면끼리 묶어 구조를 만들어요."
              state={getClusterStepState(state)}
            />
            <StepItem
              title="타임라인 확인"
              description="묶음별로 빠르게 훑고 다시 고를 수 있어요."
              state={timelineCount > 0 ? 'done' : 'idle'}
            />
          </div>

          {state.status === 'clustering' ? (
            <div className="processing-card" aria-live="polite">
              <div className="processing-bar" aria-hidden="true">
                <span />
              </div>
              <strong>사진을 보내고 장면을 정리하고 있어요</strong>
              <p>선택한 순서와 촬영 정보를 함께 보고 타임라인 구조를 만들고 있어요.</p>
            </div>
          ) : null}
        </section>

        <section className="selection-card">
          <div className="section-heading">
            <div>
              <p className="section-label">3. 선택한 사진</p>
              <h2>{heroCount > 0 ? `${formatCount(heroCount, '장')}을 바로 훑어봐요` : '사진을 가져오면 여기에 보여줘요'}</h2>
            </div>
            {heroCount > 0 ? <span className="count-pill">{formatPhotoRange(deferredPhotos)}</span> : null}
          </div>

          {heroCount > 0 ? (
            <>
              <div className="photo-grid">
                {samplePhotos.map((photo, index) => (
                  <figure className="photo-frame" key={photo.id}>
                    <img src={photo.previewUrl} alt={`${index + 1}번째 선택한 사진`} loading="lazy" />
                  </figure>
                ))}

                {remainingPhotos > 0 ? (
                  <div className="photo-frame photo-frame-more" aria-label={`추가 사진 ${remainingPhotos}장`}>
                    <span>+{remainingPhotos}</span>
                  </div>
                ) : null}
              </div>

              <p className="selection-note">
                {runtime === 'browser'
                  ? '브라우저에서는 파일 메타데이터를 기준으로 흐름을 정리해요.'
                  : '토스 사진첩에서는 선택한 순서를 유지해 흐름을 정리해요.'}
              </p>
            </>
          ) : (
            <div className="empty-panel">
              <strong>사진을 먼저 가져와 주세요</strong>
              <p>가장 먼저 할 일은 사진 묶음을 선택하는 거예요. 가져온 뒤에는 바로 타임라인을 만들 수 있어요.</p>
            </div>
          )}
        </section>

        <section className="status-card" aria-live="polite">
          <div className={`notice-card${state.status === 'error' ? ' is-error' : ''}`}>
            <p className="section-label">안내</p>
            <strong>{statusMessage}</strong>
            {state.resultMode === 'demo' ? (
              <p className="notice-copy">
                현재 레포에는 실제 서버 주소가 없어서, `VITE_MOMENTBOOK_CLUSTER_ENDPOINT`가 없으면 데모 클러스터링으로 흐름을 보여줘요.
              </p>
            ) : null}
          </div>
        </section>

        {timelineCount > 0 ? (
          <section className="timeline-card-section">
            <div className="section-heading">
              <div>
                <p className="section-label">4. 결과 타임라인</p>
                <h2>장면별로 묶은 흐름을 바로 훑어봐요</h2>
              </div>
              <span className="count-pill">{formatCount(timelineCount, '개 묶음')}</span>
            </div>

            <ol className="timeline-list">
              {state.timeline.map((cluster, index) => (
                <li className="timeline-item" key={cluster.id}>
                  <div className="timeline-node" aria-hidden="true" />

                  <article className="timeline-panel">
                    <div className="timeline-panel-top">
                      <div>
                        <p className="timeline-order">묶음 {String(index + 1).padStart(2, '0')}</p>
                        <h3>{cluster.title}</h3>
                      </div>
                      <span className="count-pill">{formatCount(cluster.photos.length, '장')}</span>
                    </div>

                    <p className="timeline-summary">{cluster.summary}</p>

                    <div className="timeline-meta">
                      <span>{formatClusterWindow(cluster)}</span>
                      <span>{cluster.photos[0]?.source === 'browser' ? '파일 기준 정리' : '사진첩 기준 정리'}</span>
                    </div>

                    <div className="timeline-strip">
                      {cluster.photos.slice(0, 4).map((photo, photoIndex) => (
                        <figure className="timeline-photo" key={`${cluster.id}-${photo.id}`}>
                          <img src={photo.previewUrl} alt={`${cluster.title} 대표 사진 ${photoIndex + 1}`} loading="lazy" />
                        </figure>
                      ))}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      {heroCount > 0 ? (
        <div className="bottom-cta-shell">
          <div className="bottom-cta">
            <div className="bottom-cta-copy">
              <strong>{timelineCount > 0 ? '새 사진 묶음으로 다시 만들어요' : '이제 타임라인을 만들 차례예요'}</strong>
              <span>
                {timelineCount > 0
                  ? '다른 사진 묶음을 고르면 같은 흐름으로 바로 다시 볼 수 있어요.'
                  : '다음 버튼을 누르면 선택한 사진을 서버 흐름으로 묶어줘요.'}
              </span>
            </div>

            <button
              className="bottom-cta-button"
              type="button"
              onClick={() =>
                void (timelineCount > 0 ? handlePickPhotos() : handleCreateTimeline())
              }
              disabled={timelineCount === 0 && !canCreateTimeline}
            >
              {timelineCount > 0 ? '새 사진 가져오기' : '타임라인 만들기'}
            </button>
          </div>
        </div>
      ) : null}

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

function StepItem({
  title,
  description,
  state,
}: {
  title: string
  description: string
  state: 'idle' | 'active' | 'done'
}) {
  return (
    <article className={`step-item is-${state}`}>
      <span className="step-state" aria-hidden="true" />
      <strong>{title}</strong>
      <p>{description}</p>
    </article>
  )
}

function getPhotoSelectionMessage(error: unknown) {
  if (error instanceof FetchAlbumPhotosPermissionError) {
    return '사진첩 권한을 허용하면 사진을 바로 가져올 수 있어요.'
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '사진을 가져오지 못했어요. 다시 시도해 주세요.'
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
      return '준비 완료'
    case 'ready':
      return '사진 선택 완료'
    case 'clustering':
      return '클러스터링 중'
    case 'complete':
      return '결과 준비 완료'
    case 'error':
      return '다시 확인 필요'
    default:
      return '준비 완료'
  }
}

function getStatusMessage(state: MomentbookState) {
  switch (state.status) {
    case 'idle':
      return '사진 묶음을 가져오면 바로 타임라인 흐름을 만들 수 있어요.'
    case 'ready':
      return `${formatCount(state.photos.length, '장')}을 가져왔어요. 이제 타임라인을 만들어요.`
    case 'clustering':
      return '서버에서 가까운 장면끼리 묶고 있어요.'
    case 'complete':
      return `${formatCount(state.timeline.length, '개 묶음')}으로 정리했어요. 바로 훑어볼 수 있어요.`
    case 'error':
      return state.errorMessage ?? '다시 시도해 주세요.'
    default:
      return ''
  }
}

function getClusterStepState(state: MomentbookState): 'idle' | 'active' | 'done' {
  if (state.status === 'clustering') {
    return 'active'
  }

  if (state.timeline.length > 0) {
    return 'done'
  }

  return 'idle'
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
    return '선택한 순서 기준으로 묶었어요.'
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
