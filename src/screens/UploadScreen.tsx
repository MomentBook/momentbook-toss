import { Button, ListHeader, Result, Top } from '@toss/tds-mobile'
import { formatCount, formatPhotoRange, type PhotoAsset } from '../lib/momentbook'

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
  const samplePhotos = photos.slice(0, 4)
  const remainingPhotos = Math.max(0, photos.length - samplePhotos.length)
  const hasPhotos = photos.length > 0

  return (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">Momentbook</span>
              <span className="top-badge">{copy.badge}</span>
            </div>
          }
          title={<Top.TitleParagraph>사진을 고르면 바로 정리해요</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>{copy.helper}</Top.SubtitleParagraph>}
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              {hasPhotos ? '선택한 사진' : '사진 선택'}
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              {hasPhotos ? formatPhotoRange(photos) : copy.emptyDescription}
            </ListHeader.DescriptionParagraph>
          }
          right={
            hasPhotos ? (
              <ListHeader.RightText typography="t7">
                {formatCount(photos.length, '장')}
              </ListHeader.RightText>
            ) : undefined
          }
        />

        {hasPhotos ? (
          <>
            <div className="photo-grid">
              {samplePhotos.map((photo, index) => (
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

            <div className="section-actions">
              <Button display="full" size="large" variant="weak" onClick={onPickPhotos}>
                다시 고르기
              </Button>
            </div>
          </>
        ) : (
          <Result title="사진을 선택해 주세요" />
        )}
      </section>
    </>
  )
}
