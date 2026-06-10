import { type FeaturedJourney } from '../lib/featuredJourneys'
import { formatCount } from '../lib/momentbook'

type FeaturedJourneyScreenProps = {
  journey: FeaturedJourney
  onBack: () => void
  onOpenTimeline: (momentId: string) => void
}

const previewPhotoLimit = 4

export function FeaturedJourneyScreen({
  journey,
  onBack,
  onOpenTimeline,
}: FeaturedJourneyScreenProps) {
  const momentCountLabel = formatCount(journey.moments.length, '개 모먼트')

  return (
    <div className="featured-journey">
      <section className="featured-journey__hero">
        <div className="featured-journey__hero-media">
          <img alt={journey.coverPhoto.alt} src={journey.coverPhoto.previewUrl} />
        </div>
        <div className="featured-journey__hero-overlay" />

        <div className="featured-journey__hero-topbar">
          <button
            aria-label="둘러보기로 돌아가기"
            className="featured-journey__back-button"
            type="button"
            onClick={onBack}
          >
            <span aria-hidden="true">&lt;</span>
          </button>

          <span className="section-badge section-badge--glass">공개 여정</span>
        </div>

        <div className="featured-journey__hero-content">
          <div className="featured-journey__hero-chips">
            <span className="featured-journey__chip">{journey.location}</span>
            <span className="featured-journey__chip">{journey.duration}</span>
            <span className="featured-journey__chip">{formatCount(journey.photoCount, '장')}</span>
          </div>

          <div className="featured-journey__hero-copy">
            <p className="featured-journey__hero-eyebrow">Journey</p>
            <h2>{journey.title}</h2>
            <p className="featured-journey__hero-summary">{journey.summary}</p>
          </div>
        </div>
      </section>

      <section className="featured-journey__intro">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">모먼트</p>
            <h3>장면이 이어지는 흐름</h3>
          </div>

          <span className="stat-pill">{momentCountLabel}</span>
        </div>

        <p className="featured-journey__intro-copy">{journey.tone}</p>
      </section>

      <section className="featured-journey__timeline-list">
        {journey.moments.map((moment, index) => {
          const previewPhotos = moment.photos.slice(0, previewPhotoLimit)
          const hiddenPhotoCount = Math.max(moment.photos.length - previewPhotoLimit, 0)

          return (
            <button
              key={moment.id}
              aria-label={`${journey.title}의 ${moment.title} 타임라인 자세히 보기`}
              className="featured-journey__timeline-card"
              type="button"
              onClick={() => onOpenTimeline(moment.id)}
            >
              {previewPhotos.length > 0 ? (
                <div className="featured-journey__timeline-media">
                  <figure className="featured-journey__timeline-lead-photo">
                    <img
                      alt={previewPhotos[0].alt}
                      loading="lazy"
                      src={previewPhotos[0].previewUrl}
                    />
                  </figure>

                  {previewPhotos.length > 1 ? (
                    <div className="featured-journey__timeline-strip">
                      {previewPhotos.slice(1).map((photo, photoIndex, stripPhotos) => (
                        <figure className="featured-journey__timeline-photo" key={photo.id}>
                          <img
                            alt={photo.alt}
                            loading="lazy"
                            src={photo.previewUrl}
                          />

                          {photoIndex === stripPhotos.length - 1 && hiddenPhotoCount > 0 ? (
                            <div className="featured-journey__timeline-overlay">
                              <span>+{hiddenPhotoCount}</span>
                            </div>
                          ) : null}
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="featured-journey__timeline-head">
                <div>
                  <div className="featured-journey__timeline-track">
                    <span className="featured-journey__timeline-index">
                      Moment {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="featured-journey__timeline-bar" />
                  </div>

                  <h3>{moment.title}</h3>
                </div>

                <span className="stat-pill">{formatCount(moment.photos.length, '장')}</span>
              </div>

              <p className="featured-journey__timeline-summary">{moment.summary}</p>
              <p className="featured-journey__timeline-date">{moment.dateLabel}</p>

              <span className="featured-journey__timeline-action">장면 자세히 보기</span>
            </button>
          )
        })}
      </section>
    </div>
  )
}
