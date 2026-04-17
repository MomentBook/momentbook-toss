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

type AlbumPhotoPermissionStatus =
  | Awaited<ReturnType<typeof fetchAlbumPhotos.getPermission>>
  | 'osPermissionDenied'

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
