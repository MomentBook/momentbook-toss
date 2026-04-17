import { Button } from '@toss/tds-mobile'
import {
  formatCount,
  formatPhotoRange,
  formatSourceLabel,
  type PhotoAsset,
} from '../lib/momentbook'

type UploadScreenProps = {
  copy: {
    badge: string
    helper: string
    pickerLabel: string
    emptyDescription: string
  }
  photos: PhotoAsset[]
  onPickPhotos: () => void
}

export function UploadScreen({ copy, photos, onPickPhotos }: UploadScreenProps) {
  const previewPhotos = photos.slice(0, 6)
  const remainingPhotos = Math.max(0, photos.length - previewPhotos.length)
  const hasPhotos = photos.length > 0
  const sourceLabel = hasPhotos ? formatSourceLabel(photos[0].source) : copy.badge

  return (
    <>
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">사진으로 시작하는 여정</span>
          <h2 className="hero-card__title">흩어진 여행 사진을 한 권의 기록으로 정리해드릴게요.</h2>
          <p className="hero-card__description">{copy.helper}</p>

          <div className="feature-chips">
            <span className="feature-chip">시간순 자동 정렬</span>
            <span className="feature-chip">모먼트 요약 초안</span>
            <span className="feature-chip">모바일 공개 페이지</span>
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">{hasPhotos ? '선택 완료' : '사진 선택'}</p>
            <h3>{hasPhotos ? '이 사진들로 여정을 만들 수 있어요' : '여행 사진을 불러오면 바로 초안을 시작해요'}</h3>
          </div>

          {hasPhotos ? <strong className="stat-pill">{formatCount(photos.length, '장')}</strong> : null}
        </div>

        {hasPhotos ? (
          <div className="section-stack">
            <div className="metric-row">
              <article className="metric-card">
                <span>촬영 범위</span>
                <strong>{formatPhotoRange(photos)}</strong>
              </article>
              <article className="metric-card">
                <span>불러온 경로</span>
                <strong>{sourceLabel}</strong>
              </article>
            </div>

            <div className="photo-grid">
              {previewPhotos.map((photo, index) => (
                <figure className="photo-card" key={photo.id}>
                  <img src={photo.previewUrl} alt={`선택한 사진 ${index + 1}`} loading="lazy" />
                </figure>
              ))}

              {remainingPhotos > 0 ? (
                <div className="photo-card photo-card--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
                  <span>+{remainingPhotos}</span>
                </div>
              ) : null}
            </div>

            <Button display="full" size="large" variant="weak" onClick={onPickPhotos}>
              사진 다시 고르기
            </Button>
          </div>
        ) : (
          <div className="section-stack">
            <div className="empty-grid" aria-hidden="true">
              <div className="photo-card photo-card--placeholder">대표 사진</div>
              <div className="photo-card photo-card--placeholder" />
              <div className="photo-card photo-card--placeholder" />
              <div className="photo-card photo-card--placeholder" />
              <div className="photo-card photo-card--placeholder" />
              <div className="photo-card photo-card--placeholder" />
            </div>

            <p className="helper-copy">{copy.emptyDescription}</p>
          </div>
        )}
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">정리 방식</p>
            <h3>모먼트북은 이렇게 여정을 만들어드려요</h3>
          </div>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <p className="info-card__eyebrow">01</p>
            <h4>사진 흐름 정리</h4>
            <p>촬영 시간과 장면 변화를 기준으로 자연스러운 순서를 맞춰요.</p>
          </article>

          <article className="info-card">
            <p className="info-card__eyebrow">02</p>
            <h4>모먼트 묶기</h4>
            <p>비슷한 공기와 장면을 가진 사진을 하나의 이야기로 엮어요.</p>
          </article>

          <article className="info-card">
            <p className="info-card__eyebrow">03</p>
            <h4>공개용 초안 만들기</h4>
            <p>대표 이미지와 제목을 골라 바로 공유할 수 있는 페이지로 정리해요.</p>
          </article>
        </div>
      </section>
    </>
  )
}
