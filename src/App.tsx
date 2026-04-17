import {
  startTransition,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { Button, FixedBottomCTA } from '@toss/tds-mobile'
import './App.css'
import {
  FetchAlbumPhotosPermissionError,
  fetchMomentbookAlbumPhotos,
  getRuntimeEnvironment,
  triggerSuccessHaptic,
  type RuntimeEnvironment,
} from './lib/appsInToss'
import {
  buildHistoryState,
  getRequestedScreen,
  screens,
  toScreenHash,
  type Screen,
} from './lib/navigation'
import {
  buildDummyJourneyDraft,
  organizingSteps,
  readBrowserPhotoFiles,
  normalizeTossAlbumPhotos,
  type JourneyDraft,
  type PhotoAsset,
} from './lib/momentbook'
import { DiscoverScreen } from './screens/DiscoverScreen'
import { OrganizingScreen } from './screens/OrganizingScreen'
import { PublishScreen } from './screens/PublishScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { TimelineScreen } from './screens/TimelineScreen'
import { UploadScreen } from './screens/UploadScreen'

type PublishStatus = 'idle' | 'publishing' | 'complete'

type FlowState = {
  photos: PhotoAsset[]
  draft: JourneyDraft | null
  publishStatus: PublishStatus
  errorMessage: string | null
}

type FlowAction =
  | { type: 'photosSelected'; photos: PhotoAsset[] }
  | { type: 'draftCleared' }
  | { type: 'draftGenerated'; draft: JourneyDraft }
  | { type: 'publishStarted' }
  | { type: 'publishCompleted' }
  | { type: 'errorCleared' }
  | { type: 'failed'; message: string }
  | { type: 'resetAll' }

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
    badge: '웹 미리보기',
    helper: '사진을 선택하면 시간순으로 정리해서 모먼트북 초안을 만들어드려요.',
    pickerLabel: '사진 가져오기',
    emptyDescription: '기기에서 여행 사진을 선택해 주세요.',
  },
  sandbox: {
    badge: '샌드박스',
    helper: '토스 사진첩 연동 흐름을 미리 확인할 수 있어요.',
    pickerLabel: '토스 사진첩 열기',
    emptyDescription: '연결된 사진첩에서 정리할 사진을 골라 주세요.',
  },
  toss: {
    badge: 'Toss 연결',
    helper: '토스 사진첩에서 선택한 사진을 한 번에 여행 타임라인으로 정리해드려요.',
    pickerLabel: '토스 사진첩 열기',
    emptyDescription: '여행 사진을 선택하면 바로 정리 초안을 시작해요.',
  },
}

const screenMeta: Record<
  Screen,
  {
    label: string
    description: string
  }
> = {
  discover: {
    label: '여정 둘러보기',
    description: '다른 사람의 기록을 먼저 보고 내 여정의 시작점을 찾을 수 있어요.',
  },
  upload: {
    label: '사진 선택',
    description: '여행 사진을 모아 모먼트북의 첫 장을 시작해요.',
  },
  review: {
    label: '선택 검토',
    description: '정리 전에 사진 수와 흐름을 한 번 더 확인해요.',
  },
  organizing: {
    label: '자동 정리',
    description: '시간과 분위기를 기준으로 사진을 모먼트 단위로 묶는 중이에요.',
  },
  timeline: {
    label: '타임라인 확인',
    description: '정리된 여정을 미리 보고 공개 흐름을 다듬어요.',
  },
  publish: {
    label: '발행 준비',
    description: '대표 이미지와 공개용 페이지 구성을 확인해요.',
  },
}

const initialFlowState: FlowState = {
  photos: [],
  draft: null,
  publishStatus: 'idle',
  errorMessage: null,
}

function buildPhotosSelectedState(photos: PhotoAsset[]): FlowState {
  return {
    ...initialFlowState,
    photos,
  }
}

function clearDraftState(state: FlowState): FlowState {
  return {
    ...state,
    draft: null,
    publishStatus: 'idle',
    errorMessage: null,
  }
}

function buildDraftGeneratedState(state: FlowState, draft: JourneyDraft): FlowState {
  return {
    ...clearDraftState(state),
    draft,
  }
}

function resolveAccessibleScreen(requested: Screen, state: FlowState): Screen {
  if (requested === 'discover') {
    return 'discover'
  }

  if (requested === 'upload') {
    return 'upload'
  }

  if (requested === 'review' || requested === 'organizing') {
    return state.photos.length > 0 ? requested : 'upload'
  }

  if (requested === 'timeline' || requested === 'publish') {
    if (state.draft != null) {
      return requested
    }

    return state.photos.length > 0 ? 'review' : 'upload'
  }

  return 'discover'
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'photosSelected':
      return buildPhotosSelectedState(action.photos)
    case 'draftCleared':
      return clearDraftState(state)
    case 'draftGenerated':
      return buildDraftGeneratedState(state, action.draft)
    case 'publishStarted':
      return {
        ...state,
        publishStatus: 'publishing',
      }
    case 'publishCompleted':
      return {
        ...state,
        publishStatus: 'complete',
      }
    case 'errorCleared':
      return {
        ...state,
        errorMessage: null,
      }
    case 'failed':
      return {
        ...state,
        errorMessage: action.message,
      }
    case 'resetAll':
      return initialFlowState
    default:
      return state
  }
}

