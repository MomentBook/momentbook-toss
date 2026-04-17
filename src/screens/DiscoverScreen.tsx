type DiscoverScreenProps = {
  hasSelectedPhotos: boolean
}

type FeaturedJourney = {
  id: string
  location: string
  title: string
  creator: string
  summary: string
  photoCount: number
  momentCount: number
  theme: 'coast' | 'city' | 'forest'
}

const featuredJourneys: FeaturedJourney[] = [
  {
    id: 'jeju-sunset',
    location: '제주',
    title: '노을 따라 걷는 제주 2박 3일',
    creator: '민지',
    summary: '해안도로와 작은 카페를 따라 천천히 이어진 순간만 모아둔 여정이에요.',
    photoCount: 18,
    momentCount: 4,
    theme: 'coast',
  },
  {
    id: 'tokyo-night',
    location: '도쿄',
    title: '밤 산책으로 채운 도쿄 주말',
    creator: '현우',
    summary: '골목 식당, 네온사인, 늦은 체크인까지 흐름이 살아 있는 도시 여행이에요.',
    photoCount: 23,
    momentCount: 4,
    theme: 'city',
  },
  {
    id: 'gangwon-rest',
    location: '강원',
    title: '숲과 온천 사이에서 쉬어간 하루',
    creator: '서윤',
    summary: '복잡한 동선보다 쉬는 장면 위주로 묶어 조용하게 읽히는 기록이에요.',
    photoCount: 14,
    momentCount: 3,
    theme: 'forest',
  },
]

const discoveryChips = ['제주 바다', '도시 야경', '온천 휴식']

export function DiscoverScreen({ hasSelectedPhotos }: DiscoverScreenProps) {
  return (
    <>
      <section className="hero-card discover-hero">
        <div className="discover-hero__intro">
          <span className="section-badge section-badge--primary">먼저 둘러보기</span>
          <h2 className="hero-card__title">다른 사람의 여정을 보고, 내 기록의 첫 흐름을 잡아보세요.</h2>
          <p className="hero-card__description">
            여행이 어떻게 한 페이지의 이야기로 정리되는지 먼저 살펴본 뒤, 내 사진으로 바로
            시작할 수 있어요.
          </p>
        </div>

        <div className="discover-stat-grid" aria-label="탐색 통계">
          <article className="metric-card">
            <span>이번 주 공개된 여정</span>
            <strong>248개</strong>
          </article>
          <article className="metric-card">
            <span>함께 둘러보는 여행자</span>
            <strong>12,300명</strong>
          </article>
        </div>

        <div className="discover-highlight">
          <p className="discover-highlight__eyebrow">지금 많이 저장하는 흐름</p>
          <strong>짧은 여행도 3-4개의 모먼트로 읽히게 정리하는 방식</strong>
          <p>
            사진을 많이 고르지 않아도, 흐름만 살아 있으면 충분히 이야기처럼 보이도록 만드는
            패턴이 인기예요.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">추천 여정</p>
            <h3>지금 많이 둘러보는 여행 흐름</h3>
          </div>
          <strong className="stat-pill">인기 공개본</strong>
        </div>

        <div className="discover-rail" aria-label="다른 사람의 여행 여정 목록">
          {featuredJourneys.map((journey) => (
            <article className="discover-card" key={journey.id}>
              <div className={`discover-card__media discover-card__media--${journey.theme}`}>
                <span className="discover-card__location">{journey.location}</span>
                <div className="discover-card__glow" />
              </div>

              <div className="discover-card__body">
                <div className="discover-card__head">
                  <div>
                    <p className="eyebrow">{journey.creator} 님의 여정</p>
                    <h3>{journey.title}</h3>
                  </div>
                  <span className="stat-pill">{journey.momentCount}개 모먼트</span>
                </div>

                <p className="timeline-summary">{journey.summary}</p>

                <div className="discover-card__footer">
                  <span>{journey.photoCount}장 사진</span>
                  <span>공개 페이지 예시</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">이런 테마로 시작해 보세요</p>
            <h3>자주 보는 장면부터 내 여정의 톤을 잡아요</h3>
          </div>
        </div>

        <div className="feature-chips">
          {discoveryChips.map((chip) => (
            <span className="feature-chip discover-chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>

        <p className="helper-copy">
          {hasSelectedPhotos
            ? '이미 고른 사진이 있다면 바로 다음 단계로 이어서 정리할 수 있어요.'
            : '둘러보다가 마음에 드는 흐름이 보이면, 바로 내 사진으로 같은 방식의 초안을 시작할 수 있어요.'}
        </p>
      </section>
    </>
  )
}
