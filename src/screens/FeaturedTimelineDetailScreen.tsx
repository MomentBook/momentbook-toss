import {
  type FeaturedJourney,
  type FeaturedJourneyMoment,
} from '../lib/featuredJourneys'

type FeaturedTimelineDetailScreenProps = {
  journey: FeaturedJourney
  moment: FeaturedJourneyMoment
  momentIndex: number
  onBack: () => void
}

export function FeaturedTimelineDetailScreen({
  journey,
  moment,
  momentIndex,
  onBack,
}: FeaturedTimelineDetailScreenProps) {
  const leadPhoto = moment.photos[0] ?? null
  const secondaryPhotos = moment.photos.slice(1)

  return (
    <div className="featured-timeline-detail">
      <div className="featured-timeline-detail__topbar">
        <button
          aria-label={`${journey.title} 상세로 돌아가기`}
          className="featured-journey__back-button featured-timeline-detail__back-button"
          type="button"
          onClick={onBack}
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        <span className="app-pill">
          Timeline {String(momentIndex + 1).padStart(2, '0')}
        </span>
      </div>

      <section className="panel-card featured-timeline-detail__intro">
        <span className="feature-chip">{moment.dateLabel}</span>
        <h2>{moment.title}</h2>
        <p>{moment.summary}</p>
      </section>

      {leadPhoto != null ? (
        <figure className="featured-timeline-detail__lead">
          <img alt={leadPhoto.alt} src={leadPhoto.previewUrl} />
        </figure>
      ) : null}

      {secondaryPhotos.length > 0 ? (
        <section className="featured-timeline-detail__grid">
          {secondaryPhotos.map((photo) => (
            <figure className="featured-timeline-detail__photo" key={photo.id}>
              <img alt={photo.alt} loading="lazy" src={photo.previewUrl} />
            </figure>
          ))}
        </section>
      ) : null}

      <section className="panel-card featured-timeline-detail__note">
        <span className="featured-timeline-detail__quote" aria-hidden="true">
          "
        </span>
        <p>{moment.note}</p>
      </section>
    </div>
  )
}
