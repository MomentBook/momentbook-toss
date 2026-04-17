import { featuredJourneys } from '../lib/featuredJourneys'
import { formatCount } from '../lib/momentbook'

type DiscoverScreenProps = {
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ onOpenJourney }: DiscoverScreenProps) {
  return (
    <section className="panel-card discover-simple">
      <div className="discover-simple__header">
        <h2 className="discover-simple__title">샘플 여정</h2>
      </div>

      <div className="discover-simple__list" aria-label="샘플 여정 목록">
        {featuredJourneys.map((journey) => (
          <button
            className="discover-simple__item"
            key={journey.id}
            type="button"
            onClick={() => onOpenJourney(journey.id)}
          >
            <div className="discover-simple__item-copy">
              <h3>{journey.title}</h3>
              <p className="discover-simple__item-meta">
                {journey.location} · {journey.duration} · {formatCount(journey.photoCount, '장')}
              </p>
            </div>

            <span className="discover-simple__item-action">보기</span>
          </button>
        ))}
      </div>
    </section>
  )
}
