import { ListHeader, Top } from '@toss/tds-mobile'
import { formatCount, formatPhotoRange, type PhotoAsset } from '../lib/momentbook'

type ReviewScreenProps = {
  photos: PhotoAsset[]
  runtimeLabel: string
  onChangePhotos: () => void
}

export function ReviewScreen({ photos, runtimeLabel, onChangePhotos }: ReviewScreenProps) {
  const samplePhotos = photos.slice(0, 6)
  const remainingPhotos = Math.max(0, photos.length - samplePhotos.length)

  return (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">사진 확인</span>
              <span className="top-badge">{runtimeLabel}</span>
            </div>
          }
          title={<Top.TitleParagraph>선택한 사진을 확인해요</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>맞으면 바로 정리해요.</Top.SubtitleParagraph>}
          right={
            <Top.RightButton variant="weak" size="small" onClick={onChangePhotos}>
              다시 고르기
            </Top.RightButton>
          }
          lower={
            <div className="hero-metrics">
              <div className="hero-metric">
                <span>선택한 사진</span>
                <strong>{formatCount(photos.length, '장')}</strong>
              </div>
              <div className="hero-metric">
                <span>촬영 범위</span>
                <strong>{formatPhotoRange(photos)}</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              선택한 사진
            </ListHeader.TitleParagraph>
          }
          right={
            <ListHeader.RightText typography="t7">
              {formatCount(photos.length, '장')}
            </ListHeader.RightText>
          }
        />

        <div className="photo-grid">
          {samplePhotos.map((photo, index) => (
            <figure className="photo-card" key={photo.id}>
              <img src={photo.previewUrl} alt={`검토 중인 사진 ${index + 1}`} loading="lazy" />
            </figure>
          ))}

          {remainingPhotos > 0 ? (
            <div className="photo-card photo-card--more" aria-label={`추가 사진 ${remainingPhotos}장`}>
              <span>+{remainingPhotos}</span>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
