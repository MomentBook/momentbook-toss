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
  getFeaturedJourneyMomentById,
} from './lib/featuredJourneys'
import {
  FetchAlbumPhotosPermissionError,
  fetchMomentbookAlbumPhotos,
  getRuntimeEnvironment,
  requestTossAppLogin,
  triggerSuccessHaptic,
  type RuntimeEnvironment,
} from './lib/appsInToss'
import { authenticateWithTossAuthorization } from './lib/momentbookApi'
import {
  buildHistoryState,
  getRequestedFeaturedJourneyId,
  getRequestedFeaturedJourneyMomentId,
  getRequestedScreen,
  toScreenHash,
  type Screen,
} from './lib/navigation'
import {
  buildJourneyDraft,
  createDefaultJourneyDetails,
  createEmptyJourneyMoments,
  readBrowserPhotoFiles,
  normalizeTossAlbumPhotos,
  type JourneyDraft,
  type JourneyDetails,
  type JourneyMoment,
  type PhotoAsset,
} from './lib/momentbook'
import { DiscoverScreen } from './screens/DiscoverScreen'
import { FeaturedJourneyScreen } from './screens/FeaturedJourneyScreen'
import { FeaturedTimelineDetailScreen } from './screens/FeaturedTimelineDetailScreen'
import { JourneyBasicsScreen } from './screens/JourneyBasicsScreen'
import { OrganizingScreen } from './screens/OrganizingScreen'
import { PrivateDraftScreen } from './screens/PrivateDraftScreen'
import { TimelineScreen } from './screens/TimelineScreen'
import { UploadScreen } from './screens/UploadScreen'

type PrivateDraftStatus = 'idle' | 'authenticating' | 'saving' | 'failed' | 'complete'
type PhotoSelectionStatus = 'idle' | 'loading'

type FlowState = {
  photos: PhotoAsset[]
  details: JourneyDetails
  moments: JourneyMoment[]
  draft: JourneyDraft | null
  privateDraftStatus: PrivateDraftStatus
  privateDraftErrorMessage: string | null
  photoSelectionStatus: PhotoSelectionStatus
  photoSelectionErrorMessage: string | null
}

type FlowAction =
  | { type: 'photoSelectionStarted' }
  | { type: 'photoSelectionFinished' }
  | { type: 'photoSelectionFailed'; message: string }
  | { type: 'photosSelected'; photos: PhotoAsset[] }
  | { type: 'draftCleared' }
  | { type: 'journeyDetailsUpdated'; details: JourneyDetails }
  | { type: 'momentsUpdated'; moments: JourneyMoment[] }
  | { type: 'draftGenerated'; draft: JourneyDraft }
  | { type: 'privateDraftAuthStarted' }
  | { type: 'privateDraftSaveStarted' }
  | { type: 'privateDraftSaveCompleted' }
  | { type: 'privateDraftSaveFailed'; message: string }
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
    label: '다른 사람의 여정',
    description: '둘러본 여정의 흐름을 자세히 볼 수 있어요.',
  },
  featuredTimelineDetail: {
    label: '타임라인 상세',
    description: '선택한 장면의 사진과 설명을 자세히 볼 수 있어요.',
  },
  upload: {
    label: '사진 업로드',
    description: '사진을 선택해요.',
  },
  journeyBasics: {
    label: '여정 정보',
    description: '제목, 설명, 대표 사진만 먼저 정해요.',
  },
  organizing: {
    label: '모먼트 정리',
    description: '보여줄 장면만 모먼트로 묶고, 남은 사진은 함께 저장해요.',
  },
  timeline: {
    label: '저장 전 확인',
    description: '직접 구성한 비공개 여정의 저장 전 모습을 확인해요.',
  },
  privateDraft: {
    label: '비공개 저장',
    description: 'Toss 로그인 후 서버에 비공개로 저장해요.',
  },
}

const initialFlowState: FlowState = {
  photos: [],
  details: createDefaultJourneyDetails([]),
  moments: [],
  draft: null,
  privateDraftStatus: 'idle',
  privateDraftErrorMessage: null,
  photoSelectionStatus: 'idle',
  photoSelectionErrorMessage: null,
}