function App() {
  const [runtime] = useState<RuntimeEnvironment>(() => getRuntimeEnvironment())
  const [flow, dispatch] = useReducer(reducer, initialFlowState)
  const [screen, setScreen] = useState<Screen>(() =>
    resolveAccessibleScreen(
      getRequestedScreen(window.location.hash, window.history.state) ?? 'discover',
      initialFlowState,
    ),
  )
  const [organizingStepIndex, setOrganizingStepIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const setScreenHistory = useCallback((nextScreen: Screen, mode: 'push' | 'replace' = 'push') => {
    const url = toScreenHash(nextScreen)
    const state = buildHistoryState(nextScreen)

    if (mode === 'replace') {
      window.history.replaceState(state, '', url)
    } else {
      window.history.pushState(state, '', url)
    }

    setScreen(nextScreen)
  }, [])

  const navigate = useCallback(
    (requested: Screen, mode: 'push' | 'replace' = 'push', stateSnapshot: FlowState = flow) => {
      const nextScreen = resolveAccessibleScreen(requested, stateSnapshot)
      setScreenHistory(nextScreen, mode)
    },
    [flow, setScreenHistory],
  )

  useEffect(() => {
    window.history.replaceState(buildHistoryState(screen), '', toScreenHash(screen))
  }, [screen])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const requestedScreen = getRequestedScreen(window.location.hash, event.state) ?? 'discover'
      const nextScreen = resolveAccessibleScreen(requestedScreen, flow)
      setScreen(nextScreen)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [flow])

  useEffect(() => {
    if (screen !== 'organizing' || flow.photos.length === 0) {
      return
    }

    let elapsed = 0
    const timeouts = organizingSteps.map((step, index) => {
      const timeoutId = window.setTimeout(() => {
        setOrganizingStepIndex(index)
      }, elapsed)

      elapsed += step.durationMs
      return timeoutId
    })

    const finishTimeout = window.setTimeout(() => {
      const draft = buildDummyJourneyDraft(flow.photos)
      const nextFlow = buildDraftGeneratedState(flow, draft)

      startTransition(() => {
        dispatch({ type: 'draftGenerated', draft })
      })

      void triggerSuccessHaptic()
      navigate('timeline', 'replace', nextFlow)
    }, elapsed)

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      window.clearTimeout(finishTimeout)
    }
  }, [flow, navigate, screen])

  useEffect(() => {
    if (flow.publishStatus !== 'publishing') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        dispatch({ type: 'publishCompleted' })
      })

      void triggerSuccessHaptic()
    }, 900)

    return () => window.clearTimeout(timeoutId)
  }, [flow.publishStatus])

  const completePhotoSelection = useCallback(
    (photos: PhotoAsset[]) => {
      const nextFlow = buildPhotosSelectedState(photos)

      startTransition(() => {
        dispatch({ type: 'photosSelected', photos })
      })

      navigate('review', screen === 'review' ? 'replace' : 'push', nextFlow)
    },
    [navigate, screen],
  )

  const selectPhotos = useCallback(
    async (loader: () => Promise<PhotoAsset[]>) => {
      dispatch({ type: 'errorCleared' })

      try {
        const photos = await loader()

        if (photos.length === 0) {
          return
        }

        completePhotoSelection(photos)
      } catch (error) {
        dispatch({
          type: 'failed',
          message: getPhotoSelectionMessage(error),
        })
      }
    },
    [completePhotoSelection],
  )

  const handlePickPhotos = useCallback(async () => {
    if (runtime === 'browser') {
      dispatch({ type: 'errorCleared' })
      fileInputRef.current?.click()
      return
    }

    await selectPhotos(async () => normalizeTossAlbumPhotos(await fetchMomentbookAlbumPhotos()))
  }, [runtime, selectPhotos])

  const handleBrowserSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''

    if (files.length === 0) {
      return
    }

    await selectPhotos(() => readBrowserPhotoFiles(files))
  }

  const handleStartOrganizing = useCallback(() => {
    if (flow.photos.length === 0) {
      return
    }

    const nextFlow = clearDraftState(flow)

    setOrganizingStepIndex(0)
    dispatch({ type: 'draftCleared' })
    navigate('organizing', 'push', nextFlow)
  }, [flow, navigate])

  const handleOpenPublish = useCallback(() => {
    if (flow.draft == null) {
      return
    }

    navigate('publish', 'push')
  }, [flow.draft, navigate])

  const handlePublish = useCallback(() => {
    if (flow.draft == null || flow.publishStatus !== 'idle') {
      return
    }

    dispatch({ type: 'publishStarted' })
  }, [flow.draft, flow.publishStatus])

  const handleRestart = useCallback(() => {
    dispatch({ type: 'resetAll' })
    navigate('discover', 'replace', initialFlowState)
  }, [navigate])

  const currentDraft = flow.draft
  const copy = runtimeCopy[runtime]
  const currentStep = screens.indexOf(screen)

  let content = null

  switch (screen) {
    case 'discover':
      content = <DiscoverScreen hasSelectedPhotos={flow.photos.length > 0} />
      break
    case 'upload':
      content = (
        <UploadScreen
          copy={copy}
          photos={flow.photos}
          onPickPhotos={() => void handlePickPhotos()}
        />
      )
      break
    case 'review':
      content = (
        <ReviewScreen
          photos={flow.photos}
          onChangePhotos={() => void handlePickPhotos()}
        />
      )
      break
    case 'organizing':
      content = (
        <OrganizingScreen activeStepIndex={organizingStepIndex} totalPhotos={flow.photos.length} />
      )
      break
    case 'timeline':
      content =
        currentDraft == null ? null : (
          <TimelineScreen draft={currentDraft} onChangePhotos={() => void handlePickPhotos()} />
        )
      break
    case 'publish':
      content =
        currentDraft == null ? null : (
          <PublishScreen
            draft={currentDraft}
            publishStatus={flow.publishStatus}
            onBackToTimeline={() => navigate('timeline', 'replace')}
          />
        )
      break
    default:
      content = null
  }

  return (
    <main className="app-shell">
      <div className="app-shell__glow app-shell__glow--top" />
      <div className="app-shell__glow app-shell__glow--bottom" />

      <div className="screen-shell">
        <header className="app-chrome">
          <div>
            <p className="app-chrome__eyebrow">Momentbook</p>
            <h1 className="app-chrome__title">{screenMeta[screen].label}</h1>
            <p className="app-chrome__description">{screenMeta[screen].description}</p>
          </div>

          <div className="app-chrome__meta">
            <span className="app-pill app-pill--brand">{copy.badge}</span>
            <span className="app-pill">
              {currentStep + 1} / {screens.length}
            </span>
          </div>
        </header>

        <nav className="journey-progress" aria-label="정리 진행 단계">
          {screens.map((progressScreen, index) => {
            const state =
              index < currentStep ? 'done' : index === currentStep ? 'active' : 'upcoming'

            return (
              <div
                className={`journey-step journey-step--${state}`}
                key={progressScreen}
              >
                <span className="journey-step__bar" />
                <span className="journey-step__label">{screenMeta[progressScreen].label}</span>
              </div>
            )
          })}
        </nav>

        {flow.errorMessage != null ? (
          <section className="feedback-card feedback-card--error">
            <div>
              <p className="feedback-card__eyebrow">사진을 불러오지 못했어요</p>
              <h2>한 번 더 시도해 주세요.</h2>
              <p>{flow.errorMessage}</p>
            </div>

            <Button display="full" size="large" variant="weak" onClick={() => void handlePickPhotos()}>
              다시 시도
            </Button>
          </section>
        ) : null}

        {content}
      </div>

      {screen === 'discover' ? (
        <FixedBottomCTA
          hideOnScroll
          onClick={() => navigate(flow.photos.length > 0 ? 'review' : 'upload', 'push')}
        >
          {flow.photos.length > 0 ? '선택한 사진 이어서 보기' : '내 여정 추가하기'}
        </FixedBottomCTA>
      ) : null}

      {screen === 'upload' ? (
        flow.photos.length > 0 ? (
          <FixedBottomCTA hideOnScroll onClick={() => navigate('review', 'push')}>
            선택한 사진 확인하기
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA hideOnScroll onClick={() => void handlePickPhotos()}>
            {copy.pickerLabel}
          </FixedBottomCTA>
        )
      ) : null}

      {screen === 'review' ? (
        <FixedBottomCTA hideOnScroll disabled={flow.photos.length === 0} onClick={handleStartOrganizing}>
          이 사진으로 정리하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'timeline' ? (
        <FixedBottomCTA hideOnScroll disabled={currentDraft == null} onClick={handleOpenPublish}>
          이 여정 게시하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'publish' ? (
        flow.publishStatus === 'complete' ? (
          <FixedBottomCTA hideOnScroll onClick={handleRestart}>
            새 여정 만들기
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA
            hideOnScroll
            disabled={currentDraft == null || flow.publishStatus === 'publishing'}
            loading={flow.publishStatus === 'publishing'}
            onClick={handlePublish}
          >
            모먼트북 페이지 만들기
          </FixedBottomCTA>
        )
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

function getPhotoSelectionMessage(error: unknown) {
  if (error instanceof FetchAlbumPhotosPermissionError) {
    return '사진 접근 권한이 있어야 선택한 사진을 모먼트북으로 정리할 수 있어요.'
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '사진을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
}

export default App
