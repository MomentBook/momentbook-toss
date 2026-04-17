import { ListHeader, Top } from '@toss/tds-mobile'
import {
  formatCount,
  formatMomentWindow,
  formatSourceLabel,
  type JourneyDraft,
} from '../lib/momentbook'

type TimelineScreenProps = {
  draft: JourneyDraft
  onChangePhotos: () => void
}

export function TimelineScreen({ draft, onChangePhotos }: TimelineScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)
  const sourceLabel = draft.coverPhoto == null ? '-' : formatSourceLabel(draft.coverPhoto.source)

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
              <div className="hero-metric">
                <span>가져온 방식</span>
                <strong>{sourceLabel}</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              정리된 타임라인
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              장면별 제목과 짧은 설명을 붙여서 처음 보는 사람도 흐름을 빠르게 이해할 수 있게 했어요.
            </ListHeader.DescriptionParagraph>
          }
          right={
            <ListHeader.RightText typography="t7">
              {draft.previewPath}
            </ListHeader.RightText>
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

              <div className="timeline-meta">
                <span>{formatMomentWindow(moment)}</span>
              </div>

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

      <section className="surface-card">
        <div className="timeline-next-step">
          <h3>결과를 본 흐름 그대로 공개로 이어져요</h3>
          <p>
            방금 확인한 여정의 맥락이 남아 있을 때 다음 행동으로 넘어가게 하면 공개 결정이 더 자연스럽게 이어져요.
          </p>
          <p className="section-note">
            이번 구현은 실제 공개나 외부 이동 없이, 공개 유도 화면과 전환 감각만 더미로 보여줘요.
          </p>
        </div>
      </section>
    </>
  )
}
