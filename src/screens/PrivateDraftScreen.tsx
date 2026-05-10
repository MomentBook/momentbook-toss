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
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--success">비공개 여정 준비 완료</span>
          <h2 className="hero-card__title">토스 안에서 볼 수 있는 비공개 초안을 만들었어요.</h2>
          <p className="hero-card__description">
            지금은 서버 공개나 토스 로그인 연동 없이, 사용자가 구성한 여정을 안전한 미리보기 상태로만
            마무리해요.
          </p>
        </div>
      </section>

      <section className="panel-card">
        <div className="publish-success-card">
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

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">다음 단계</p>
            <h3>공개 기능은 MomentBook 앱과 로그인 계약이 준비된 뒤 연결해요</h3>
          </div>
        </div>
        <p className="helper-copy">
          이 미니앱은 토스 사용자가 MomentBook의 여정 구조를 먼저 경험하도록 돕는 마케팅용 흐름이에요.
          실제 공개, 프로필, 댓글, 메시지는 네이티브 앱의 서버 기반 기능으로 분리해 둡니다.
        </p>
      </section>
    </>
  ) : (
    <>
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge">비공개 저장 전 확인</span>
          <h2 className="hero-card__title">공개 없이 먼저 내 여정으로 완성해요.</h2>
          <p className="hero-card__description">
            대표 이미지, 모먼트 순서, 메모를 확인한 뒤 토스 안에서는 비공개 초안 상태로 마무리해요.
          </p>

          {saveStatus === 'saving' ? (
            <p className="publish-note">비공개 여정 초안을 정리하는 중이에요. 잠시만 기다려 주세요.</p>
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
            <span className="path-chip">Private only</span>
            <h3>{draft.title}</h3>
            <p>{draft.subtitle}</p>

            <div className="info-grid">
              <article className="info-card">
                <p className="info-card__eyebrow">공개 없음</p>
                <h4>서버 업로드와 공개 URL을 만들지 않아요</h4>
                <p>사업자 등록과 토스 로그인 연동 전까지는 공개 액션을 제품에서 숨겨 둡니다.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">수동 구성</p>
                <h4>EXIF 없이 내가 만든 모먼트를 사용해요</h4>
                <p>{draft.timeline.length}개의 모먼트와 메모가 사용자가 직접 고른 흐름으로 유지돼요.</p>
              </article>

              <article className="info-card">
                <p className="info-card__eyebrow">사진 개수</p>
                <h4>{photoCount}장의 사진이 포함돼요</h4>
                <p>선택한 사진은 미리보기용 데이터로만 다루고, 공개용 서버 전송은 실행하지 않아요.</p>
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
