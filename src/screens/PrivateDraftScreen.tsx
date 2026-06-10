import { Button } from '@toss/tds-mobile'
import { type JourneyDraft } from '../lib/momentbook'

type PrivateDraftScreenProps = {
  draft: JourneyDraft
  saveErrorMessage: string | null
  saveStatus: 'idle' | 'authenticating' | 'saving' | 'failed' | 'complete'
  onBackToTimeline: () => void
}

export function PrivateDraftScreen({
  draft,
  saveErrorMessage,
  saveStatus,
  onBackToTimeline,
}: PrivateDraftScreenProps) {
  const timelinePhotoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)
  const unassignedPhotoCount = draft.unassignedPhotos.length
  const totalPhotoCount = timelinePhotoCount + unassignedPhotoCount

  return saveStatus === 'complete' ? (
    <>
      <section className="hero-card private-draft-hero">
        <div className="hero-card__content">
          <span className="section-badge section-badge--success">완료</span>
          <h2 className="hero-card__title">비공개 여정을 저장했어요</h2>
          <p className="hero-card__description">공개 URL 없이 서버에 비공개로 보관돼요.</p>
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
              <strong>{totalPhotoCount}장</strong>
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
          <h2 className="hero-card__title">Toss 로그인 후 비공개로 저장해요</h2>
          <p className="hero-card__description">
            선택한 사진, 모먼트, 미정리 사진을 공개 없이 서버에 저장하는 단계예요.
          </p>

          {saveStatus === 'authenticating' ? (
            <p className="publish-note">Toss 로그인을 확인하는 중이에요.</p>
          ) : saveStatus === 'saving' ? (
            <p className="publish-note">비공개 저장을 준비하는 중이에요.</p>
          ) : saveStatus === 'failed' && saveErrorMessage != null ? (
            <p className="publish-note publish-note--error">{saveErrorMessage}</p>
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
            <span className="path-chip">Private server save</span>
            <h3>{draft.title}</h3>
            <p>{draft.subtitle}</p>

            <div className="publish-review-stats">
              <article className="metric-card">
                <span>전체 사진</span>
                <strong>{totalPhotoCount}장</strong>
              </article>
              <article className="metric-card">
                <span>모먼트</span>
                <strong>{draft.timeline.length}개</strong>
              </article>
              <article className="metric-card">
                <span>미정리</span>
                <strong>{unassignedPhotoCount}장</strong>
              </article>
            </div>

            <div className="info-grid">
              <article className="info-card">
                <p className="info-card__eyebrow">Toss 로그인</p>
                <h4>authorization code만 서버로 보내요</h4>
                <p>access token과 refresh token은 WebView에 저장하지 않아요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">비공개 저장</p>
                <h4>공개 URL을 만들지 않아요</h4>
                <p>서버에는 비공개 여정으로 보관하고 공개 게시와 분리해요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">미정리 사진</p>
                <h4>정리하지 않은 사진도 포함해요</h4>
                <p>{unassignedPhotoCount}장은 타임라인 밖에 두고 함께 저장해요.</p>
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
