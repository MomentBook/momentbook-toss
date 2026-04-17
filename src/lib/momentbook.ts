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

export type JourneyDraft = {
  id: string
  title: string
  subtitle: string
  slug: string
  previewPath: string
  coverPhoto: PhotoAsset | null
  timeline: JourneyMoment[]
}

export type OrganizingStep = {
  id: 'sorting' | 'grouping' | 'narrating'
  title: string
  description: string
  durationMs: number
}

export const organizingSteps: OrganizingStep[] = [
  {
    id: 'sorting',
    title: '촬영 순서대로 정렬하고 있어요',
    description: '시간 정보를 기준으로 사진의 흐름을 먼저 맞추고 있어요.',
    durationMs: 850,
  },
  {
    id: 'grouping',
    title: '비슷한 장면끼리 묶고 있어요',
    description: '분위기와 구도를 살펴 여정의 모먼트 단위로 나누고 있어요.',
    durationMs: 900,
  },
  {
    id: 'narrating',
    title: '공개하기 좋은 이야기로 다듬고 있어요',
    description: '대표 사진과 제목을 골라 읽기 쉬운 타임라인으로 정리하고 있어요.',
    durationMs: 950,
  },
]

const momentTitles = ['여행의 시작', '머문 장면', '이어진 이동', '마무리한 순간']

const momentSummaries = [
  '여행이 시작되는 분위기가 자연스럽게 이어지도록 정리했어요.',
  '머무른 장소와 비슷한 공기를 가진 사진을 한 장면으로 묶었어요.',
  '이동하면서 달라지는 분위기가 끊기지 않도록 이어서 보여드려요.',
  '기억에 오래 남을 마무리 장면을 마지막에 배치했어요.',
]

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
        capturedAt: file.lastModified > 0 ? new Date(file.lastModified).toISOString() : null,
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

export function buildDummyJourneyDraft(photos: PhotoAsset[]): JourneyDraft {
  const orderedPhotos = [...photos].sort(comparePhotos)
  const timeline = createJourneyMoments(orderedPhotos)
  const dateRange = formatPhotoRange(orderedPhotos)
  const slug = buildJourneySlug(orderedPhotos)

  return {
    id: `journey-${slug}`,
    title:
      orderedPhotos.length === 0
        ? '비어 있는 여정'
        : dateRange === '촬영 정보가 없는 사진이에요'
          ? `${orderedPhotos.length}장의 사진으로 만든 여정`
          : `${dateRange} 여행`,
    subtitle: `${orderedPhotos.length}장의 사진을 ${timeline.length}개의 모먼트로 정리했어요.`,
    slug,
    previewPath: `/journeys/${slug}`,
    coverPhoto: timeline[0]?.photos[0] ?? orderedPhotos[0] ?? null,
    timeline,
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
    return '촬영 시간이 없는 사진을 모아두었어요.'
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

function createJourneyMoments(photos: PhotoAsset[]) {
  if (photos.length === 0) {
    return []
  }

  const groupCount = Math.min(4, Math.max(1, Math.ceil(photos.length / 4)))
  const chunkSize = Math.ceil(photos.length / groupCount)
  const timeline: JourneyMoment[] = []

  for (let index = 0; index < groupCount; index += 1) {
    const groupedPhotos = photos.slice(index * chunkSize, (index + 1) * chunkSize)

    if (groupedPhotos.length === 0) {
      continue
    }

    const bounds = inferBounds(groupedPhotos)

    timeline.push({
      id: `moment-${index + 1}`,
      title: momentTitles[index] ?? `정리된 순간 ${index + 1}`,
      summary:
        momentSummaries[index] ??
        `${groupedPhotos.length}장의 사진이 자연스럽게 이어지도록 하나의 흐름으로 묶었어요.`,
      startedAt: bounds.startedAt,
      endedAt: bounds.endedAt,
      photos: groupedPhotos,
    })
  }

  return timeline
}

function inferBounds(photos: PhotoAsset[]) {
  const timestamps = photos
    .map((photo) => photo.capturedAt)
    .filter((capturedAt): capturedAt is string => capturedAt != null)
    .map((capturedAt) => new Date(capturedAt))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime())

  return {
    startedAt: timestamps[0]?.toISOString() ?? null,
    endedAt: timestamps[timestamps.length - 1]?.toISOString() ?? null,
  }
}

function buildJourneySlug(photos: PhotoAsset[]) {
  const datedPhoto = photos.find((photo) => photo.capturedAt != null)
  const dateLabel =
    datedPhoto?.capturedAt != null
      ? new Date(datedPhoto.capturedAt).toISOString().slice(0, 10).replaceAll('-', '')
      : 'draft'

  return `momentbook-${dateLabel}-${photos.length}`
}

function comparePhotos(left: PhotoAsset, right: PhotoAsset) {
  const leftTime =
    left.capturedAt == null ? Number.MAX_SAFE_INTEGER : new Date(left.capturedAt).getTime()
  const rightTime =
    right.capturedAt == null ? Number.MAX_SAFE_INTEGER : new Date(right.capturedAt).getTime()

  if (leftTime !== rightTime) {
    return leftTime - rightTime
  }

  return left.sortOrder - right.sortOrder
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