function buildPhotosSelectedState(photos: PhotoAsset[]): FlowState {
  return {
    ...initialFlowState,
    photos,
    details: createDefaultJourneyDetails(photos),
    moments: createEmptyJourneyMoments(),
  }
}

function clearDraftState(state: FlowState): FlowState {
  return {
    ...state,
    draft: null,
    privateDraftStatus: 'idle',
    privateDraftErrorMessage: null,
    photoSelectionStatus: 'idle',
    photoSelectionErrorMessage: null,
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
  featuredJourneyMomentId: string | null,
): Screen {
  if (requested === 'discover') {
    return 'discover'
  }

  if (requested === 'featuredJourney') {
    return getFeaturedJourneyById(featuredJourneyId) != null ? 'featuredJourney' : 'discover'
  }

  if (requested === 'featuredTimelineDetail') {
    const journey = getFeaturedJourneyById(featuredJourneyId)

    if (journey == null) {
      return 'discover'
    }

    return getFeaturedJourneyMomentById(journey, featuredJourneyMomentId) != null
      ? 'featuredTimelineDetail'
      : 'featuredJourney'
  }

  if (requested === 'upload') {
    return 'upload'
  }

  if (requested === 'journeyBasics' || requested === 'organizing') {
    return state.photos.length > 0 ? requested : 'upload'
  }

  if (requested === 'timeline' || requested === 'privateDraft') {
    if (state.draft != null) {
      return requested
    }

    return 'upload'
  }

  return 'discover'
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case 'photoSelectionStarted':
      return {
        ...state,
        photoSelectionStatus: 'loading',
        photoSelectionErrorMessage: null,
      }
    case 'photoSelectionFinished':
      return {
        ...state,
        photoSelectionStatus: 'idle',
      }
    case 'photoSelectionFailed':
      return {
        ...state,
        photoSelectionStatus: 'idle',
        photoSelectionErrorMessage: action.message,
      }
    case 'photosSelected':
      return buildPhotosSelectedState(action.photos)
    case 'draftCleared':
      return clearDraftState(state)
    case 'journeyDetailsUpdated':
      return {
        ...clearDraftState(state),
        details: action.details,
      }
    case 'momentsUpdated':
      return {
        ...clearDraftState(state),
        moments: action.moments,
      }
    case 'draftGenerated':
      return buildDraftGeneratedState(state, action.draft)
    case 'privateDraftAuthStarted':
      return {
        ...state,
        privateDraftStatus: 'authenticating',
        privateDraftErrorMessage: null,
      }
    case 'privateDraftSaveStarted':
      return {
        ...state,
        privateDraftStatus: 'saving',
        privateDraftErrorMessage: null,
      }
    case 'privateDraftSaveCompleted':
      return {
        ...state,
        privateDraftStatus: 'complete',
        privateDraftErrorMessage: null,
      }
    case 'privateDraftSaveFailed':
      return {
        ...state,
        privateDraftStatus: 'failed',
        privateDraftErrorMessage: action.message,
      }
    case 'resetAll':
      return initialFlowState
    default:
      return state
  }
}

