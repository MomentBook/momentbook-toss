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
