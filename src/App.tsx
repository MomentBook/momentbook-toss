import {
  startTransition,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { FixedBottomCTA, useToast } from '@toss/tds-mobile'
import './App.css'
import {
  getFeaturedJourneyById,
} from './lib/featuredJourneys'
import {
  FetchAlbumPhotosPermissionError,
  fetchMomentbookAlbumPhotos,
  getRuntimeEnvironment,
  triggerSuccessHaptic,
  type RuntimeEnvironment,
} from './lib/appsInToss'
import {
  buildHistoryState,
  getRequestedFeaturedJourneyId,
  getRequestedScreen,
  toScreenHash,
  type Screen,
} from './lib/navigation'
import {
  buildJourneyDraft,
  createEmptyJourneyMoments,
  getUnassignedPhotos,
  readBrowserPhotoFiles,
  normalizeTossAlbumPhotos,
  type JourneyDraft,
  type JourneyMoment,
  type PhotoAsset,
} from './lib/momentbook'
import { DiscoverScreen } from './screens/DiscoverScreen'
import { FeaturedJourneyScreen } from './screens/FeaturedJourneyScreen'
import { OrganizingScreen } from './screens/OrganizingScreen'
import { PublishScreen } from './screens/PublishScreen'
import { TimelineScreen } from './screens/TimelineScreen'
import { UploadScreen } from './screens/UploadScreen'

type PublishStatus = 'idle' | 'publishing' | 'complete'

type FlowState = {
  photos: PhotoAsset[]
  moments: JourneyMoment[]
  draft: JourneyDraft | null
  publishStatus: PublishStatus
}

type FlowAction =
  | { type: 'photosSelected'; photos: PhotoAsset[] }
  | { type: 'draftCleared' }
  | { type: 'momentsUpdated'; moments: JourneyMoment[] }
  | { type: 'draftGenerated'; draft: JourneyDraft }
  | { type: 'publishStarted' }
  | { type: 'publishCompleted' }
  | { type: 'resetAll' }

const runtimeCopy: Record<
  RuntimeEnvironment,
  {
    badge: string
    pickLabel: string
  }
> = {
  browser: {
    badge: '웹 미리보기',
    pickLabel: '사진 선택',
  },
  sandbox: {
    badge: '샌드박스',
    pickLabel: '사진첩에서 고르기',
  },
  toss: {
    badge: 'Toss 연결',
    pickLabel: '사진첩에서 고르기',
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
  featuredJourney: {
    label: '샘플 여정',
    description: '둘러본 여정의 흐름을 자세히 볼 수 있어요.',
  },
  upload: {
    label: '사진 업로드',
    description: '사진을 선택해요.',
  },
  organizing: {
    label: '모먼트 구성',
    description: '사진을 직접 고르며 여정의 흐름을 만들어 보세요.',
  },
  timeline: {
    label: '타임라인 확인',
    description: '직접 구성한 여정을 미리 보고 공개 흐름을 다듬어요.',
  },
  publish: {
    label: '발행 준비',
    description: '대표 이미지와 공개용 페이지 구성을 확인해요.',
  },
}

const initialFlowState: FlowState = {
  photos: [],
  moments: [],
  draft: null,
  publishStatus: 'idle',
}

function buildPhotosSelectedState(photos: PhotoAsset[]): FlowState {
  return {
    ...initialFlowState,
    photos,
    moments: createEmptyJourneyMoments(),
  }
}

function clearDraftState(state: FlowState): FlowState {
  return {
    ...state,
    draft: null,
    publishStatus: 'idle',
  }
}

function buildDraftGeneratedState(state: FlowState, draft: JourneyDraft): FlowState {
  return {
    ...clearDraftState(state),
    moments: state.moments,
    draft,
  }
}

function resolveAccessibleScreen(
  requested: Screen,
  state: FlowState,
  featuredJourneyId: string | null,
): Screen {
  if (requested === 'discover') {
    return 'discover'
  }

  if (requested === 'featuredJourney') {
    return getFeaturedJourneyById(featuredJourneyId) != null ? 'featuredJourney' : 'discover'
  }

  if (requested === 'upload') {
    return 'upload'
  }

  if (requested === 'organizing') {
    return state.photos.length > 0 ? requested : 'upload'
  }

  if (requested === 'timeline' || requested === 'publish') {
    if (state.draft != null) {
      return requested
    }

    return 'upload'
  }

  return 'discover'
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'photosSelected':
      return buildPhotosSelectedState(action.photos)
    case 'draftCleared':
      return clearDraftState(state)
    case 'momentsUpdated':
      return {
        ...clearDraftState(state),
        moments: action.moments,
      }
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
    case 'resetAll':
      return initialFlowState
    default:
      return state
  }
}

function App() {
  const initialFeaturedJourneyId = getRequestedFeaturedJourneyId(window.history.state)
  const toast = useToast()
  const [runtime] = useState<RuntimeEnvironment>(() => getRuntimeEnvironment())
  const [flow, dispatch] = useReducer(reducer, initialFlowState)
  const [selectedFeaturedJourneyId, setSelectedFeaturedJourneyId] = useState<string | null>(
    initialFeaturedJourneyId,
  )
  const [screen, setScreen] = useState<Screen>(() =>
    resolveAccessibleScreen(
      getRequestedScreen(window.location.hash, window.history.state) ?? 'discover',
      initialFlowState,
      initialFeaturedJourneyId,
    ),
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const setScreenHistory = useCallback((
    nextScreen: Screen,
    mode: 'push' | 'replace' = 'push',
    options?: {
      featuredJourneyId?: string
    },
  ) => {
    const url = toScreenHash(nextScreen)
    const state = buildHistoryState(nextScreen, options)

    if (mode === 'replace') {
      window.history.replaceState(state, '', url)
    } else {
      window.history.pushState(state, '', url)
    }

    setSelectedFeaturedJourneyId(nextScreen === 'featuredJourney' ? options?.featuredJourneyId ?? null : null)
    setScreen(nextScreen)
  }, [])

  const navigate = useCallback(
    (requested: Screen, mode: 'push' | 'replace' = 'push', stateSnapshot: FlowState = flow) => {
      const nextScreen = resolveAccessibleScreen(requested, stateSnapshot, selectedFeaturedJourneyId)
      setScreenHistory(nextScreen, mode)
    },
    [flow, selectedFeaturedJourneyId, setScreenHistory],
  )

  useEffect(() => {
    window.history.replaceState(
      buildHistoryState(
        screen,
        screen === 'featuredJourney' && selectedFeaturedJourneyId != null
          ? { featuredJourneyId: selectedFeaturedJourneyId }
          : undefined,
      ),
      '',
      toScreenHash(screen),
    )
  }, [screen, selectedFeaturedJourneyId])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const requestedScreen = getRequestedScreen(window.location.hash, event.state) ?? 'discover'
      const nextFeaturedJourneyId = getRequestedFeaturedJourneyId(event.state)
      const nextScreen = resolveAccessibleScreen(requestedScreen, flow, nextFeaturedJourneyId)
      setSelectedFeaturedJourneyId(nextScreen === 'featuredJourney' ? nextFeaturedJourneyId : null)
      setScreen(nextScreen)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [flow])

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

      navigate('upload', screen === 'upload' ? 'replace' : 'push', nextFlow)
    },
    [navigate, screen],
  )

  const selectPhotos = useCallback(
    async (loader: () => Promise<PhotoAsset[]>) => {
      try {
        const photos = await loader()

        if (photos.length === 0) {
          return
        }

        completePhotoSelection(photos)
      } catch (error) {
        toast.openToast(getPhotoSelectionMessage(error), {
          higherThanCTA: true,
        })
      }
    },
    [completePhotoSelection, toast],
  )

  const handlePickPhotos = useCallback(async () => {
    if (runtime === 'browser') {
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

    dispatch({ type: 'draftCleared' })
    navigate('organizing', 'push', nextFlow)
  }, [flow, navigate])

  const handleMomentsUpdated = useCallback((moments: JourneyMoment[]) => {
    startTransition(() => {
      dispatch({ type: 'momentsUpdated', moments })
    })
  }, [])

  const handlePreviewTimeline = useCallback(() => {
    const hasGroupedMoment = flow.moments.some((moment) => moment.photos.length > 0)

    if (flow.photos.length === 0 || !hasGroupedMoment) {
      return
    }

    const unassignedPhotos = getUnassignedPhotos(flow.photos, flow.moments)

    if (unassignedPhotos.length > 0) {
      return
    }

    const draft = buildJourneyDraft(flow.photos, flow.moments)
    const nextFlow = buildDraftGeneratedState(flow, draft)

    startTransition(() => {
      dispatch({ type: 'draftGenerated', draft })
    })

    void triggerSuccessHaptic()
    navigate('timeline', 'push', nextFlow)
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

  const handleEditMoments = useCallback(() => {
    const nextFlow = clearDraftState(flow)

    dispatch({ type: 'draftCleared' })
    navigate('organizing', 'push', nextFlow)
  }, [flow, navigate])

  const handleOpenFeaturedJourney = useCallback(
    (journeyId: string) => {
      setScreenHistory('featuredJourney', 'push', { featuredJourneyId: journeyId })
    },
    [setScreenHistory],
  )

  const handleBackToDiscover = useCallback(() => {
    navigate('discover', 'replace')
  }, [navigate])

  const currentDraft = flow.draft
  const currentFeaturedJourney = getFeaturedJourneyById(selectedFeaturedJourneyId)
  const copy = runtimeCopy[runtime]
  const unassignedPhotoCount = getUnassignedPhotos(flow.photos, flow.moments).length
  const hasGroupedMoment = flow.moments.some((moment) => moment.photos.length > 0)
  const shouldShowChrome =
    screen !== 'upload' && screen !== 'discover' && screen !== 'featuredJourney'

  let content = null

  switch (screen) {
    case 'discover':
      content = (
        <DiscoverScreen
          onOpenJourney={handleOpenFeaturedJourney}
        />
      )
      break
    case 'featuredJourney':
      content =
        currentFeaturedJourney == null ? null : (
          <FeaturedJourneyScreen
            journey={currentFeaturedJourney}
            onBack={handleBackToDiscover}
          />
        )
      break
    case 'upload':
      content = (
        <UploadScreen
          pickLabel={copy.pickLabel}
          photos={flow.photos}
          onPickPhotos={() => void handlePickPhotos()}
        />
      )
      break
    case 'organizing':
      content = (
        <OrganizingScreen
          moments={flow.moments}
          photos={flow.photos}
          onChangeMoments={handleMomentsUpdated}
        />
      )
      break
    case 'timeline':
      content =
        currentDraft == null ? null : (
          <TimelineScreen
            draft={currentDraft}
            onChangePhotos={() => void handlePickPhotos()}
            onEditMoments={handleEditMoments}
          />
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
        {shouldShowChrome ? (
          <header className="app-chrome">
            <div>
              <p className="app-chrome__eyebrow">Momentbook</p>
              <h1 className="app-chrome__title">{screenMeta[screen].label}</h1>
            </div>

            <div className="app-chrome__meta">
              <span className="app-pill app-pill--brand">{copy.badge}</span>
            </div>
          </header>
        ) : null}

        {content}
      </div>

      {screen === 'discover' ? (
        <FixedBottomCTA hideOnScroll onClick={() => navigate('upload', 'push')}>
          {flow.photos.length > 0 ? '선택한 사진 이어서 정리하기' : '내 여정 추가하기'}
        </FixedBottomCTA>
      ) : null}

      {screen === 'featuredJourney' ? (
        <FixedBottomCTA hideOnScroll onClick={() => navigate('upload', 'push')}>
          {flow.photos.length > 0 ? '선택한 사진 이어서 정리하기' : '내 여정 시작하기'}
        </FixedBottomCTA>
      ) : null}

      {screen === 'upload' ? (
        <FixedBottomCTA hideOnScroll disabled={flow.photos.length === 0} onClick={handleStartOrganizing}>
          모먼트 구성하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'organizing' ? (
        <FixedBottomCTA
          hideOnScroll
          disabled={!hasGroupedMoment || unassignedPhotoCount > 0}
          onClick={handlePreviewTimeline}
        >
          타임라인 미리보기
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