function App() {
  const initialFeaturedJourneyId = getRequestedFeaturedJourneyId(window.history.state)
  const initialFeaturedJourneyMomentId = getRequestedFeaturedJourneyMomentId(window.history.state)
  const toast = useToast()
  const [runtime] = useState<RuntimeEnvironment>(() => getRuntimeEnvironment())
  const [flow, dispatch] = useReducer(reducer, initialFlowState)
  const [selectedFeaturedJourneyId, setSelectedFeaturedJourneyId] = useState<string | null>(
    initialFeaturedJourneyId,
  )
  const [selectedFeaturedJourneyMomentId, setSelectedFeaturedJourneyMomentId] = useState<string | null>(
    initialFeaturedJourneyMomentId,
  )
  const [screen, setScreen] = useState<Screen>(() =>
    resolveAccessibleScreen(
      getRequestedScreen(window.location.hash, window.history.state) ?? 'upload',
      initialFlowState,
      initialFeaturedJourneyId,
      initialFeaturedJourneyMomentId,
    ),
  )
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const setScreenHistory = useCallback((
    nextScreen: Screen,
    mode: 'push' | 'replace' = 'push',
    options?: {
      featuredJourneyId?: string
      featuredJourneyMomentId?: string
    },
  ) => {
    const url = toScreenHash(nextScreen)
    const state = buildHistoryState(nextScreen, options)

    if (mode === 'replace') {
      window.history.replaceState(state, '', url)
    } else {
      window.history.pushState(state, '', url)
    }

    setSelectedFeaturedJourneyId(
      nextScreen === 'featuredJourney' || nextScreen === 'featuredTimelineDetail'
        ? options?.featuredJourneyId ?? null
        : null,
    )
    setSelectedFeaturedJourneyMomentId(
      nextScreen === 'featuredTimelineDetail' ? options?.featuredJourneyMomentId ?? null : null,
    )
    setScreen(nextScreen)
  }, [])

  const navigate = useCallback(
    (requested: Screen, mode: 'push' | 'replace' = 'push', stateSnapshot: FlowState = flow) => {
      const nextScreen = resolveAccessibleScreen(
        requested,
        stateSnapshot,
        selectedFeaturedJourneyId,
        selectedFeaturedJourneyMomentId,
      )
      setScreenHistory(nextScreen, mode)
    },
    [flow, selectedFeaturedJourneyId, selectedFeaturedJourneyMomentId, setScreenHistory],
  )

  useEffect(() => {
    window.history.replaceState(
      buildHistoryState(
        screen,
        screen === 'featuredJourney' && selectedFeaturedJourneyId != null
          ? { featuredJourneyId: selectedFeaturedJourneyId }
          : screen === 'featuredTimelineDetail' &&
              selectedFeaturedJourneyId != null &&
              selectedFeaturedJourneyMomentId != null
            ? {
                featuredJourneyId: selectedFeaturedJourneyId,
                featuredJourneyMomentId: selectedFeaturedJourneyMomentId,
              }
          : undefined,
      ),
      '',
      toScreenHash(screen),
    )
  }, [screen, selectedFeaturedJourneyId, selectedFeaturedJourneyMomentId])

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const requestedScreen = getRequestedScreen(window.location.hash, event.state) ?? 'upload'
      const nextFeaturedJourneyId = getRequestedFeaturedJourneyId(event.state)
      const nextFeaturedJourneyMomentId = getRequestedFeaturedJourneyMomentId(event.state)
      const nextScreen = resolveAccessibleScreen(
        requestedScreen,
        flow,
        nextFeaturedJourneyId,
        nextFeaturedJourneyMomentId,
      )
      setSelectedFeaturedJourneyId(
        nextScreen === 'featuredJourney' || nextScreen === 'featuredTimelineDetail'
          ? nextFeaturedJourneyId
          : null,
      )
      setSelectedFeaturedJourneyMomentId(
        nextScreen === 'featuredTimelineDetail' ? nextFeaturedJourneyMomentId : null,
      )
      setScreen(nextScreen)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [flow])

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
      dispatch({ type: 'photoSelectionStarted' })

      try {
        const photos = await loader()

        if (photos.length === 0) {
          dispatch({ type: 'photoSelectionFinished' })
          return
        }

        completePhotoSelection(photos)
      } catch (error) {
        const message = getPhotoSelectionMessage(error)

        dispatch({ type: 'photoSelectionFailed', message })
        toast.openToast(message, {
          higherThanCTA: true,
        })
      }
    },
    [completePhotoSelection, toast],
  )

  const handlePickPhotos = useCallback(async () => {
    if (flow.photoSelectionStatus === 'loading') {
      return
    }

    if (runtime === 'browser') {
      fileInputRef.current?.click()
      return
    }

    await selectPhotos(async () => normalizeTossAlbumPhotos(await fetchMomentbookAlbumPhotos()))
  }, [flow.photoSelectionStatus, runtime, selectPhotos])

  const handleBrowserSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''

    if (files.length === 0) {
      return
    }

    await selectPhotos(() => readBrowserPhotoFiles(files))
  }

  const handleStartOrganizing = useCallback(() => {
    if (flow.photos.length === 0 || flow.photoSelectionStatus === 'loading') {
      return
    }

    const nextFlow = clearDraftState(flow)

    dispatch({ type: 'draftCleared' })
    navigate('journeyBasics', 'push', nextFlow)
  }, [flow, navigate])

  const handleStartMomentCompose = useCallback(() => {
    if (flow.photos.length === 0 || flow.photoSelectionStatus === 'loading') {
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

  const handleJourneyDetailsUpdated = useCallback((details: JourneyDetails) => {
    startTransition(() => {
      dispatch({ type: 'journeyDetailsUpdated', details })
    })
  }, [])

  const handlePreviewTimeline = useCallback(() => {
    const hasGroupedMoment = flow.moments.some((moment) => moment.photos.length > 0)

    if (flow.photos.length === 0 || !hasGroupedMoment) {
      return
    }

    const draft = buildJourneyDraft(flow.photos, flow.moments, flow.details)
    const nextFlow = buildDraftGeneratedState(flow, draft)

    startTransition(() => {
      dispatch({ type: 'draftGenerated', draft })
    })

    void triggerSuccessHaptic()
    navigate('timeline', 'push', nextFlow)
  }, [flow, navigate])

  const handleOpenPrivateDraft = useCallback(() => {
    if (flow.draft == null) {
      return
    }

    navigate('privateDraft', 'push')
  }, [flow.draft, navigate])

  const handleSavePrivateDraft = useCallback(async () => {
    if (
      flow.draft == null ||
      flow.privateDraftStatus === 'authenticating' ||
      flow.privateDraftStatus === 'saving' ||
      flow.privateDraftStatus === 'complete'
    ) {
      return
    }

    dispatch({ type: 'privateDraftAuthStarted' })

    try {
      const loginResult = await requestTossAppLogin()

      dispatch({ type: 'privateDraftSaveStarted' })
      await authenticateWithTossAuthorization(loginResult)

      throw new Error(
        'Toss 로그인은 확인했지만 비공개 여정 저장 API 계약이 아직 연결되지 않았어요.',
      )
    } catch (error) {
      const message = getPrivateDraftSaveMessage(error)

      dispatch({ type: 'privateDraftSaveFailed', message })
      toast.openToast(message, {
        higherThanCTA: true,
      })
    }
  }, [flow.draft, flow.privateDraftStatus, toast])

  const handleRestart = useCallback(() => {
    dispatch({ type: 'resetAll' })
    navigate('upload', 'replace', initialFlowState)
  }, [navigate])

  const handleEditJourneyBasics = useCallback(() => {
    const nextFlow = clearDraftState(flow)

    dispatch({ type: 'draftCleared' })
    navigate('journeyBasics', 'push', nextFlow)
  }, [flow, navigate])

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

  const handleOpenFeaturedTimelineDetail = useCallback(
    (momentId: string) => {
      if (selectedFeaturedJourneyId == null) {
        return
      }

      setScreenHistory('featuredTimelineDetail', 'push', {
        featuredJourneyId: selectedFeaturedJourneyId,
        featuredJourneyMomentId: momentId,
      })
    },
    [selectedFeaturedJourneyId, setScreenHistory],
  )

  const handleBackToDiscover = useCallback(() => {
    navigate('discover', 'replace')
  }, [navigate])

  const handleBackToFeaturedJourney = useCallback(() => {
    if (selectedFeaturedJourneyId == null) {
      navigate('discover', 'replace')
      return
    }

    setScreenHistory('featuredJourney', 'replace', {
      featuredJourneyId: selectedFeaturedJourneyId,
    })
  }, [navigate, selectedFeaturedJourneyId, setScreenHistory])

  const currentDraft = flow.draft
  const currentFeaturedJourney = getFeaturedJourneyById(selectedFeaturedJourneyId)
  const currentFeaturedJourneyMoment = getFeaturedJourneyMomentById(
    currentFeaturedJourney,
    selectedFeaturedJourneyMomentId,
  )
  const copy = runtimeCopy[runtime]
  const hasGroupedMoment = flow.moments.some((moment) => moment.photos.length > 0)
  const shouldShowChrome =
    screen !== 'upload' &&
    screen !== 'discover' &&
    screen !== 'featuredJourney' &&
    screen !== 'featuredTimelineDetail'

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
            onOpenTimeline={handleOpenFeaturedTimelineDetail}
          />
        )
      break
    case 'featuredTimelineDetail':
      content =
        currentFeaturedJourney == null || currentFeaturedJourneyMoment == null ? null : (
          <FeaturedTimelineDetailScreen
            journey={currentFeaturedJourney}
            moment={currentFeaturedJourneyMoment}
            momentIndex={Math.max(
              currentFeaturedJourney.moments.findIndex(
                (moment) => moment.id === currentFeaturedJourneyMoment.id,
              ),
              0,
            )}
            onBack={handleBackToFeaturedJourney}
          />
        )
      break
    case 'upload':
      content = (
        <UploadScreen
          isPickingPhotos={flow.photoSelectionStatus === 'loading'}
          pickLabel={copy.pickLabel}
          photos={flow.photos}
          selectionErrorMessage={flow.photoSelectionErrorMessage}
          onPickPhotos={() => void handlePickPhotos()}
        />
      )
      break
    case 'journeyBasics':
      content = (
        <JourneyBasicsScreen
          details={flow.details}
          isPickingPhotos={flow.photoSelectionStatus === 'loading'}
          photos={flow.photos}
          selectionErrorMessage={flow.photoSelectionErrorMessage}
          onChangeDetails={handleJourneyDetailsUpdated}
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
            onEditJourneyBasics={handleEditJourneyBasics}
            onEditMoments={handleEditMoments}
          />
        )
      break
    case 'privateDraft':
      content =
        currentDraft == null ? null : (
          <PrivateDraftScreen
            draft={currentDraft}
            saveErrorMessage={flow.privateDraftErrorMessage}
            saveStatus={flow.privateDraftStatus}
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
              <p className="app-chrome__eyebrow">MomentBook</p>
              <h1 className="app-chrome__title">{screenMeta[screen].label}</h1>
              <p className="app-chrome__description">{screenMeta[screen].description}</p>
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
          {flow.photos.length > 0 ? '내 여정 이어서 만들기' : '내 여정 만들기'}
        </FixedBottomCTA>
      ) : null}

      {screen === 'upload' ? (
        <FixedBottomCTA
          hideOnScroll
          disabled={flow.photos.length === 0 || flow.photoSelectionStatus === 'loading'}
          onClick={handleStartOrganizing}
        >
          여정 정보 입력하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'journeyBasics' ? (
        <FixedBottomCTA
          hideOnScroll
          disabled={flow.photos.length === 0 || flow.photoSelectionStatus === 'loading'}
          onClick={handleStartMomentCompose}
        >
          모먼트 정리하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'organizing' ? (
        <FixedBottomCTA
          hideOnScroll
          disabled={!hasGroupedMoment}
          onClick={handlePreviewTimeline}
        >
          타임라인 확인하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'timeline' ? (
        <FixedBottomCTA hideOnScroll disabled={currentDraft == null} onClick={handleOpenPrivateDraft}>
          저장 전 확인하기
        </FixedBottomCTA>
      ) : null}

      {screen === 'privateDraft' ? (
        flow.privateDraftStatus === 'complete' ? (
          <FixedBottomCTA hideOnScroll onClick={handleRestart}>
            새 여정 만들기
          </FixedBottomCTA>
        ) : (
          <FixedBottomCTA
            hideOnScroll
            disabled={
              currentDraft == null ||
              flow.privateDraftStatus === 'authenticating' ||
              flow.privateDraftStatus === 'saving'
            }
            loading={
              flow.privateDraftStatus === 'authenticating' ||
              flow.privateDraftStatus === 'saving'
            }
            onClick={() => void handleSavePrivateDraft()}
          >
            Toss 로그인하고 저장하기
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

function getPrivateDraftSaveMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return '비공개 저장을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.'
}

export default App
