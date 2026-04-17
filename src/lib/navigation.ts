export const screens = ['upload', 'review', 'organizing', 'timeline', 'publish'] as const

export type Screen = (typeof screens)[number]

type HistoryState = {
  screen: Screen
}

export function buildHistoryState(screen: Screen): HistoryState {
  return { screen }
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

function isHistoryState(value: unknown): value is HistoryState {
  return typeof value === 'object' && value != null && 'screen' in value && isScreen(value.screen)
}

function isScreen(value: unknown): value is Screen {
  return typeof value === 'string' && screens.includes(value as Screen)
}
