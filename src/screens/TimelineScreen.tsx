import { ListHeader, Top } from '@toss/tds-mobile'
import { formatCount, formatMomentWindow, type JourneyDraft } from '../lib/momentbook'

type TimelineScreenProps = {
  draft: JourneyDraft
  onChangePhotos: () => void
}

export function TimelineScreen({ draft, onChangePhotos }: TimelineScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)

  return (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">정리 완료</span>
              <span className="top-badge">여정 타임라인</span>
            </div>
          }
          title={<Top.TitleParagraph>{draft.title}</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>{draft.subtitle}</Top.SubtitleParagraph>}
          right={
            <Top.RightButton variant="weak" size="small" onClick={onChangePhotos}>
              사진 바꾸기
            </Top.RightButton>
          }
          lower={
            <div className="hero-metrics">
              <div className="hero-metric">
                <span>사진</span>
                <strong>{formatCount(photoCount, '장')}</strong>
              </div>
              <div className="hero-metric">
                <span>장면</span>
                <strong>{formatCount(draft.timeline.length, '개')}</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              타임라인
            </ListHeader.TitleParagraph>
          }
        />

        <div className="timeline-stack">
          {draft.timeline.map((moment, index) => (
            <article className="timeline-card" key={moment.id}>
              <div className="timeline-card-head">
                <div>
                  <p className="eyebrow">장면 {String(index + 1).padStart(2, '0')}</p>
                  <h3>{moment.title}</h3>
                </div>
                <span className="info-pill">{formatCount(moment.photos.length, '장')}</span>
              </div>

              <p className="timeline-summary">{moment.summary}</p>

              {moment.startedAt != null || moment.endedAt != null ? (
                <div className="timeline-meta">
                  <span>{formatMomentWindow(moment)}</span>
                </div>
              ) : null}

              <div className="timeline-preview-grid">
                {moment.photos.slice(0, 4).map((photo, photoIndex) => (
                  <figure className="timeline-preview" key={`${moment.id}-${photo.id}`}>
                    <img
                      src={photo.previewUrl}
                      alt={`${moment.title} 대표 사진 ${photoIndex + 1}`}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
