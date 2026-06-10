import { Button } from '@toss/tds-mobile'
import { formatCount, formatMomentWindow, type JourneyDraft } from '../lib/momentbook'

type TimelineScreenProps = {
  draft: JourneyDraft
  onChangePhotos: () => void
  onEditJourneyBasics: () => void
  onEditMoments: () => void
}

export function TimelineScreen({
  draft,
  onChangePhotos,
  onEditJourneyBasics,
  onEditMoments,
}: TimelineScreenProps) {
  const timelinePhotoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)
  const unassignedPhotoCount = draft.unassignedPhotos.length
  const totalPhotoCount = timelinePhotoCount + unassignedPhotoCount
  const timelineLabel = `${formatCount(timelinePhotoCount, '장')} · ${formatCount(draft.timeline.length, '개 모먼트')}`

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
              <span className="section-badge section-badge--glass">4/4 저장 전 확인</span>
              <h2>{draft.title}</h2>
              <p>{draft.subtitle}</p>

              <div className="timeline-hero__chips">
                <span className="timeline-hero__chip">{formatCount(totalPhotoCount, '장 선택')}</span>
                <span className="timeline-hero__chip">{formatCount(draft.timeline.length, '개 모먼트')}</span>
                {unassignedPhotoCount > 0 ? (
                  <span className="timeline-hero__chip">{formatCount(unassignedPhotoCount, '장 미정리')}</span>
                ) : null}
                <span className="timeline-hero__chip">비공개</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-card__content">
            <span className="section-badge section-badge--primary">4/4 저장 전 확인</span>
            <h2 className="hero-card__title">{draft.title}</h2>
            <p className="hero-card__description">{draft.subtitle}</p>
          </div>
        )}
      </section>

      <section className="timeline-section">
        <div className="section-heading timeline-section__heading">
          <div>
            <p className="section-heading__eyebrow">타임라인</p>
            <h3>이 흐름으로 저장돼요</h3>
          </div>

          <span className="stat-pill">{timelineLabel}</span>
        </div>

        <div className="timeline-stack">
          {draft.timeline.map((moment, index) => {
            const leadPhoto = moment.photos[0] ?? null
            const stripPhotos = moment.photos.slice(1, 5)

            return (
              <article className="timeline-card" key={moment.id}>
                {leadPhoto != null ? (
                  <figure className="timeline-card__lead">
                    <img
                      src={leadPhoto.previewUrl}
                      alt={`${moment.title} 대표 사진`}
                      loading="lazy"
                    />
                  </figure>
                ) : null}

                <div className="timeline-card__body">
                  <div className="timeline-card-head">
                    <div>
                      <p className="eyebrow">Moment {String(index + 1).padStart(2, '0')}</p>
                      <h3>{moment.title}</h3>
                    </div>
                    <span className="stat-pill">{formatCount(moment.photos.length, '장')}</span>
                  </div>

                  <p className="timeline-summary">{moment.summary}</p>
                  <p className="timeline-meta">{formatMomentWindow(moment)}</p>

                  {stripPhotos.length > 0 ? (
                    <div className="timeline-preview-grid" aria-label={`${moment.title} 보조 사진`}>
                      {stripPhotos.map((photo, photoIndex) => (
                        <figure className="timeline-preview" key={`${moment.id}-${photo.id}`}>
                          <img
                            src={photo.previewUrl}
                            alt={`${moment.title} 사진 ${photoIndex + 2}`}
                            loading="lazy"
                          />
                        </figure>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {unassignedPhotoCount > 0 ? (
        <section className="panel-card unassigned-review-card">
          <div className="section-heading section-heading--compact">
            <div>
              <p className="section-heading__eyebrow">미정리 사진</p>
              <h3>함께 저장돼요</h3>
            </div>

            <span className="stat-pill">{formatCount(unassignedPhotoCount, '장')}</span>
          </div>

          <p className="helper-copy">
            타임라인에는 모먼트만 먼저 보이고, 미정리 사진은 비공개 저장 데이터에 포함돼요.
          </p>

          <div className="unassigned-review-strip" aria-label="함께 저장될 미정리 사진">
            {draft.unassignedPhotos.slice(0, 6).map((photo, index) => (
              <figure className="unassigned-review-photo" key={photo.id}>
                <img alt={`미정리 사진 ${index + 1}`} loading="lazy" src={photo.previewUrl} />
              </figure>
            ))}

            {unassignedPhotoCount > 6 ? (
              <div className="unassigned-review-more" aria-label={`추가 미정리 사진 ${unassignedPhotoCount - 6}장`}>
                +{unassignedPhotoCount - 6}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">수정</p>
            <h3>필요한 만큼만 다듬기</h3>
          </div>
        </div>

        <div className="timeline-actions">
          <Button display="full" size="large" variant="weak" onClick={onEditJourneyBasics}>
            여정 정보 수정하기
          </Button>

          <Button display="full" size="large" variant="weak" onClick={onEditMoments}>
            모먼트 수정하기
          </Button>

          <button className="timeline-text-action" type="button" onClick={onChangePhotos}>
            사진 다시 고르기
          </button>
        </div>
      </section>
    </>
  )
}
