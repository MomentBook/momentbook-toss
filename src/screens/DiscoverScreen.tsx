import { useState } from 'react'

type DiscoverScreenProps = {
  hasSelectedPhotos: boolean
}

type FeaturedMoment = {
  id: string
  title: string
  summary: string
  cue: string
  photoCount: number
}

type FeaturedJourney = {
  id: string
  creator: string
  location: string
  duration: string
  title: string
  summary: string
  tone: string
  photoCount: number
  momentCount: number
  theme: 'coast' | 'city' | 'forest' | 'sunrise'
  moments: FeaturedMoment[]
}

const featuredJourneys: FeaturedJourney[] = [
  {
    id: 'jeju-sunset',
    creator: '민지',
    location: '제주',
    duration: '2박 3일',
    title: '노을 따라 걷는 제주 해안',
    summary: '해 질 무렵의 결이 끊기지 않도록, 바다와 카페와 밤 산책만 조용히 남긴 여정이에요.',
    tone: '바다 가까이 머문 장면만 남겨, 끝까지 온도가 고르게 이어지도록 정리했어요.',
    photoCount: 18,
    momentCount: 4,
    theme: 'coast',
    moments: [
      {
        id: 'coast-1',
        title: '공항에서 바다로 넘어가는 첫 장면',
        summary: '이동 사진은 짧게, 첫 바다를 만나는 순간은 길게 보여 주는 구성으로 시작해요.',
        cue: '도착 후 해안도로',
        photoCount: 4,
      },
      {
        id: 'coast-2',
        title: '빛이 가장 부드러웠던 오후',
        summary: '카페와 숙소 주변 풍경을 한 덩어리로 묶어 여정의 중심 톤을 잡았어요.',
        cue: '카페와 숙소 주변',
        photoCount: 5,
      },
      {
        id: 'coast-3',
        title: '노을이 깊어지는 해변 산책',
        summary: '연속된 하늘색 변화가 자연스럽게 읽히도록 가장 긴 모먼트로 배치했어요.',
        cue: '석양 직전 한 시간',
        photoCount: 6,
      },
      {
        id: 'coast-4',
        title: '밤 공기를 남기는 마무리',
        summary: '마지막은 조도가 낮은 컷 위주로 묶어 여행의 끝 분위기를 살렸어요.',
        cue: '저녁 산책과 식사',
        photoCount: 3,
      },
    ],
  },
  {
    id: 'tokyo-night',
    creator: '현우',
    location: '도쿄',
    duration: '주말',
    title: '밤 산책으로 채운 도쿄',
    summary: '도시의 속도감은 남기되, 장면은 과하게 많지 않게 잘라서 리듬이 분명한 공개본이에요.',
    tone: '네온, 골목 식당, 늦은 체크인을 세 개의 리듬으로 압축한 도시형 모먼트북이에요.',
    photoCount: 23,
    momentCount: 4,
    theme: 'city',
    moments: [
      {
        id: 'city-1',
        title: '체크인 전의 짧은 거리감',
        summary: '도착 직후의 표지판과 횡단보도 컷을 짧게 연결해 도시의 템포를 먼저 보여 줘요.',
        cue: '역 주변 첫 산책',
        photoCount: 5,
      },
      {
        id: 'city-2',
        title: '작은 식당이 여정을 잡아주는 순간',
        summary: '음식과 실내 조명 사진을 한 모먼트로 묶어 밀도 있는 중간 장면을 만들었어요.',
        cue: '골목 식당과 바',
        photoCount: 6,
      },
      {
        id: 'city-3',
        title: '네온이 가장 선명한 시간',
        summary: '비슷한 구도의 야경은 덜어내고, 색감이 다른 컷만 남겨 지루함을 줄였어요.',
        cue: '메인 스트리트 야경',
        photoCount: 7,
      },
      {
        id: 'city-4',
        title: '늦은 밤의 체크아웃 같은 끝',
        summary: '숙소와 새벽 편의점 장면으로 마무리해 하루가 자연스럽게 닫히게 구성했어요.',
        cue: '숙소와 새벽 장면',
        photoCount: 5,
      },
    ],
  },
  {
    id: 'gangwon-rest',
    creator: '서윤',
    location: '강원',
    duration: '하루',
    title: '숲과 온천 사이에서 쉬어간 하루',
    summary: '움직임보다 머무름이 많은 사진만 골라, 조용하고 느린 톤으로 읽히는 여정이에요.',
    tone: '서두르지 않는 휴식의 공기를 유지하려고, 비슷한 속도의 장면만 남겼어요.',
    photoCount: 14,
    momentCount: 3,
    theme: 'forest',
    moments: [
      {
        id: 'forest-1',
        title: '아침 공기를 여는 숲 산책',
        summary: '비슷한 초록 톤의 컷을 묶되, 구도가 다른 사진만 남겨 잔잔하게 시작해요.',
        cue: '산책로와 로비',
        photoCount: 4,
      },
      {
        id: 'forest-2',
        title: '온천에 머무는 가장 긴 장면',
        summary: '증기와 물결이 있는 사진을 중심에 두고, 디테일 컷으로 온도를 보강했어요.',
        cue: '온천과 실내 휴식',
        photoCount: 6,
      },
      {
        id: 'forest-3',
        title: '돌아오기 전의 조용한 정리',
        summary: '짐을 챙기기 전 풍경을 마지막에 배치해 하루가 천천히 닫히도록 했어요.',
        cue: '체크아웃 전 창밖',
        photoCount: 4,
      },
    ],
  },
  {
    id: 'seoul-sunrise',
    creator: '지안',
    location: '서울',
    duration: '반나절',
    title: '새벽부터 점심까지 이어진 서울 산책',
    summary: '짧은 외출도 한 권처럼 보이도록, 시간대 변화가 큰 장면만 남겨 압축한 기록이에요.',
    tone: '새벽의 차가운 톤에서 낮의 밝은 톤으로 넘어가는 변화를 또렷하게 살렸어요.',
    photoCount: 16,
    momentCount: 4,
    theme: 'sunrise',
    moments: [
      {
        id: 'sunrise-1',
        title: '해 뜨기 직전의 도심',
        summary: '인적이 드문 컷으로 시작해 여정의 정서를 가장 먼저 고정해요.',
        cue: '새벽 강변 산책',
        photoCount: 3,
      },
      {
        id: 'sunrise-2',
        title: '빛이 번지는 한강 주변',
        summary: '빛이 바뀌는 속도가 빠른 구간이라, 색 차이가 큰 사진만 선별해 이어 붙였어요.',
        cue: '일출 직후 40분',
        photoCount: 4,
      },
      {
        id: 'sunrise-3',
        title: '아침 식사가 중간 리듬을 만든다',
        summary: '실내 컷을 짧게 끼워 넣어, 실외 장면이 단조로워지지 않도록 했어요.',
        cue: '브런치와 골목',
        photoCount: 5,
      },
      {
        id: 'sunrise-4',
        title: '햇빛이 완전히 올라온 마무리',
        summary: '낮 장면을 너무 길게 끌지 않고 마지막 한 모먼트로 정리해 마침표를 만들었어요.',
        cue: '점심 전 산책',
        photoCount: 4,
      },
    ],
  },
]

