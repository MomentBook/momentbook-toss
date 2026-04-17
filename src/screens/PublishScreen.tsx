import { Button, Result, Top } from '@toss/tds-mobile'
import { type JourneyDraft } from '../lib/momentbook'

type PublishScreenProps = {
  draft: JourneyDraft
  publishStatus: 'idle' | 'publishing' | 'complete'
  onBackToTimeline: () => void
}

export function PublishScreen({
  draft,
  publishStatus,
  onBackToTimeline,
}: PublishScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)

  return publishStatus === 'complete' ? (
    <>
      <section className="surface-card hero-card">
        <Result
          title="페이지 미리보기를 만들었어요"
          description="실제 공개는 연결되지 않았어요."
        />
      </section>

      <section className="surface-card">
        <div className="publish-success-card">
          <span className="path-chip">{draft.previewPath}</span>
          <h3>{draft.title}</h3>
          <p>
            {photoCount}장 · {draft.timeline.length}개 장면
          </p>
        </div>
      </section>
    </>
  ) : (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">공개</span>
              <span className="top-badge">미리보기</span>
            </div>
          }
          title={<Top.TitleParagraph>이 여정을 웹에 공개해 볼까요?</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>링크로 볼 수 있는 페이지를 준비해요.</Top.SubtitleParagraph>}
        />
      </section>

      <section className="surface-card">
        <div className="publish-preview">
          <div className="publish-preview-card">
            {draft.coverPhoto != null ? (
              <figure className="publish-cover">
                <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
              </figure>
            ) : null}

            <div className="publish-meta">
              <span className="path-chip">{draft.previewPath}</span>
              <h3>{draft.title}</h3>
              <p>{draft.subtitle}</p>
            </div>
          </div>

          <div className="inline-actions">
            <Button display="full" size="large" variant="weak" onClick={onBackToTimeline}>
              나중에 하기
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
