export type FeaturedJourneyMoment = {
  id: string
  title: string
  summary: string
}

export type FeaturedJourney = {
  id: string
  title: string
  summary: string
  location: string
  duration: string
  tone: string
  photoCount: number
  moments: FeaturedJourneyMoment[]
}

export const featuredJourneys: FeaturedJourney[] = [
  {
    id: 'jeju-sunset',
    title: '노을 따라 걷는 제주 해안',
    summary: '바다와 카페, 밤 산책만 남겨 조용한 흐름으로 정리한 예시예요.',
    location: '제주',
    duration: '2박 3일',
    tone: '바다 가까이 머문 장면만 남겨, 끝까지 온도가 고르게 이어지도록 정리했어요.',
    photoCount: 18,
    moments: [
      {
        id: 'coast-1',
        title: '공항에서 바다로 넘어가는 첫 장면',
        summary: '이동 사진은 짧게, 첫 바다를 만나는 순간은 길게 보여 주는 구성으로 시작해요.',
      },
      {
        id: 'coast-2',
        title: '빛이 가장 부드러웠던 오후',
        summary: '카페와 숙소 주변 풍경을 한 덩어리로 묶어 여정의 중심 톤을 잡았어요.',
      },
      {
        id: 'coast-3',
        title: '노을이 깊어지는 해변 산책',
        summary: '연속된 하늘색 변화가 자연스럽게 읽히도록 가장 긴 모먼트로 배치했어요.',
      },
      {
        id: 'coast-4',
        title: '밤 공기를 남기는 마무리',
        summary: '마지막은 조도가 낮은 컷 위주로 묶어 여행의 끝 분위기를 살렸어요.',
      },
    ],
  },
  {
    id: 'tokyo-night',
    title: '밤 산책으로 채운 도쿄',
    summary: '도시의 속도감은 살리되 장면 수는 줄여 가볍게 읽히는 구성이에요.',
    location: '도쿄',
    duration: '주말',
    tone: '네온, 골목 식당, 늦은 체크인을 세 개의 리듬으로 압축한 도시형 모먼트북이에요.',
    photoCount: 23,
    moments: [
      {
        id: 'city-1',
        title: '체크인 전의 짧은 거리감',
        summary: '도착 직후의 표지판과 횡단보도 컷을 짧게 연결해 도시의 템포를 먼저 보여 줘요.',
      },
      {
        id: 'city-2',
        title: '작은 식당이 여정을 잡아주는 순간',
        summary: '음식과 실내 조명 사진을 한 모먼트로 묶어 밀도 있는 중간 장면을 만들었어요.',
      },
      {
        id: 'city-3',
        title: '네온이 가장 선명한 시간',
        summary: '비슷한 구도의 야경은 덜어내고, 색감이 다른 컷만 남겨 지루함을 줄였어요.',
      },
      {
        id: 'city-4',
        title: '늦은 밤의 체크아웃 같은 끝',
        summary: '숙소와 새벽 편의점 장면으로 마무리해 하루가 자연스럽게 닫히게 구성했어요.',
      },
    ],
  },
  {
    id: 'gangwon-rest',
    title: '숲과 온천 사이에서 쉬어간 하루',
    summary: '움직임보다 머무름이 많은 장면만 모아 잔잔한 톤으로 묶은 예시예요.',
    location: '강원',
    duration: '하루',
    tone: '서두르지 않는 휴식의 공기를 유지하려고, 비슷한 속도의 장면만 남겼어요.',
    photoCount: 14,
    moments: [
      {
        id: 'forest-1',
        title: '아침 공기를 여는 숲 산책',
        summary: '비슷한 초록 톤의 컷을 묶되, 구도가 다른 사진만 남겨 잔잔하게 시작해요.',
      },
      {
        id: 'forest-2',
        title: '온천에 머무는 가장 긴 장면',
        summary: '증기와 물결이 있는 사진을 중심에 두고, 디테일 컷으로 온도를 보강했어요.',
      },
      {
        id: 'forest-3',
        title: '돌아오기 전의 조용한 정리',
        summary: '짐을 챙기기 전 풍경을 마지막에 배치해 하루가 천천히 닫히도록 했어요.',
      },
    ],
  },
]

export function getFeaturedJourneyById(id: string | null | undefined) {
  if (id == null) {
    return null
  }

  return featuredJourneys.find((journey) => journey.id === id) ?? null
}
