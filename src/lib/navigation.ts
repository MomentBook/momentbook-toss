export const screens = [
  'discover',
  'featuredJourney',
  'featuredTimelineDetail',
  'upload',
  'organizing',
  'timeline',
  'publish',
] as const

export type Screen = (typeof screens)[number]

export type HistoryState = {
  screen: Screen
  featuredJourneyId?: string
  featuredJourneyMomentId?: string
}

export function buildHistoryState(
  screen: Screen,
  options?: {
    featuredJourneyId?: string
    featuredJourneyMomentId?: string
  },
): HistoryState {
  return {
    screen,
    ...(options?.featuredJourneyId != null ? { featuredJourneyId: options.featuredJourneyId } : {}),
    ...(options?.featuredJourneyMomentId != null
      ? { featuredJourneyMomentId: options.featuredJourneyMomentId }
      : {}),
  }
}

export function getRequestedScreen(hash: string, state: unknown): Screen | null {
  if (isHistoryState(state)) {
    return state.screen
  }

  const normalizedHash = hash.replace(/^#/, '')
  return isScreen(normalizedHash) ? normalizedHash : null
}

export function toScreenHash(screen: Screen) {
  return `#${screen}`
}

export function getRequestedFeaturedJourneyId(state: unknown) {
  return isHistoryState(state) ? state.featuredJourneyId ?? null : null
}

export function getRequestedFeaturedJourneyMomentId(state: unknown) {
  return isHistoryState(state) ? state.featuredJourneyMomentId ?? null : null
}

function isHistoryState(value: unknown): value is HistoryState {
  return (
    typeof value === 'object' &&
    value != null &&
    'screen' in value &&
    isScreen(value.screen) &&
    (!('featuredJourneyId' in value) || typeof value.featuredJourneyId === 'string') &&
    (!('featuredJourneyMomentId' in value) || typeof value.featuredJourneyMomentId === 'string')
  )
}

function isScreen(value: unknown): value is Screen {
  return typeof value === 'string' && screens.includes(value as Screen)
}