export function DiscoverScreen({ hasSelectedPhotos }: DiscoverScreenProps) {
  const [selectedJourneyId, setSelectedJourneyId] = useState(featuredJourneys[0]?.id ?? '')

  const selectedJourney =
    featuredJourneys.find((journey) => journey.id === selectedJourneyId) ?? featuredJourneys[0]

  if (selectedJourney == null) {
    return null
  }

  return (
    <>
      <section className="hero-card discover-hero">
        <div className="discover-hero__intro">
          <span className="section-badge section-badge--primary">둘러보기</span>
          <h2 className="hero-card__title">타인의 여정을 넘겨보며, 내 기록이 어떤 톤으로 보일지 먼저 확인해 보세요.</h2>
          <p className="hero-card__description">
            정보는 줄이고 흐름만 남긴 샘플 공개본이에요. 마음에 드는 리듬을 고른 뒤 아래에서
            바로 여정 전체를 볼 수 있어요.
          </p>
        </div>

        <div className="discover-rail" aria-label="샘플 여정 슬라이드">
          {featuredJourneys.map((journey) => {
            const isSelected = journey.id === selectedJourney.id

            return (
              <button
                key={journey.id}
                aria-pressed={isSelected}
                className={`discover-slide discover-slide--${journey.theme}${isSelected ? ' discover-slide--selected' : ''}`}
                type="button"
                onClick={() => setSelectedJourneyId(journey.id)}
              >
                <div className="discover-slide__meta">
                  <span className="discover-slide__chip">{journey.location}</span>
                  <span className="discover-slide__chip discover-slide__chip--ghost">{journey.duration}</span>
                </div>

                <div className="discover-slide__body">
                  <div>
                    <p className="eyebrow discover-slide__eyebrow">{journey.creator} 님의 여정</p>
                    <h3>{journey.title}</h3>
                    <p>{journey.summary}</p>
                  </div>

                  <div className="discover-slide__footer">
                    <div className="discover-slide__moments" aria-hidden="true">
                      {journey.moments.slice(0, 3).map((moment) => (
                        <span key={moment.id}>{moment.title}</span>
                      ))}
                    </div>
                    <strong>{isSelected ? '아래에서 보기' : '탭해서 보기'}</strong>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="discover-hero__footer">
          <div className="discover-pagination" aria-hidden="true">
            {featuredJourneys.map((journey) => (
              <span
                key={journey.id}
                className={`discover-pagination__dot${journey.id === selectedJourney.id ? ' discover-pagination__dot--active' : ''}`}
              />
            ))}
          </div>

          <p className="helper-copy">
            {hasSelectedPhotos
              ? '이미 고른 사진이 있다면 둘러본 뒤 아래 CTA로 바로 이어서 정리할 수 있어요.'
              : '마음에 드는 흐름을 본 뒤, 아래 CTA로 바로 내 여정을 시작해 보세요.'}
          </p>
        </div>
      </section>

      <section className={`panel-card discover-story discover-story--${selectedJourney.theme}`}>
        <div className="discover-story__hero">
          <div className="discover-story__poster">
            <div className="discover-story__poster-copy">
              <span className="section-badge section-badge--glass">샘플 공개본</span>
              <h3>{selectedJourney.title}</h3>
              <p>{selectedJourney.tone}</p>
            </div>

            <div className="discover-story__hero-meta">
              <span className="timeline-hero__chip">{selectedJourney.creator} 님</span>
              <span className="timeline-hero__chip">{selectedJourney.photoCount}장 사진</span>
              <span className="timeline-hero__chip">{selectedJourney.momentCount}개 모먼트</span>
            </div>
          </div>

          <div className="discover-story__summary">
            <p className="section-heading__eyebrow">선택한 여정</p>
            <h3>{selectedJourney.location}에서 읽힌 흐름</h3>
            <p className="timeline-summary">{selectedJourney.summary}</p>
          </div>
        </div>

        <div className="discover-story__timeline">
          {selectedJourney.moments.map((moment, index) => (
            <article className="discover-moment-card" key={moment.id}>
              <div className="discover-moment-card__head">
                <div>
                  <p className="eyebrow">Moment {String(index + 1).padStart(2, '0')}</p>
                  <h3>{moment.title}</h3>
                </div>

                <span className="stat-pill">{moment.photoCount}장</span>
              </div>

              <p className="timeline-summary">{moment.summary}</p>

              <div className="discover-moment-card__footer">
                <span>{moment.cue}</span>

                <div className="discover-moment-card__tiles" aria-hidden="true">
                  <span className="discover-moment-card__tile" />
                  <span className="discover-moment-card__tile" />
                  <span className="discover-moment-card__tile" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
