import { Button } from '@toss/tds-mobile'
import { type JourneyDraft } from '../lib/momentbook'

type PrivateDraftScreenProps = {
  draft: JourneyDraft
  saveStatus: 'idle' | 'saving' | 'complete'
  onBackToTimeline: () => void
}

export function PrivateDraftScreen({
  draft,
  saveStatus,
  onBackToTimeline,
}: PrivateDraftScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)

  return saveStatus === 'complete' ? (
    <>
      <section className="hero-card private-draft-hero">
        <div className="hero-card__content">
          <span className="section-badge section-badge--success">완료</span>
          <h2 className="hero-card__title">비공개 여정 초안을 만들었어요</h2>
          <p className="hero-card__description">서버 업로드나 공개 URL은 만들지 않았어요.</p>
        </div>

        {draft.coverPhoto != null ? (
          <figure className="private-draft-hero__cover">
            <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
          </figure>
        ) : null}
      </section>

      <section className="panel-card">
        <div className="publish-success-card private-draft-receipt">
          <span className="path-chip">Private draft</span>
          <h3>{draft.title}</h3>
          <p>{draft.subtitle}</p>

          <div className="publish-success-stats">
            <article className="metric-card">
              <span>사진</span>
              <strong>{photoCount}장</strong>
            </article>
            <article className="metric-card">
              <span>모먼트</span>
              <strong>{draft.timeline.length}개</strong>
            </article>
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      <section className="hero-card private-draft-hero private-draft-hero--review">
        <div className="hero-card__content">
          <span className="section-badge">저장 전 확인</span>
          <h2 className="hero-card__title">비공개로 마무리하세요</h2>
          <p className="hero-card__description">대표 사진, 모먼트 순서, 메모를 한 번 더 확인해요.</p>

          {saveStatus === 'saving' ? (
            <p className="publish-note">초안을 정리하는 중이에요.</p>
          ) : null}
        </div>

        {draft.coverPhoto != null ? (
          <figure className="private-draft-hero__cover">
            <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
          </figure>
        ) : null}
      </section>

      <section className="panel-card">
        <div className="publish-layout">
          <div className="publish-meta">
            <span className="path-chip">Private only</span>
            <h3>{draft.title}</h3>
            <p>{draft.subtitle}</p>

            <div className="publish-review-stats">
              <article className="metric-card">
                <span>사진</span>
                <strong>{photoCount}장</strong>
              </article>
              <article className="metric-card">
                <span>모먼트</span>
                <strong>{draft.timeline.length}개</strong>
              </article>
            </div>

            <div className="info-grid">
              <article className="info-card">
                <p className="info-card__eyebrow">공개 없음</p>
                <h4>공개 URL을 만들지 않아요</h4>
                <p>이 단계는 토스 안의 비공개 미리보기예요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">수동 구성</p>
                <h4>내가 고른 모먼트를 사용해요</h4>
                <p>{draft.timeline.length}개의 모먼트와 메모가 이 흐름으로 유지돼요.</p>
              </article>
            </div>

            <Button display="full" size="large" variant="weak" onClick={onBackToTimeline}>
              타임라인으로 돌아가기
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
