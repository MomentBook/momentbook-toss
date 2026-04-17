import { Button } from '@toss/tds-mobile'
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
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--success">공개 준비 완료</span>
          <h2 className="hero-card__title">모먼트북 페이지가 준비됐어요.</h2>
          <p className="hero-card__description">
            지금은 데모 흐름이라 실제 게시 대신 공개용 경로와 구성만 미리 보여드려요.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="publish-success-card">
          <span className="path-chip">{draft.previewPath}</span>
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
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge">공개 전 확인</span>
          <h2 className="hero-card__title">이제 링크 한 장으로 여정을 보여줄 수 있어요.</h2>
          <p className="hero-card__description">
            대표 이미지와 제목, 모먼트 구성을 공개용 페이지로 정리해드려요.
          </p>

          {publishStatus === 'publishing' ? (
            <p className="publish-note">모먼트북 페이지를 만드는 중이에요. 잠시만 기다려 주세요.</p>
          ) : null}
        </div>
      </section>

      <section className="panel-card">
        <div className="publish-layout">
          {draft.coverPhoto != null ? (
            <figure className="publish-cover">
              <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
            </figure>
          ) : null}

          <div className="publish-meta">
            <span className="path-chip">{draft.previewPath}</span>
            <h3>{draft.title}</h3>
            <p>{draft.subtitle}</p>

            <div className="info-grid">
              <article className="info-card">
                <p className="info-card__eyebrow">대표 커버</p>
                <h4>첫 화면에서 여정을 소개해요</h4>
                <p>대표 사진과 핵심 정보가 상단에 정리돼 한눈에 흐름을 보여줘요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">모먼트 카드</p>
                <h4>핵심 장면을 카드형으로 묶어요</h4>
                <p>{draft.timeline.length}개의 모먼트가 순서대로 이어져 읽기 쉬운 페이지가 돼요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">사진 개수</p>
                <h4>{photoCount}장의 사진이 포함돼요</h4>
                <p>선택한 사진을 그대로 사용해 공개용 미리보기를 만들어드려요.</p>
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
