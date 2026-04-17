import { Button } from '@toss/tds-mobile'
import {
  formatCount,
  formatPhotoRange,
  formatSourceLabel,
  type PhotoAsset,
} from '../lib/momentbook'

type ReviewScreenProps = {
  photos: PhotoAsset[]
  onChangePhotos: () => void
}

export function ReviewScreen({ photos, onChangePhotos }: ReviewScreenProps) {
  const previewPhotos = photos.slice(0, 8)
  const remainingPhotos = Math.max(0, photos.length - previewPhotos.length)
  const sourceLabel = formatSourceLabel(photos[0]?.source ?? 'browser')

  return (
    <>
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge">정리 전 마지막 확인</span>
          <h2 className="hero-card__title">이 사진들로 여행 흐름을 만들어볼게요.</h2>
          <p className="hero-card__description">
            사진 수와 촬영 범위를 확인한 뒤 바로 정리를 시작할 수 있어요.
          </p>

          <div className="metric-row">
            <article className="metric-card">
              <span>선택한 사진</span>
              <strong>{formatCount(photos.length, '장')}</strong>
            </article>
            <article className="metric-card">
              <span>촬영 범위</span>
              <strong>{formatPhotoRange(photos)}</strong>
            </article>
          </div>

          <div className="feature-chips">
            <span className="feature-chip">{sourceLabel}</span>
            <span className="feature-chip">최대 4개 모먼트 초안</span>
            <span className="feature-chip">공개 페이지 자동 구성</span>
          </div>

          <Button display="full" size="large" variant="weak" onClick={onChangePhotos}>
            사진 다시 고르기
          </Button>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">선택한 사진</p>
            <h3>대표 장면이 잘 담겼는지 확인해 보세요</h3>
          </div>
          <strong className="stat-pill">{formatCount(photos.length, '장')}</strong>
        </div>

        <div className="photo-grid">
          {previewPhotos.map((photo, index) => (
            <figure className="photo-card" key={photo.id}>
              <img src={photo.previewUrl} alt={`확인 중인 사진 ${index + 1}`} loading="lazy" />
            </figure>
          ))}

          {remainingPhotos > 0 ? (
            <div className="photo-card photo-card--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
              <span>+{remainingPhotos}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="section-heading section-heading--compact">
          <div>
            <p className="section-heading__eyebrow">자동 정리 미리보기</p>
            <h3>정리되면 이런 순서로 보여드려요</h3>
          </div>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <p className="info-card__eyebrow">시간순 정렬</p>
            <h4>여행의 시작부터 끝까지</h4>
            <p>촬영 정보를 기준으로 흐름을 맞춰 자연스럽게 읽히는 순서를 만들어요.</p>
          </article>

          <article className="info-card">
            <p className="info-card__eyebrow">장면 묶기</p>
            <h4>비슷한 공기의 순간끼리</h4>
            <p>같은 장소나 분위기의 사진을 하나의 모먼트 카드로 정리해요.</p>
          </article>

          <article className="info-card">
            <p className="info-card__eyebrow">공개 초안</p>
            <h4>공유하기 좋은 한 페이지</h4>
            <p>대표 이미지와 제목, 모먼트 요약까지 한 번에 구성해드려요.</p>
          </article>
        </div>
      </section>
    </>
  )
}
