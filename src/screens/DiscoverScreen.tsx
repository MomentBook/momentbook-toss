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
          <p className="section-heading__eyebrow">MomentBook</p>
          <h2 className="hero-card__title">당신의 순간을 기억하세요</h2>
          <p className="hero-card__description">사진이 모먼트로 정리되면 여행의 흐름이 다시 보입니다.</p>
        </div>
      </section>

      <section aria-labelledby="discover-list-title" className="discover-screen__section">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">공개 여정</p>
            <h3 id="discover-list-title">여정 예시</h3>
          </div>
        </div>

        <div className="discover-journey-list" aria-label="여정 예시 carousel">
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
                </div>
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
