import { List, ListHeader, ListRow, Top } from '@toss/tds-mobile'
import { formatCount, formatPhotoRange, formatSourceLabel, type PhotoAsset } from '../lib/momentbook'

type ReviewScreenProps = {
  photos: PhotoAsset[]
  runtimeLabel: string
  onChangePhotos: () => void
}

export function ReviewScreen({ photos, runtimeLabel, onChangePhotos }: ReviewScreenProps) {
  const samplePhotos = photos.slice(0, 6)
  const remainingPhotos = Math.max(0, photos.length - samplePhotos.length)
  const sourceLabel = photos[0] == null ? '-' : formatSourceLabel(photos[0].source)

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
          title={<Top.TitleParagraph>선택한 사진이 정리 준비를 마쳤어요</Top.TitleParagraph>}
          subtitleBottom={
            <Top.SubtitleParagraph>
              지금 단계에서는 고른 사진을 확인하고 바로 자동 정리로 이어져요.
            </Top.SubtitleParagraph>
          }
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
              <div className="hero-metric">
                <span>가져온 방식</span>
                <strong>{sourceLabel}</strong>
              </div>
            </div>
          }
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              사진 미리보기
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              아래 미리보기는 일부만 보여주고, 실제 정리에는 선택한 전체 사진을 사용해요.
            </ListHeader.DescriptionParagraph>
          }
          right={
            <ListHeader.RightText typography="t7">
              {formatPhotoRange(photos)}
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

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              다음 화면에서 보여줄 내용
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              자동 정리를 누르면 잠깐의 정리 과정을 보여준 뒤 여정 타임라인과 공개 CTA를 이어서 보여줘요.
            </ListHeader.DescriptionParagraph>
          }
        />

        <List>
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                흐름
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="정리 중 경험"
                bottom="실제 처리처럼 보이되, 이번 구현에서는 더미 단계만 짧게 보여줘요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                결과
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="여정 타임라인"
                bottom="여러 장면으로 나눈 타이틀, 요약, 사진 묶음을 한 화면에서 확인해요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                CTA
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="웹 공개 유도"
                bottom="결과를 본 직후 다음 행동이 끊기지 않도록 공개하기 CTA로 바로 이어져요."
              />
            }
          />
        </List>
      </section>
    </>
  )
}
