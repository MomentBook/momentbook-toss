export type FeaturedJourneyPhoto = {
  id: string
  previewUrl: string
  alt: string
}

export type FeaturedJourneyMoment = {
  id: string
  title: string
  summary: string
  dateLabel: string
  note: string
  photos: FeaturedJourneyPhoto[]
}

export type FeaturedJourney = {
  id: string
  title: string
  summary: string
  location: string
  duration: string
  tone: string
  publishedAt: string
  photoCount: number
  coverPhoto: FeaturedJourneyPhoto
  moments: FeaturedJourneyMoment[]
}

type FeaturedJourneySeed = Omit<FeaturedJourney, 'coverPhoto' | 'moments' | 'photoCount'> & {
  moments: Array<{
    id: string
    title: string
    summary: string
    dateLabel: string
    note: string
    photoCount: number
  }>
}

export const featuredJourneys: FeaturedJourney[] = [
  buildFeaturedJourney({
    id: 'jeju-sunset',
    title: '노을 따라 걷는 제주 해안',
    summary: '바다와 카페, 밤 산책을 하나의 결로 정리한 기록이에요.',
    location: '제주',
    duration: '2박 3일',
    tone: '바다 가까이 머문 장면만 남겨, 끝까지 온도가 고르게 이어지도록 정리했어요.',
    publishedAt: '2024.03.18',
    moments: [
      {
        id: 'coast-1',
        title: '공항에서 바다로 넘어가는 첫 장면',
        summary: '이동 사진은 짧게, 첫 바다를 만나는 순간은 길게 보여 주는 구성으로 시작해요.',
        dateLabel: '2024.03.12',
        note: '도착 직후의 바람과 바다 소리로 여정의 온도가 결정된 순간이에요.',
        photoCount: 5,
      },
      {
        id: 'coast-2',
        title: '빛이 가장 부드러웠던 오후',
        summary: '카페와 숙소 주변 풍경을 한 덩어리로 묶어 여정의 중심 톤을 잡았어요.',
        dateLabel: '2024.03.13',
        note: '한낮보다 조금 느린 호흡의 장면만 남겨, 머무는 감각이 이어지게 만들었어요.',
        photoCount: 4,
      },
      {
        id: 'coast-3',
        title: '노을이 깊어지는 해변 산책',
        summary: '연속된 하늘색 변화가 자연스럽게 읽히도록 가장 긴 모먼트로 배치했어요.',
        dateLabel: '2024.03.13',
        note: '빛의 변화가 가장 또렷해서, 사진 수를 줄이지 않고 리듬 자체를 보여 주는 구간이에요.',
        photoCount: 6,
      },
      {
        id: 'coast-4',
        title: '밤 공기를 남기는 마무리',
        summary: '마지막은 조도가 낮은 컷 위주로 묶어 여행의 끝 분위기를 살렸어요.',
        dateLabel: '2024.03.14',
        note: '온도가 내려간 공기와 조용한 골목 장면으로, 하루가 자연스럽게 닫히도록 정리했어요.',
        photoCount: 3,
      },
    ],
  }),
  buildFeaturedJourney({
    id: 'tokyo-night',
    title: '밤 산책으로 채운 도쿄',
    summary: '도시의 속도감은 살리되 장면 수는 줄여 가볍게 읽히는 구성이에요.',
    location: '도쿄',
    duration: '주말',
    tone: '네온, 골목 식당, 늦은 체크인을 세 개의 리듬으로 압축한 도시형 모먼트북이에요.',
    publishedAt: '2024.02.28',
    moments: [
      {
        id: 'city-1',
        title: '체크인 전의 짧은 거리감',
        summary: '도착 직후의 표지판과 횡단보도 컷을 짧게 연결해 도시의 템포를 먼저 보여 줘요.',
        dateLabel: '2024.02.21',
        note: '첫 장면은 설명보다 리듬이 중요해서, 짧고 빠른 컷만 남겨 시작점을 만들었어요.',
        photoCount: 5,
      },
      {
        id: 'city-2',
        title: '작은 식당이 여정을 잡아주는 순간',
        summary: '음식과 실내 조명 사진을 한 모먼트로 묶어 밀도 있는 중간 장면을 만들었어요.',
        dateLabel: '2024.02.21',
        note: '실내의 따뜻한 색감을 중심축으로 두고, 바깥의 차가운 빛은 보조적으로 배치했어요.',
        photoCount: 6,
      },
      {
        id: 'city-3',
        title: '네온이 가장 선명한 시간',
        summary: '비슷한 구도의 야경은 덜어내고, 색감이 다른 컷만 남겨 지루함을 줄였어요.',
        dateLabel: '2024.02.22',
        note: '비슷해 보이는 야경도 색의 결이 다른 사진만 남기면 훨씬 읽기 쉬워져요.',
        photoCount: 7,
      },
      {
        id: 'city-4',
        title: '늦은 밤의 체크아웃 같은 끝',
        summary: '숙소와 새벽 편의점 장면으로 마무리해 하루가 자연스럽게 닫히게 구성했어요.',
        dateLabel: '2024.02.22',
        note: '너무 화려한 컷 대신 조용한 실내 장면으로 끝내 도시의 여운을 남겼어요.',
        photoCount: 5,
      },
    ],
  }),
  buildFeaturedJourney({
    id: 'gangwon-rest',
    title: '숲과 온천 사이에서 쉬어간 하루',
    summary: '움직임보다 머무름이 많은 장면만 모아 잔잔한 리듬으로 정리한 기록이에요.',
    location: '강원',
    duration: '하루',
    tone: '서두르지 않는 휴식의 공기를 유지하려고, 비슷한 속도의 장면만 남겼어요.',
    publishedAt: '2024.01.16',
    moments: [
      {
        id: 'forest-1',
        title: '아침 공기를 여는 숲 산책',
        summary: '비슷한 초록 톤의 컷을 묶되, 구도가 다른 사진만 남겨 잔잔하게 시작해요.',
        dateLabel: '2024.01.11',
        note: '색은 비슷하지만 시선의 높이가 다른 사진을 섞어야 흐름이 지루해지지 않아요.',
        photoCount: 4,
      },
      {
        id: 'forest-2',
        title: '온천에 머무는 가장 긴 장면',
        summary: '증기와 물결이 있는 사진을 중심에 두고, 디테일 컷으로 온도를 보강했어요.',
        dateLabel: '2024.01.11',
        note: '가장 오래 머문 공간이라 디테일 컷을 충분히 남겨 여정의 중심으로 세웠어요.',
        photoCount: 6,
      },
      {
        id: 'forest-3',
        title: '돌아오기 전의 조용한 정리',
        summary: '짐을 챙기기 전 풍경을 마지막에 배치해 하루가 천천히 닫히도록 했어요.',
        dateLabel: '2024.01.11',
        note: '마지막 장면은 설명보다 공기의 잔상이 남도록, 차분한 컷 위주로 마무리했어요.',
        photoCount: 4,
      },
    ],
  }),
  buildFeaturedJourney({
    id: 'paris-morning',
    title: '파리의 아침과 전시 사이를 걷던 주말',
    summary: '카페와 미술관, 강변 산책을 가볍게 묶은 기록이에요.',
    location: '파리',
    duration: '3박 4일',
    tone: '실내와 실외의 결이 급하게 끊기지 않도록, 천천히 이어지는 장면만 남겼어요.',
    publishedAt: '2023.10.22',
    moments: [
      {
        id: 'paris-1',
        title: '아침 공기가 남아 있던 골목',
        summary: '숙소 근처 거리와 빵집 장면을 먼저 배치해 도착 직후의 결을 자연스럽게 열었어요.',
        dateLabel: '2023.10.14',
        note: '하루를 여는 장면은 너무 복잡하지 않게, 공기의 결이 느껴지는 컷만 남겼어요.',
        photoCount: 6,
      },
      {
        id: 'paris-2',
        title: '전시를 중심으로 모인 낮의 장면',
        summary: '미술관 내부와 작품 디테일 컷을 한 흐름으로 묶어 여정의 중심 장면으로 잡았어요.',
        dateLabel: '2023.10.15',
        note: '전시 사진은 설명보다 호흡이 중요해서, 작품과 공간 컷의 균형을 맞췄어요.',
        photoCount: 7,
      },
      {
        id: 'paris-3',
        title: '강변 산책으로 느슨해지는 오후',
        summary: '센강 주변 풍경과 걸음이 느려지는 순간만 남겨 화면의 밀도를 한 번 풀어줬어요.',
        dateLabel: '2023.10.16',
        note: '중간에 한 번 속도를 풀어주는 장면이 있어야 전체 여정이 더 길게 느껴져요.',
        photoCount: 7,
      },
      {
        id: 'paris-4',
        title: '밤 조명 아래 닫히는 끝',
        summary: '조도가 낮은 거리와 테이블 장면을 마지막에 두어 여정이 조용히 닫히도록 했어요.',
        dateLabel: '2023.10.17',
        note: '마지막은 밝기보다 분위기가 중요해서, 조용한 실내 컷을 중심으로 정리했어요.',
        photoCount: 7,
      },
    ],
  }),
  buildFeaturedJourney({
    id: 'iceland-road',
    title: '빙하와 도로만 따라간 아이슬란드',
    summary: '이동과 풍경의 대비를 살려 시원하게 읽히는 흐름으로 정리한 기록이에요.',
    location: '아이슬란드',
    duration: '5박 6일',
    tone: '넓은 풍경의 호흡을 살리기 위해 비슷한 톤의 장면은 줄이고 변화가 큰 구간만 남겼어요.',
    publishedAt: '2023.08.09',
    moments: [
      {
        id: 'iceland-1',
        title: '차창 밖 풍경으로 시작하는 이동',
        summary: '길 위의 첫 장면들을 짧게 연결해 앞으로 펼쳐질 스케일을 먼저 보여 주도록 했어요.',
        dateLabel: '2023.08.01',
        note: '이동 중 컷은 많지만, 시선이 확 바뀌는 장면만 남겨 시작을 단단하게 만들었어요.',
        photoCount: 7,
      },
      {
        id: 'iceland-2',
        title: '빙하 앞에서 멈춘 가장 긴 순간',
        summary: '시선이 가장 오래 머무는 풍경 컷을 중심에 두고, 주변 디테일 컷은 짧게 받쳐줬어요.',
        dateLabel: '2023.08.02',
        note: '여정 전체에서 가장 긴 호흡을 가진 장면이라 넓은 컷과 디테일 컷을 함께 살렸어요.',
        photoCount: 8,
      },
      {
        id: 'iceland-3',
        title: '검은 해변과 바람의 방향',
        summary: '색감이 크게 달라지는 구간만 남겨 여정의 리듬이 중간에 다시 살아나도록 정리했어요.',
        dateLabel: '2023.08.04',
        note: '톤이 달라지는 구간을 분명히 넣어야 긴 여행도 장면 단위로 기억되기 쉬워져요.',
        photoCount: 8,
      },
      {
        id: 'iceland-4',
        title: '긴 해가 남아 있던 저녁 도로',
        summary: '숙소로 돌아가는 길의 빛을 마지막에 두어 여정의 마감이 넓게 느껴지도록 했어요.',
        dateLabel: '2023.08.05',
        note: '마지막 장면은 이동 중의 고요함을 남기기 위해 속도감보다 여백을 선택했어요.',
        photoCount: 8,
      },
    ],
  }),
]

