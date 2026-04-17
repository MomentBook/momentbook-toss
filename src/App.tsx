import {
  startTransition,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { FixedBottomCTA, Result } from '@toss/tds-mobile'
import './App.css'
import {
  FetchAlbumPhotosPermissionError,
  fetchMomentbookAlbumPhotos,
  getRuntimeEnvironment,
  triggerSuccessHaptic,
  type RuntimeEnvironment,
} from './lib/appsInToss'
import { buildHistoryState, getRequestedScreen, toScreenHash, type Screen } from './lib/navigation'
import {
  buildDummyJourneyDraft,
  normalizeTossAlbumPhotos,
  organizingSteps,
  readBrowserPhotoFiles,
  type JourneyDraft,
  type PhotoAsset,
} from './lib/momentbook'
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
    badge: '웹',
    helper: '사진을 선택해 주세요.',
    pickerLabel: '사진 선택',
    emptyDescription: '사진을 선택해 주세요.',
  },
  sandbox: {
    badge: '샌드박스',
    helper: '토스 사진첩에서 선택해요.',
    pickerLabel: '사진첩 열기',
    emptyDescription: '사진을 선택해 주세요.',
  },
  toss: {
    badge: 'Toss 앱',
    helper: '토스 사진첩에서 바로 시작해요.',
    pickerLabel: '사진첩 열기',
    emptyDescription: '사진을 선택해 주세요.',
  },
}

const initialFlowState: FlowState = {
  photos: [],
  draft: null,
  publishStatus: 'idle',
  errorMessage: null,
}

function resolveAccessibleScreen(requested: Screen, state: FlowState): Screen {
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

  return 'upload'
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'photosSelected':
      return {
        photos: action.photos,
        draft: null,
        publishStatus: 'idle',
        errorMessage: null,
      }
    case 'draftCleared':
      return {
        ...state,
        draft: null,
        publishStatus: 'idle',
        errorMessage: null,
      }
    case 'draftGenerated':
      return {
        ...state,
        draft: action.draft,
        publishStatus: 'idle',
        errorMessage: null,
      }
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
      getRequestedScreen(window.location.hash, window.history.state) ?? 'upload',
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
      const requestedScreen = getRequestedScreen(window.location.hash, event.state) ?? 'upload'
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

      startTransition(() => {
        dispatch({ type: 'draftGenerated', draft })
      })

      void triggerSuccessHaptic()
      navigate('timeline', 'replace', {
        ...flow,
        draft,
      })
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
      startTransition(() => {
        dispatch({ type: 'photosSelected', photos })
      })

      navigate(
        'review',
        screen === 'review' ? 'replace' : 'push',
        {
          photos,
          draft: null,
          publishStatus: 'idle',
          errorMessage: null,
        },
      )
    },
    [navigate, screen],
  )

  const handlePickPhotos = useCallback(async () => {
    dispatch({ type: 'errorCleared' })

    if (runtime === 'browser') {
      fileInputRef.current?.click()
      return
    }

    try {
      const albumPhotos = await fetchMomentbookAlbumPhotos()

      if (albumPhotos.length === 0) {
        return
      }

      completePhotoSelection(normalizeTossAlbumPhotos(albumPhotos))
    } catch (error) {
      dispatch({
        type: 'failed',
        message: getPhotoSelectionMessage(error),
      })
    }
  }, [completePhotoSelection, runtime])

  const handleBrowserSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''

    if (files.length === 0) {
      return
    }

    dispatch({ type: 'errorCleared' })

    try {
      const photos = await readBrowserPhotoFiles(files)
      completePhotoSelection(photos)
    } catch (error) {
      dispatch({
        type: 'failed',
        message: getPhotoSelectionMessage(error),
      })
    }
  }

  const handleStartOrganizing = useCallback(() => {
    if (flow.photos.length === 0) {
      return
    }

    setOrganizingStepIndex(0)
    dispatch({ type: 'draftCleared' })
    navigate(
      'organizing',
      'push',
      {
        ...flow,
        draft: null,
        publishStatus: 'idle',
        errorMessage: null,
      },
    )
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
    navigate('upload', 'replace', initialFlowState)
  }, [navigate])

  const currentDraft = flow.draft
  const copy = runtimeCopy[runtime]

  let content = null

  switch (screen) {
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
          runtimeLabel={copy.badge}
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
      <div className="screen-shell">
        {flow.errorMessage != null ? (
          <section className="surface-card">
            <Result
              title="다시 시도해 주세요"
              description={flow.errorMessage}
              button={<Result.Button onClick={() => void handlePickPhotos()}>다시 시도</Result.Button>}
            />
          </section>
        ) : null}

        {content}
      </div>

      {screen === 'upload' ? (
        flow.photos.length > 0 ? (
          <FixedBottomCTA hideOnScroll onClick={() => navigate('review', 'push')}>
            사진 확인
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA hideOnScroll onClick={() => void handlePickPhotos()}>
            {copy.pickerLabel}
          </FixedBottomCTA>
        )
      ) : null}

      {screen === 'review' ? (
        <FixedBottomCTA hideOnScroll disabled={flow.photos.length === 0} onClick={handleStartOrganizing}>
          정리하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'timeline' ? (
        <FixedBottomCTA hideOnScroll disabled={currentDraft == null} onClick={handleOpenPublish}>
          공개하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'publish' ? (
        flow.publishStatus === 'complete' ? (
          <FixedBottomCTA hideOnScroll onClick={handleRestart}>
            다시 시작하기
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA
            hideOnScroll
            disabled={currentDraft == null || flow.publishStatus === 'publishing'}
            loading={flow.publishStatus === 'publishing'}
            onClick={handlePublish}
          >
            페이지 만들기
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
    return '사진 접근 권한을 허용해야 선택한 사진을 여정으로 정리할 수 있어요.'
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '사진을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
}

export default App
