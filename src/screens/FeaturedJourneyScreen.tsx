import { type FeaturedJourney } from '../lib/featuredJourneys'
import { formatCount } from '../lib/momentbook'

type FeaturedJourneyScreenProps = {
  journey: FeaturedJourney
  onBack: () => void
}

export function FeaturedJourneyScreen({
  journey,
  onBack,
}: FeaturedJourneyScreenProps) {
  return (
    <>
      <section className="panel-card featured-journey">
        <button className="back-link-button" type="button" onClick={onBack}>
          목록으로
        </button>

        <div className="featured-journey__header">
          <h2 className="hero-card__title">{journey.title}</h2>
          <p className="featured-journey__meta-line">
            {journey.location} · {journey.duration} · {formatCount(journey.photoCount, '장')} ·{' '}
            {formatCount(journey.moments.length, '개')}
          </p>
        </div>
      </section>

      <section className="panel-card featured-journey__moments">
        {journey.moments.map((moment, index) => (
          <article className="featured-journey__moment" key={moment.id}>
            <span className="featured-journey__moment-index">{index + 1}</span>
            <h3>{moment.title}</h3>
          </article>
        ))}
      </section>
    </>
  )
}
