import { Button } from '@toss/tds-mobile'
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
      <section className="hero-card featured-journey">
        <div className="featured-journey__top">
          <button className="back-link-button" type="button" onClick={onBack}>
            둘러보기로 돌아가기
          </button>
          <span className="section-badge">샘플 여정</span>
        </div>

        <div className="hero-card__content">
          <h2 className="hero-card__title">{journey.title}</h2>
          <p className="hero-card__description">{journey.tone}</p>

          <div className="featured-journey__meta">
            <span className="feature-chip">{journey.location}</span>
            <span className="feature-chip">{journey.duration}</span>
            <span className="feature-chip">{formatCount(journey.photoCount, '장')}</span>
            <span className="feature-chip">{formatCount(journey.moments.length, '개 모먼트')}</span>
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">여정 흐름</p>
            <h3>이런 순서로 장면이 이어져요</h3>
          </div>
        </div>

        <div className="featured-journey__moments">
          {journey.moments.map((moment, index) => (
            <article className="featured-journey__moment" key={moment.id}>
              <div className="timeline-card-head">
                <div>
                  <p className="eyebrow">Moment {String(index + 1).padStart(2, '0')}</p>
                  <h3>{moment.title}</h3>
                </div>
              </div>

              <p className="timeline-summary">{moment.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">다른 흐름도 보고 싶다면</p>
            <h3>둘러보기 목록으로 돌아가 다시 고를 수 있어요</h3>
          </div>
        </div>

        <Button display="full" size="large" variant="weak" onClick={onBack}>
          다른 여정 보기
        </Button>
      </section>
    </>
  )
}
