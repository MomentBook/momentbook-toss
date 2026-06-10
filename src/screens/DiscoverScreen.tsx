import { featuredJourneys } from '../lib/featuredJourneys'
import { formatCount } from '../lib/momentbook'

type DiscoverScreenProps = {
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ onOpenJourney }: DiscoverScreenProps) {
  const heroJourney = featuredJourneys[0]

  return (
    <div className="discover-screen">
      <section className="discover-hero" aria-labelledby="discover-hero-title">
        <div className="discover-hero__media">
          <img alt={heroJourney.coverPhoto.alt} src={heroJourney.coverPhoto.previewUrl} />
        </div>
        <div className="discover-hero__scrim" />

        <div className="discover-hero__content">
          <p className="discover-hero__brand">MomentBook</p>
          <h2 id="discover-hero-title">순간이 여정으로 보이게</h2>
          <p>사진이 모먼트로 정리되면 여행의 흐름이 조용히 다시 보입니다.</p>

          <div className="discover-hero__meta" aria-label={`${heroJourney.title} 대표 여정 정보`}>
            <span>{heroJourney.location}</span>
            <span>{heroJourney.duration}</span>
            <span>{formatCount(heroJourney.photoCount, '장')}</span>
          </div>
        </div>
      </section>

      <section aria-labelledby="discover-list-title" className="discover-screen__section">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">공개 여정</p>
            <h3 id="discover-list-title">완성된 흐름 먼저 보기</h3>
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
