import { formatCount, formatSourceLabel, type PhotoAsset } from '../lib/momentbook'

type UploadScreenProps = {
  emptyDescription: string
  errorMessage: string | null
  photos: PhotoAsset[]
  onPickPhotos: () => void
}

const placeholderLabels = ['대표 장면', '', '', '', '', '', '', '', '']

export function UploadScreen({
  emptyDescription,
  errorMessage,
  photos,
  onPickPhotos,
}: UploadScreenProps) {
  const previewPhotos = photos.slice(0, 8)
  const remainingPhotos = Math.max(0, photos.length - previewPhotos.length)
  const hasPhotos = photos.length > 0
  const sourceLabel = hasPhotos ? formatSourceLabel(photos[0].source) : null
  const helperText = hasPhotos
    ? '사진 업로드를 다시 누르면 선택을 바꾸거나 새로 고를 수 있어요.'
    : emptyDescription

  return (
    <section className="upload-flow" aria-label="사진 업로드 화면">
      <button className="upload-trigger" type="button" onClick={onPickPhotos}>
        <span aria-hidden="true" className="upload-trigger__symbol">
          +
        </span>

        <span className="upload-trigger__body">
          <span className="upload-trigger__label">사진 업로드</span>
          <span className="upload-trigger__caption">
            {hasPhotos ? '선택을 바꾸거나 새 사진을 고를 수 있어요.' : '여행 사진을 고르면 바로 정리를 시작할 수 있어요.'}
          </span>
        </span>
      </button>

      <section
        aria-labelledby="upload-gallery-title"
        className={`upload-gallery${hasPhotos ? ' upload-gallery--filled' : ''}${errorMessage != null ? ' upload-gallery--error' : ''}`}
      >
        <div className="upload-gallery__header">
          <div>
            <p className="upload-gallery__eyebrow">{hasPhotos ? '업로드 완료' : '업로드 전'}</p>
            <h2 id="upload-gallery-title">
              {hasPhotos ? '업로드한 사진' : '업로드한 사진이 여기에 보여요'}
            </h2>
          </div>

          {hasPhotos ? (
            <div className="upload-gallery__chips">
              <span className="stat-pill">{formatCount(photos.length, '장')}</span>
              {sourceLabel != null ? <span className="feature-chip">{sourceLabel}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="upload-gallery__grid">
          {hasPhotos
            ? previewPhotos.map((photo, index) => (
                <figure className="upload-tile" key={photo.id}>
                  <img src={photo.previewUrl} alt={`업로드한 사진 ${index + 1}`} loading="lazy" />
                </figure>
              ))
            : placeholderLabels.map((label, index) => (
                <div className="upload-tile upload-tile--placeholder" key={`placeholder-${index}`}>
                  {label.length > 0 ? <span>{label}</span> : null}
                </div>
              ))}

          {hasPhotos && remainingPhotos > 0 ? (
            <div className="upload-tile upload-tile--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
              <span>+{remainingPhotos}</span>
            </div>
          ) : null}
        </div>

        <p
          className={`upload-gallery__footer${errorMessage != null ? ' upload-gallery__footer--error' : ''}`}
          role={errorMessage != null ? 'alert' : 'status'}
        >
          {errorMessage ?? helperText}
        </p>
      </section>
    </section>
  )
}
