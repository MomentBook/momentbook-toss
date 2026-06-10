export type TossAlbumPhoto = {
  id: string
  dataUrl: string
}

export type PhotoAsset = {
  id: string
  previewUrl: string
  dataUrl: string
  fileName: string
  mimeType: string
  capturedAt: string | null
  byteSize: number | null
  source: 'browser' | 'toss'
  sortOrder: number
}

export type JourneyMoment = {
  id: string
  title: string
  summary: string
  startedAt: string | null
  endedAt: string | null
  photos: PhotoAsset[]
}

export type JourneyDetails = {
  title: string
  description: string
  coverPhotoId: string | null
}

export type JourneyDraft = {
  id: string
  title: string
  subtitle: string
  slug: string
  previewPath: string
  previewUrl: string
  visibility: 'private'
  coverPhoto: PhotoAsset | null
  timeline: JourneyMoment[]
  unassignedPhotos: PhotoAsset[]
}

type BuildJourneyDraftOptions = {
  webBaseUrl?: string
}

const defaultMomentTitles = ['모먼트 1', '모먼트 2', '모먼트 3']

export async function readBrowserPhotoFiles(files: File[]): Promise<PhotoAsset[]> {
  return await Promise.all(
    files.map(async (file, index) => {
      const dataUrl = await readDataUrl(file)

      return {
        id: `${file.name}-${file.lastModified}-${index}`,
        previewUrl: dataUrl,
        dataUrl,
        fileName: file.name,
        mimeType: file.type || 'image/jpeg',
        capturedAt: null,
        byteSize: file.size,
        source: 'browser' as const,
        sortOrder: index,
      }
    }),
  )
}

export function normalizeTossAlbumPhotos(albumPhotos: TossAlbumPhoto[]): PhotoAsset[] {
  return albumPhotos.map((photo, index) => ({
    id: photo.id,
    previewUrl: photo.dataUrl,
    dataUrl: photo.dataUrl,
    fileName: `momentbook-${index + 1}.jpg`,
    mimeType: 'image/jpeg',
    capturedAt: null,
    byteSize: null,
    source: 'toss',
    sortOrder: index,
  }))
}

export function createEmptyJourneyMoments(): JourneyMoment[] {
  return defaultMomentTitles.map((_, index) => createJourneyMoment(index))
}

export function createJourneyMoment(index: number): JourneyMoment {
  const momentNumber = index + 1

  return {
    id: `moment-${momentNumber}`,
    title: defaultMomentTitles[index] ?? `모먼트 ${momentNumber}`,
    summary: '',
    startedAt: null,
    endedAt: null,
    photos: [],
  }
}

export function createDefaultJourneyDetails(photos: PhotoAsset[]): JourneyDetails {
  return {
    title: '',
    description: '',
    coverPhotoId: photos[0]?.id ?? null,
  }
}

export function assignPhotosToJourneyMoment(
  moments: JourneyMoment[],
  photos: PhotoAsset[],
  photoIds: string[],
  momentId: string,
) {
  if (photoIds.length === 0) {
    return moments
  }

  const photoIdSet = new Set(photoIds)
  const selectedPhotos = photos.filter((photo) => photoIdSet.has(photo.id))

  return moments.map((moment) => {
    const remainingPhotos = moment.photos.filter((photo) => !photoIdSet.has(photo.id))

    if (moment.id !== momentId) {
      return {
        ...moment,
        photos: remainingPhotos,
      }
    }

    return {
      ...moment,
      photos: [...remainingPhotos, ...selectedPhotos],
    }
  })
}

export function removePhotoFromJourneyMoment(
  moments: JourneyMoment[],
  momentId: string,
  photoId: string,
) {
  return moments.map((moment) =>
    moment.id === momentId
      ? {
          ...moment,
          photos: moment.photos.filter((photo) => photo.id !== photoId),
        }
      : moment,
  )
}

export function updateJourneyMomentDetails(
  moments: JourneyMoment[],
  momentId: string,
  details: Partial<Pick<JourneyMoment, 'title' | 'summary'>>,
) {
  return moments.map((moment) =>
    moment.id === momentId
      ? {
          ...moment,
          ...(details.title != null ? { title: details.title } : {}),
          ...(details.summary != null ? { summary: details.summary } : {}),
        }
      : moment,
  )
}

export function getUnassignedPhotos(photos: PhotoAsset[], moments: JourneyMoment[]) {
  const assignedPhotoIds = new Set(
    moments.flatMap((moment) => moment.photos.map((photo) => photo.id)),
  )

  return photos.filter((photo) => !assignedPhotoIds.has(photo.id))
}

