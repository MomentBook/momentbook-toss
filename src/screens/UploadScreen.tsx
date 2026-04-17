import { Button, List, ListHeader, ListRow, Result, Top } from '@toss/tds-mobile'
import { formatCount, formatPhotoRange, type PhotoAsset } from '../lib/momentbook'

type UploadScreenProps = {
  copy: {
    badge: string
    helper: string
    pickerLabel: string
    emptyDescription: string
  }
  photos: PhotoAsset[]
  onContinue: () => void
  onPickPhotos: () => void
}

export function UploadScreen({ copy, photos, onContinue, onPickPhotos }: UploadScreenProps) {
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
          title={<Top.TitleParagraph>사진을 고르면 바로 여정으로 정리해요</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>{copy.helper}</Top.SubtitleParagraph>}
          lower={
            <div className="hero-metrics">
              <div className="hero-metric">
                <span>1단계</span>
                <strong>사진 선택</strong>
              </div>
              <div className="hero-metric">
                <span>2단계</span>
                <strong>자동 정리</strong>
              </div>
              <div className="hero-metric">
                <span>3단계</span>
                <strong>공개 준비</strong>
              </div>
            </div>
          }
        />

        <div className="journey-value-strip">
          <div className="journey-value">
            <strong>선택만 하면 돼요</strong>
            <span>사진을 고르는 순간 다음 화면으로 자연스럽게 이어져요.</span>
          </div>
          <div className="journey-value">
            <strong>결과를 바로 확인해요</strong>
            <span>정리 중 상태를 짧게 보여준 뒤 타임라인을 바로 보여줘요.</span>
          </div>
          <div className="journey-value">
            <strong>공개 직전 UX까지 이어져요</strong>
            <span>실제 배포 전에도 공개 전환 흐름과 카피를 함께 검증할 수 있어요.</span>
          </div>
        </div>
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              이런 흐름으로 진행돼요
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              다음 행동이 헷갈리지 않도록 한 화면에 한 결정만 남겨 뒀어요.
            </ListHeader.DescriptionParagraph>
          }
        />

        <List>
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                1
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="사진 업로드"
                bottom="브라우저에서는 파일을, 토스 환경에서는 사진첩을 바로 열어요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                2
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="자동 정리"
                bottom="촬영 순서와 비슷한 장면을 바탕으로 더미 여정 타임라인을 만들어요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                3
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="공개 유도"
                bottom="정리된 직후 웹 공개 CTA로 자연스럽게 이어지는 화면을 보여줘요."
              />
            }
          />
        </List>
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              {hasPhotos ? '선택한 사진' : '먼저 사진을 골라 주세요'}
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              {hasPhotos
                ? '이 선택을 그대로 이어서 확인하거나, 다시 골라서 다른 여정을 만들 수 있어요.'
                : copy.emptyDescription}
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
            <div className="summary-panel">
              <strong>{formatCount(photos.length, '장의 사진이 준비됐어요')}</strong>
              <p className="support-copy">{formatPhotoRange(photos)}</p>
              <div className="inline-actions">
                <Button display="full" size="large" variant="weak" onClick={onContinue}>
                  선택 내용 확인하기
                </Button>
                <Button display="full" size="large" variant="weak" onClick={onPickPhotos}>
                  다시 고르기
                </Button>
              </div>
            </div>

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
          </>
        ) : (
          <Result
            title="사진을 고르면 바로 흐름이 시작돼요"
            description="선택한 사진은 다음 화면에서 확인한 뒤 자동 정리 단계로 이어져요."
          />
        )}
      </section>
    </>
  )
}
