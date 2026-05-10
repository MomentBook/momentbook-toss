import { Button } from '@toss/tds-mobile'
import { formatCount, formatMomentWindow, type JourneyDraft } from '../lib/momentbook'

type TimelineScreenProps = {
  draft: JourneyDraft
  onChangePhotos: () => void
  onEditMoments: () => void
}

export function TimelineScreen({ draft, onChangePhotos, onEditMoments }: TimelineScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)

  return (
    <>
      <section className="hero-card hero-card--timeline">
        {draft.coverPhoto != null ? (
          <div className="timeline-hero">
            <div className="timeline-hero__image">
              <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
            </div>
            <div className="timeline-hero__overlay" />

            <div className="timeline-hero__content">
              <span className="section-badge section-badge--glass">비공개 초안 미리보기</span>
              <h2>{draft.title}</h2>
              <p>{draft.subtitle}</p>

              <div className="timeline-hero__chips">
                <span className="timeline-hero__chip">{formatCount(photoCount, '장')}</span>
                <span className="timeline-hero__chip">{formatCount(draft.timeline.length, '개 모먼트')}</span>
                <span className="timeline-hero__chip">비공개</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-card__content">
            <span className="section-badge section-badge--primary">비공개 초안 미리보기</span>
            <h2 className="hero-card__title">{draft.title}</h2>
            <p className="hero-card__description">{draft.subtitle}</p>
          </div>
        )}
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">구성한 타임라인</p>
            <h3>이 순서대로 비공개 여정 초안에 담겨요</h3>
          </div>
        </div>

        <div className="timeline-stack">
          {draft.timeline.map((moment, index) => (
            <article className="timeline-card" key={moment.id}>
              <div className="timeline-card-head">
                <div>
                  <p className="eyebrow">Moment {String(index + 1).padStart(2, '0')}</p>
                  <h3>{moment.title}</h3>
                </div>
                <span className="stat-pill">{formatCount(moment.photos.length, '장')}</span>
              </div>

              <p className="timeline-summary">{moment.summary}</p>
              <p className="timeline-meta">{formatMomentWindow(moment)}</p>

              <div className="timeline-preview-grid">
                {moment.photos.slice(0, 4).map((photo, photoIndex) => (
                  <figure className="timeline-preview" key={`${moment.id}-${photo.id}`}>
                    <img
                      src={photo.previewUrl}
                      alt={`${moment.title} 사진 ${photoIndex + 1}`}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">흐름을 바꾸고 싶다면</p>
            <h3>여정 정보, 모먼트, 사진을 다시 다듬을 수 있어요</h3>
          </div>
        </div>

        <div className="timeline-actions">
          <Button display="full" size="large" variant="weak" onClick={onEditMoments}>
            여정과 모먼트 수정하기
          </Button>

          <button className="timeline-text-action" type="button" onClick={onChangePhotos}>
            사진 다시 고르기
          </button>
        </div>
      </section>
    </>
  )
}
