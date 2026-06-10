import {
  FetchAlbumPhotosPermissionError,
  fetchAlbumPhotos,
  generateHapticFeedback,
  getOperationalEnvironment,
} from '@apps-in-toss/web-framework'

export type RuntimeEnvironment = 'browser' | 'sandbox' | 'toss'

export interface RuntimeActionResult {
  ok: boolean
  message: string
}

export interface AlbumPhoto {
  id: string
  dataUrl: string
}

export { FetchAlbumPhotosPermissionError }

export type TossAppLoginResult = {
  authorizationCode: string
  referrer: string
}

type AlbumPhotoPermissionStatus =
  | Awaited<ReturnType<typeof fetchAlbumPhotos.getPermission>>
  | 'osPermissionDenied'

type AppsInTossFrameworkWithLogin = typeof import('@apps-in-toss/web-framework') & {
  appLogin?: () => Promise<unknown>
}

export function getRuntimeEnvironment(): RuntimeEnvironment {
  return getEnvironment()
}

export async function fetchMomentbookAlbumPhotos(): Promise<AlbumPhoto[]> {
  await ensureAlbumPhotoPermission()

  const photos = await fetchAlbumPhotos({
    base64: true,
    maxCount: 30,
    maxWidth: 1440,
  })

  if (!Array.isArray(photos)) {
    throw new Error('사진 목록 응답이 올바르지 않아요. 잠시 후 다시 시도해 주세요.')
  }

  return photos.map((photo) => ({
    id: photo.id,
    dataUrl: `data:image/jpeg;base64,${photo.dataUri}`,
  }))
}

export async function triggerSuccessHaptic(): Promise<RuntimeActionResult> {
  if (getEnvironment() === 'browser') {
    return {
      ok: false,
      message: '브라우저 미리보기에서는 햅틱을 실행할 수 없어요.',
    }
  }

  try {
    await generateHapticFeedback({ type: 'success' })
  } catch {
    return {
      ok: false,
      message: '햅틱 실행에 실패했어요.',
    }
  }

  return {
    ok: true,
    message: '토스 앱에서 success 햅틱을 요청했어요.',
  }
}

export async function requestTossAppLogin(): Promise<TossAppLoginResult> {
  if (getEnvironment() === 'browser') {
    throw new Error('브라우저 미리보기에서는 Toss 로그인을 실행할 수 없어요.')
  }

  const framework = await import('@apps-in-toss/web-framework') as AppsInTossFrameworkWithLogin

  if (typeof framework.appLogin !== 'function') {
    throw new Error('현재 설치된 Apps in Toss SDK에서 appLogin을 찾지 못했어요.')
  }

  const loginResult = await framework.appLogin()

  return normalizeAppLoginResult(loginResult)
}

function getEnvironment(): RuntimeEnvironment {
  try {
    return getOperationalEnvironment()
  } catch {
    return 'browser'
  }
}

async function ensureAlbumPhotoPermission() {
  const permissionStatus = await fetchAlbumPhotos.getPermission() as AlbumPhotoPermissionStatus

  if (permissionStatus === 'allowed') {
    return
  }

  if (permissionStatus === 'osPermissionDenied') {
    throw new Error('토스 앱의 사진 권한이 꺼져 있어요. 기기 설정에서 토스의 사진 접근을 허용한 뒤 다시 시도해 주세요.')
  }

  const resolvedPermission = await fetchAlbumPhotos.openPermissionDialog()

  if (resolvedPermission !== 'allowed') {
    throw new FetchAlbumPhotosPermissionError()
  }
}

function normalizeAppLoginResult(loginResult: unknown): TossAppLoginResult {
  if (typeof loginResult !== 'object' || loginResult == null) {
    throw new Error('Toss 로그인 응답을 확인하지 못했어요.')
  }

  const authorizationCode = getStringField(loginResult, 'authorizationCode') ?? getStringField(loginResult, 'code')
  const referrer = getStringField(loginResult, 'referrer')

  if (authorizationCode == null || referrer == null) {
    throw new Error('Toss 로그인 응답에 필요한 authorization code 또는 referrer가 없어요.')
  }

  return {
    authorizationCode,
    referrer,
  }
}

function getStringField(source: object, key: string) {
  if (!(key in source)) {
    return null
  }

  const value = (source as Record<string, unknown>)[key]

  return typeof value === 'string' && value.trim().length > 0 ? value : null
}
