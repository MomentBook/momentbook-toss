import { Button, Loader } from '@toss/tds-mobile'
import { formatCount, formatSourceLabel, type PhotoAsset } from '../lib/momentbook'

type UploadScreenProps = {
  isPickingPhotos: boolean
  pickLabel: string
  photos: PhotoAsset[]
  selectionErrorMessage: string | null
  onPickPhotos: () => void
}

export function UploadScreen({
  isPickingPhotos,
  pickLabel,
  photos,
  selectionErrorMessage,
  onPickPhotos,
}: UploadScreenProps) {
  const previewPhotos = photos.slice(0, photos.length > 6 ? 5 : 6)
  const remainingPhotos = Math.max(0, photos.length - previewPhotos.length)
  const hasPhotos = photos.length > 0
  const sourceLabel = hasPhotos ? formatSourceLabel(photos[0].source) : null
  const shouldShowFullLoadingState = isPickingPhotos && !hasPhotos
  const shouldShowFullErrorState = selectionErrorMessage != null && !hasPhotos
  const selectedStateErrorMessage =
    selectionErrorMessage != null && hasPhotos
      ? '새 사진을 가져오지 못했어요. 지금 선택은 그대로 두고 다시 시도할 수 있어요.'
      : null

  return (
    <section className="upload-flow" aria-label="사진 업로드 화면">
      <section aria-labelledby="upload-panel-title" className="upload-panel upload-panel--states">
        <div className="upload-panel__intro">
          <span className="section-badge section-badge--primary">
            {hasPhotos ? '사진 확인' : '사진 선택'}
          </span>
          <h2 id="upload-panel-title">정리할 사진만 먼저 골라주세요</h2>
          <p>
            {hasPhotos
              ? '대표 장면만 먼저 보여드릴게요. 순간 구성은 다음 단계에서 직접 할 수 있어요.'
              : '이번 여정을 설명할 사진만 먼저 고르면 돼요.'}
          </p>
        </div>

        {shouldShowFullLoadingState ? (
          <div aria-live="polite" className="upload-state upload-state--loading" role="status">
            <Loader label="사진을 불러오는 중이에요." size="large" />
            <p className="upload-state__note">선택이 끝나면 바로 다음 단계로 이어갈 수 있어요.</p>
          </div>
        ) : shouldShowFullErrorState ? (
          <div className="upload-state upload-state--error" role="alert">
            <span aria-hidden="true" className="upload-state__icon upload-state__icon--error">
              !
            </span>
            <div className="upload-state__copy">
              <h3>사진을 가져오지 못했어요</h3>
              <p>{selectionErrorMessage}</p>
            </div>
            <Button display="full" size="large" variant="weak" onClick={onPickPhotos}>
              다시 시도하기
            </Button>
          </div>
        ) : hasPhotos ? (
          <>
            <div className="upload-selection-header">
              <div>
                <p className="section-heading__eyebrow">선택 결과</p>
                <h3>{formatCount(photos.length, '장 준비됐어요')}</h3>
              </div>

              <button
                className="upload-panel__action"
                disabled={isPickingPhotos}
                type="button"
                onClick={onPickPhotos}
              >
                다시 고르기
              </button>
            </div>

            <div className="upload-panel__chips">
              <span className="stat-pill">{formatCount(photos.length, '장')}</span>
              {sourceLabel != null ? <span className="feature-chip">{sourceLabel}</span> : null}
            </div>

            <p className="helper-copy">많이 보여주기보다 지금은 필요한 사진만 간단히 확인할게요.</p>

            {isPickingPhotos ? (
              <div aria-live="polite" className="upload-feedback upload-feedback--loading" role="status">
                <Loader label="새 사진을 확인하는 중이에요." size="small" />
              </div>
            ) : null}

            {selectedStateErrorMessage != null ? (
              <div className="upload-feedback upload-feedback--error" role="alert">
                <div className="upload-feedback__copy">
                  <strong>새 사진을 불러오지 못했어요</strong>
                  <p>{selectedStateErrorMessage}</p>
                </div>

                <button className="upload-feedback__action" type="button" onClick={onPickPhotos}>
                  다시 시도
                </button>
              </div>
            ) : null}

            <div className="upload-grid" aria-label="선택한 사진 미리보기">
              {previewPhotos.map((photo, index) => (
                <figure className="upload-tile" key={photo.id}>
                  <img src={photo.previewUrl} alt={`업로드한 사진 ${index + 1}`} loading="lazy" />
                </figure>
              ))}

              {remainingPhotos > 0 ? (
                <div className="upload-tile upload-tile--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
                  <strong>+{remainingPhotos}</strong>
                  <span>더 있어요</span>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="upload-state upload-empty-state">
            <span aria-hidden="true" className="upload-state__icon">
              +
            </span>
            <div className="upload-state__copy">
              <h3>아직 고른 사진이 없어요</h3>
              <p>선택한 뒤에 순간별로 직접 나누고 흐름을 만들 수 있어요.</p>
            </div>
            <Button display="full" size="large" onClick={onPickPhotos}>
              {pickLabel}
            </Button>
          </div>
        )}
      </section>
    </section>
  )
}
