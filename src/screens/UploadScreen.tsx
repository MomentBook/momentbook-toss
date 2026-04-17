import { formatCount, formatSourceLabel, type PhotoAsset } from '../lib/momentbook'

type UploadScreenProps = {
  pickLabel: string
  photos: PhotoAsset[]
  onPickPhotos: () => void
}

export function UploadScreen({
  pickLabel,
  photos,
  onPickPhotos,
}: UploadScreenProps) {
  const previewPhotos = photos.slice(0, 8)
  const remainingPhotos = Math.max(0, photos.length - previewPhotos.length)
  const hasPhotos = photos.length > 0
  const sourceLabel = hasPhotos ? formatSourceLabel(photos[0].source) : null

  return (
    <section className="upload-flow" aria-label="사진 업로드 화면">
      <section aria-labelledby="upload-panel-title" className="upload-panel">
        <div className="upload-panel__header">
          <h2 id="upload-panel-title">사진</h2>

          {hasPhotos ? (
            <button className="upload-panel__action" type="button" onClick={onPickPhotos}>
              다시 고르기
            </button>
          ) : null}
        </div>

        {hasPhotos ? (
          <>
            <div className="upload-panel__chips">
              <span className="stat-pill">{formatCount(photos.length, '장')}</span>
              {sourceLabel != null ? <span className="feature-chip">{sourceLabel}</span> : null}
            </div>

            <div className="upload-grid">
              {previewPhotos.map((photo, index) => (
                <figure className="upload-tile" key={photo.id}>
                  <img src={photo.previewUrl} alt={`업로드한 사진 ${index + 1}`} loading="lazy" />
                </figure>
              ))}

              {remainingPhotos > 0 ? (
                <div className="upload-tile upload-tile--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
                  <span>+{remainingPhotos}</span>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <button className="upload-empty-state" type="button" onClick={onPickPhotos}>
            <span aria-hidden="true" className="upload-empty-state__symbol">
              +
            </span>
            <span className="upload-empty-state__label">{pickLabel}</span>
          </button>
        )}
      </section>
    </section>
  )
}
