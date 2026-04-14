import {
  FetchAlbumPhotosPermissionError,
  Storage,
  env,
  fetchAlbumPhotos,
  generateHapticFeedback,
  getAppsInTossGlobals,
  getDeviceId,
  getLocale,
  getNetworkStatus,
  getOperationalEnvironment,
  getSchemeUri,
  getTossAppVersion,
  type NetworkStatus,
} from '@apps-in-toss/web-framework'

const launchMarkerStorageKey = 'momentbook:last-launch-marker'

export type RuntimeEnvironment = 'browser' | 'sandbox' | 'toss'

export interface RuntimeSnapshot {
  environment: RuntimeEnvironment
  bridgeStatus: 'local-browser' | 'connected'
  brandDisplayName: string | null
  deploymentId: string | null
  deviceId: string | null
  lastLaunchMarker: string | null
  locale: string | null
  networkStatus: NetworkStatus | null
  schemeUri: string | null
  tossAppVersion: string | null
}

export interface RuntimeActionResult {
  ok: boolean
  message: string
}

export interface AlbumPhoto {
  id: string
  dataUrl: string
}

export { FetchAlbumPhotosPermissionError }

export async function getRuntimeSnapshot(): Promise<RuntimeSnapshot> {
  const environment = getEnvironment()
  const globals = readConstant(getAppsInTossGlobals)

  return {
    environment,
    bridgeStatus: environment === 'browser' ? 'local-browser' : 'connected',
    brandDisplayName: globals?.brandDisplayName ?? null,
    deploymentId: readConstant(() => env.getDeploymentId()),
    deviceId: readConstant(getDeviceId),
    lastLaunchMarker: await runAsync(() => Storage.getItem(launchMarkerStorageKey)),
    locale: readConstant(getLocale),
    networkStatus: await runAsync(getNetworkStatus),
    schemeUri: readConstant(getSchemeUri),
    tossAppVersion: readConstant(getTossAppVersion),
  }
}

export function getRuntimeEnvironment(): RuntimeEnvironment {
  return getEnvironment()
}

export async function fetchMomentbookAlbumPhotos(): Promise<AlbumPhoto[]> {
  const photos = await fetchAlbumPhotos({
    base64: true,
    maxCount: 30,
    maxWidth: 1440,
  })

  return photos.map((photo) => ({
    id: photo.id,
    dataUrl: `data:image/jpeg;base64,${photo.dataUri}`,
  }))
}

export async function triggerSuccessHaptic(): Promise<RuntimeActionResult> {
  if (getEnvironment() === 'browser') {
    return {
      ok: false,
      message: '브라우저 미리보기에서는 햅틱을 호출할 수 없어요.',
    }
  }

  const result = await runAsync(() => generateHapticFeedback({ type: 'success' }))

  if (result === null) {
    return {
      ok: false,
      message: '햅틱을 실행하지 못했어요.',
    }
  }

  return {
    ok: true,
    message: '토스 앱에서 success 햅틱을 요청했어요.',
  }
}

export async function persistLaunchMarker(): Promise<RuntimeActionResult> {
  if (getEnvironment() === 'browser') {
    return {
      ok: false,
      message: 'Storage API는 샌드박스 또는 토스 앱 런타임에서만 확인할 수 있어요.',
    }
  }

  const marker = formatTimestamp(new Date())
  const result = await runAsync(() => Storage.setItem(launchMarkerStorageKey, marker))

  if (result === null) {
    return {
      ok: false,
      message: '마지막 실행 시각을 저장하지 못했어요.',
    }
  }

  return {
    ok: true,
    message: `마지막 실행 시각을 저장했어요. ${marker}`,
  }
}

function getEnvironment(): RuntimeEnvironment {
  return readConstant(getOperationalEnvironment) ?? 'browser'
}

function readConstant<T>(getter: () => T): T | null {
  try {
    return getter()
  } catch {
    return null
  }
}

async function runAsync<T>(runner: () => Promise<T>): Promise<T | null> {
  try {
    return await runner()
  } catch {
    return null
  }
}

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