export function buildJourneyDraft(
  photos: PhotoAsset[],
  moments: JourneyMoment[],
  details: JourneyDetails,
  options: BuildJourneyDraftOptions = {},
): JourneyDraft {
  const normalizedTitle = details.title.trim()
  const normalizedDescription = details.description.trim()
  const timeline = moments
    .filter((moment) => moment.photos.length > 0)
    .map((moment, index, filteredMoments) => ({
      ...moment,
      id: `moment-${index + 1}`,
      title: moment.title.trim() || defaultMomentTitles[index] || `모먼트 ${index + 1}`,
      summary:
        moment.summary.trim() ||
        buildMomentSummary(moment.photos.length, index, filteredMoments.length),
      startedAt: null,
      endedAt: null,
    }))
  const unassignedPhotos = getUnassignedPhotos(photos, moments)
  const slug = buildJourneySlug(photos)
  const previewPath = `/private/journeys/${slug}`
  const coverPhoto =
    photos.find((photo) => photo.id === details.coverPhotoId) ?? timeline[0]?.photos[0] ?? photos[0] ?? null

  return {
    id: `journey-${slug}`,
    title: normalizedTitle || (photos.length === 0 ? '비어 있는 여정' : '비공개 여정'),
    subtitle:
      normalizedDescription ||
      (timeline.length === 0
        ? '사진을 모먼트에 담아 여정의 흐름을 만들어 보세요.'
        : `${photos.length}장의 사진 중 ${timeline.length}개의 모먼트를 먼저 정리했어요.`),
    slug,
    previewPath,
    previewUrl: buildPreviewUrl(previewPath, options.webBaseUrl),
    visibility: 'private',
    coverPhoto,
    timeline,
    unassignedPhotos,
  }
}

export function formatCount(count: number, unit: string) {
  return `${count}${unit}`
}

export function formatPhotoRange(photos: PhotoAsset[]) {
  const dates = photos
    .map((photo) => photo.capturedAt)
    .filter((capturedAt): capturedAt is string => capturedAt != null)
    .map((capturedAt) => new Date(capturedAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime())

  if (dates.length === 0) {
    return '촬영 정보가 없는 사진이에요'
  }

  if (dates.length === 1) {
    return formatShortDate(dates[0])
  }

  return `${formatShortDate(dates[0])} - ${formatShortDate(dates[dates.length - 1])}`
}

export function formatMomentWindow(moment: JourneyMoment) {
  if (moment.startedAt == null || moment.endedAt == null) {
    return `${moment.photos.length}장의 사진을 한 모먼트로 묶었어요.`
  }

  const start = new Date(moment.startedAt)
  const end = new Date(moment.endedAt)

  if (formatShortDateWithYear(start) === formatShortDateWithYear(end)) {
    if (formatShortTime(start) === formatShortTime(end)) {
      return `${formatShortDate(start)} ${formatShortTime(start)}`
    }

    return `${formatShortDate(start)} ${formatShortTime(start)} - ${formatShortTime(end)}`
  }

  return `${formatShortDateWithYear(start)} - ${formatShortDateWithYear(end)}`
}

export function formatSourceLabel(source: PhotoAsset['source']) {
  return source === 'browser' ? '기기에서 선택한 사진' : '토스 사진첩'
}

async function readDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('사진 미리보기를 준비하지 못했어요.'))
    }

    reader.onerror = () => {
      reject(new Error('사진을 읽는 중 문제가 발생했어요.'))
    }

    reader.readAsDataURL(file)
  })
}

function buildJourneySlug(photos: PhotoAsset[]) {
  const datedPhoto = photos.find((photo) => photo.capturedAt != null)
  const dateLabel =
    datedPhoto?.capturedAt != null
      ? new Date(datedPhoto.capturedAt).toISOString().slice(0, 10).replaceAll('-', '')
      : 'draft'

  return `momentbook-${dateLabel}-${photos.length}`
}

function buildPreviewUrl(previewPath: string, webBaseUrl: string | undefined) {
  const normalizedBaseUrl = webBaseUrl?.trim().replace(/\/+$/, '')

  if (!normalizedBaseUrl) {
    return previewPath
  }

  return `${normalizedBaseUrl}${previewPath}`
}

function buildMomentSummary(photoCount: number, index: number, totalMomentCount: number) {
  if (totalMomentCount === 1) {
    return `${photoCount}장의 사진을 한 모먼트로 정리했어요.`
  }

  if (index === 0) {
    return `${photoCount}장의 사진으로 여정의 시작을 만들었어요.`
  }

  if (index === totalMomentCount - 1) {
    return `${photoCount}장의 사진으로 마무리를 구성했어요.`
  }

  return `${photoCount}장의 사진이 이어지도록 한 모먼트로 담았어요.`
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatShortDateWithYear(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function formatShortTime(date: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