export function getFeaturedJourneyById(id: string | null | undefined) {
  if (id == null) {
    return null
  }

  return featuredJourneys.find((journey) => journey.id === id) ?? null
}

export function getFeaturedJourneyMomentById(
  journey: FeaturedJourney | null | undefined,
  momentId: string | null | undefined,
) {
  if (journey == null || momentId == null) {
    return null
  }

  return journey.moments.find((moment) => moment.id === momentId) ?? null
}

function buildFeaturedJourney(seed: FeaturedJourneySeed): FeaturedJourney {
  const moments = seed.moments.map((moment) => ({
    id: moment.id,
    title: moment.title,
    summary: moment.summary,
    dateLabel: moment.dateLabel,
    note: moment.note,
    photos: buildMomentPhotos(seed.id, moment.id, moment.title, moment.photoCount),
  }))

  return {
    ...seed,
    coverPhoto: buildJourneyPhoto(`${seed.id}-cover`, `${seed.title} 대표 사진`, 1280, 960),
    photoCount: moments.reduce((total, moment) => total + moment.photos.length, 0),
    moments,
  }
}

function buildMomentPhotos(
  journeyId: string,
  momentId: string,
  title: string,
  photoCount: number,
) {
  return Array.from({ length: photoCount }, (_, index) =>
    buildJourneyPhoto(
      `${journeyId}-${momentId}-${index + 1}`,
      `${title} 사진 ${index + 1}`,
      960,
      960,
    ),
  )
}

function buildJourneyPhoto(seed: string, alt: string, width: number, height: number): FeaturedJourneyPhoto {
  return {
    id: seed,
    previewUrl: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    alt,
  }
}
