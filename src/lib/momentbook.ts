export type ClusterMode = 'demo' | 'server'

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

export type TimelineCluster = {
  id: string
  title: string
  summary: string
  startedAt: string | null
  endedAt: string | null
  photos: PhotoAsset[]
}

type ClusterTimelineResult = {
  mode: ClusterMode
  timeline: TimelineCluster[]
}

type ServerCluster = {
  id?: string
  title?: string
  summary?: string
  startedAt?: string
  endedAt?: string
  photoIds?: string[]
}

type ServerClusterEnvelope = {
  clusters?: ServerCluster[]
  timeline?: ServerCluster[]
}

const clusterEndpoint = import.meta.env.VITE_MOMENTBOOK_CLUSTER_ENDPOINT?.trim()

const demoTitles = ['도착한 순간', '함께 머문 장면', '이동하는 흐름', '하루의 마무리']

const demoSummaries = [
  '가까운 시간대의 사진을 먼저 한 묶음으로 정리했어요.',
  '비슷한 장면이 이어진 사진을 자연스럽게 붙였어요.',
  '움직임이 이어지는 컷을 한 흐름으로 모았어요.',
  '남은 장면을 마지막 묶음으로 정리했어요.',
]

export async function readBrowserPhotoFiles(files: File[]): Promise<PhotoAsset[]> {
  const previews = await Promise.all(
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

  return previews
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

export async function buildTimelineFromPhotos(photos: PhotoAsset[]): Promise<ClusterTimelineResult> {
  if (clusterEndpoint == null || clusterEndpoint.length === 0) {
    return {
      mode: 'demo',
      timeline: createDemoTimeline(photos),
    }
  }

  const response = await fetch(clusterEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      photos: photos.map((photo) => ({
        id: photo.id,
        dataUrl: photo.dataUrl,
        fileName: photo.fileName,
        mimeType: photo.mimeType,
        capturedAt: photo.capturedAt,
        selectedOrder: photo.sortOrder,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error('서버에서 클러스터링 결과를 받지 못했어요.')
  }

  const payload = (await response.json()) as unknown

  return {
    mode: 'server',
    timeline: parseServerTimeline(payload, photos),
  }
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
      reject(new Error('사진을 읽는 중에 문제가 생겼어요.'))
    }

    reader.readAsDataURL(file)
  })
}

function createDemoTimeline(photos: PhotoAsset[]) {
  const ordered = [...photos].sort(comparePhotos)
  const groupCount = Math.min(4, Math.max(1, Math.ceil(ordered.length / 5)))
  const chunkSize = Math.ceil(ordered.length / groupCount)
  const timeline: TimelineCluster[] = []

  for (let index = 0; index < groupCount; index += 1) {
    const clusteredPhotos = ordered.slice(index * chunkSize, (index + 1) * chunkSize)

    if (clusteredPhotos.length === 0) {
      continue
    }

    const bounds = inferBounds(clusteredPhotos)

    timeline.push({
      id: `demo-cluster-${index + 1}`,
      title: demoTitles[index] ?? `정리한 장면 ${index + 1}`,
      summary: demoSummaries[index] ?? `${clusteredPhotos.length}장을 가까운 흐름으로 정리했어요.`,
      startedAt: bounds.startedAt,
      endedAt: bounds.endedAt,
      photos: clusteredPhotos,
    })
  }

  return timeline
}

function parseServerTimeline(payload: unknown, photos: PhotoAsset[]) {
  if (!isRecord(payload)) {
    throw new Error('클러스터 응답 형식이 맞지 않아요.')
  }

  const envelope = payload as ServerClusterEnvelope
  const clusters = Array.isArray(envelope.clusters)
    ? envelope.clusters
    : Array.isArray(envelope.timeline)
      ? envelope.timeline
      : null

  if (clusters == null) {
    throw new Error('클러스터 응답 형식이 맞지 않아요.')
  }

  const photoMap = new Map(photos.map((photo) => [photo.id, photo]))

  return clusters.map((cluster, index) => parseServerCluster(cluster, index, photoMap))
}

function parseServerCluster(
  cluster: unknown,
  index: number,
  photoMap: Map<string, PhotoAsset>,
): TimelineCluster {
  if (!isRecord(cluster)) {
    throw new Error('클러스터 응답 형식이 맞지 않아요.')
  }

  if (typeof cluster.title !== 'string' || !Array.isArray(cluster.photoIds)) {
    throw new Error('클러스터 응답 형식이 맞지 않아요.')
  }

  const photos = cluster.photoIds.map((photoId) => {
    if (typeof photoId !== 'string') {
      throw new Error('클러스터 응답 형식이 맞지 않아요.')
    }

    const photo = photoMap.get(photoId)

    if (photo == null) {
      throw new Error('응답에 포함된 사진을 현재 선택 목록에서 찾지 못했어요.')
    }

    return photo
  })

  if (photos.length === 0) {
    throw new Error('응답에 비어 있는 클러스터가 포함되어 있어요.')
  }

  const bounds = inferBounds(photos)

  return {
    id: typeof cluster.id === 'string' ? cluster.id : `server-cluster-${index + 1}`,
    title: cluster.title.trim().length > 0 ? cluster.title : `묶음 ${index + 1}`,
    summary:
      typeof cluster.summary === 'string' && cluster.summary.trim().length > 0
        ? cluster.summary
        : `${photos.length}장을 가까운 흐름으로 정리했어요.`,
    startedAt: normalizeTimestamp(cluster.startedAt) ?? bounds.startedAt,
    endedAt: normalizeTimestamp(cluster.endedAt) ?? bounds.endedAt,
    photos,
  }
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

function normalizeTimestamp(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

function comparePhotos(left: PhotoAsset, right: PhotoAsset) {
  const leftTime = left.capturedAt == null ? Number.MAX_SAFE_INTEGER : new Date(left.capturedAt).getTime()
  const rightTime = right.capturedAt == null ? Number.MAX_SAFE_INTEGER : new Date(right.capturedAt).getTime()

  if (leftTime !== rightTime) {
    return leftTime - rightTime
  }

  return left.sortOrder - right.sortOrder
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null
}
