import { featuredJourneys } from '../lib/featuredJourneys'
import { formatCount } from '../lib/momentbook'

type DiscoverScreenProps = {
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ onOpenJourney }: DiscoverScreenProps) {
  return (
    <div className="discover-screen">
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">여정 둘러보기</span>
          <h2 className="hero-card__title">다른 사람의 모먼트북으로 정리 흐름을 먼저 살펴보세요</h2>
          <p className="hero-card__description">
            사진이 어떤 장면 단위로 묶이는지 예시를 보고, 바로 내 여정을 시작할 수 있어요.
          </p>
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">둘러보기 포인트</p>
            <h3>대표 장면과 흐름을 빠르게 확인할 수 있게 정리했어요</h3>
          </div>
        </div>

        <div className="feature-chips">
          <span className="feature-chip">대표 사진 미리보기</span>
          <span className="feature-chip">모먼트 개수 확인</span>
          <span className="feature-chip">발행된 흐름 탐색</span>
        </div>
      </section>

      <section aria-labelledby="discover-list-title" className="discover-screen__section">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">여정 목록</p>
            <h3 id="discover-list-title">사진이 어떻게 읽히는지 예시로 둘러보세요</h3>
          </div>
        </div>

        <div className="discover-journey-list">
          {featuredJourneys.map((journey, index) => (
            <article key={journey.id}>
              <button
                aria-label={`${journey.title} 여정 자세히 보기`}
                className="discover-journey-card"
                type="button"
                onClick={() => onOpenJourney(journey.id)}
              >
                <div className="discover-journey-card__media">
                  <img alt={journey.coverPhoto.alt} loading="lazy" src={journey.coverPhoto.previewUrl} />
                </div>

                <div className="discover-journey-card__content">
                  <div className="discover-journey-card__header">
                    <div>
                      <p className="eyebrow">Journey {String(index + 1).padStart(2, '0')}</p>
                      <h3>{journey.title}</h3>
                    </div>

                    <span className="stat-pill">{formatCount(journey.photoCount, '장')}</span>
                  </div>

                  <p className="discover-journey-card__summary">{journey.summary}</p>

                  <div className="feature-chips discover-journey-card__chips">
                    <span className="feature-chip">{journey.location}</span>
                    <span className="feature-chip">{journey.duration}</span>
                    <span className="feature-chip">
                      {formatCount(journey.moments.length, '개 모먼트')}
                    </span>
                  </div>

                  <p className="discover-journey-card__tone">{journey.tone}</p>

                  <div className="discover-journey-card__footer">
                    <span className="discover-journey-card__published">작성일 {journey.publishedAt}</span>
                    <span className="discover-journey-card__action">자세히 보기</span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
