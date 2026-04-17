import { Button, List, ListHeader, ListRow, Result, Top } from '@toss/tds-mobile'
import { formatCount, type JourneyDraft } from '../lib/momentbook'

type PublishScreenProps = {
  draft: JourneyDraft
  publishStatus: 'idle' | 'publishing' | 'complete'
  onBackToTimeline: () => void
}

export function PublishScreen({
  draft,
  publishStatus,
  onBackToTimeline,
}: PublishScreenProps) {
  const photoCount = draft.timeline.reduce((total, moment) => total + moment.photos.length, 0)

  return publishStatus === 'complete' ? (
    <>
      <section className="surface-card hero-card">
        <Result
          title="공개 흐름 미리보기를 마쳤어요"
          description="실제 웹 연동 전 단계라서, 지금은 공개 퍼널과 결과 화면만 더미로 확인할 수 있어요."
        />
      </section>

      <section className="surface-card">
        <div className="publish-success-card">
          <span className="path-chip">{draft.previewPath}</span>
          <h3>{draft.title}</h3>
          <p>{draft.subtitle}</p>

          <div className="hero-metrics">
            <div className="hero-metric">
              <span>공개할 사진</span>
              <strong>{formatCount(photoCount, '장')}</strong>
            </div>
            <div className="hero-metric">
              <span>정리된 장면</span>
              <strong>{formatCount(draft.timeline.length, '개')}</strong>
            </div>
            <div className="hero-metric">
              <span>공개 상태</span>
              <strong>더미 완료</strong>
            </div>
          </div>

          <div className="inline-actions">
            <Button display="full" size="large" variant="weak" onClick={onBackToTimeline}>
              타임라인 다시 보기
            </Button>
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">공개 유도</span>
              <span className="top-badge">웹 퍼널 미리보기</span>
            </div>
          }
          title={<Top.TitleParagraph>이 여정을 웹에 공개해 볼까요?</Top.TitleParagraph>}
          subtitleBottom={
            <Top.SubtitleParagraph>
              링크로 공유하기 쉬운 형태가 준비된다는 기대를 부담 없이 전달하는 화면이에요.
            </Top.SubtitleParagraph>
          }
        />
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              공개 미리보기
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              실제 공개 없이도 어떤 페이지가 준비될지 떠올릴 수 있도록 핵심 정보만 먼저 보여줘요.
            </ListHeader.DescriptionParagraph>
          }
        />

        <div className="publish-preview">
          <div className="publish-preview-card">
            {draft.coverPhoto != null ? (
              <figure className="publish-cover">
                <img src={draft.coverPhoto.previewUrl} alt={`${draft.title} 대표 사진`} loading="lazy" />
              </figure>
            ) : null}

            <div className="publish-meta">
              <span className="path-chip">{draft.previewPath}</span>
              <h3>{draft.title}</h3>
              <p>{draft.subtitle}</p>
            </div>
          </div>

          <p className="section-note">
            실제 링크 생성이나 외부 이동은 연결하지 않았고, 공개 직전의 설득 흐름만 더미로 구성했어요.
          </p>
        </div>
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              이 화면에서 설득하는 포인트
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              공개 결정을 쉽게 만들되, 다음 행동이 과장되거나 강요처럼 보이지 않게 카피를 정리했어요.
            </ListHeader.DescriptionParagraph>
          }
        />

        <List>
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                공유
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="링크로 보여주기 쉬워요"
                bottom="사진 묶음이 정리된 상태라서 타인에게 설명하지 않아도 흐름이 전달돼요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                발견
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="웹에서 발견되기 쉬워요"
                bottom="결과를 하나의 페이지로 만드는 상상을 돕는 문구와 미리보기를 같이 보여줘요."
              />
            }
          />
          <ListRow
            left={
              <ListRow.AssetText shape="squircle" size="medium">
                선택
              </ListRow.AssetText>
            }
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="나중에 할 선택지도 남겨요"
                bottom="지금 공개하지 않아도 된다는 대안을 같이 보여줘서 부담을 줄였어요."
              />
            }
          />
        </List>

        <div className="summary-panel">
          <div className="inline-actions">
            <Button display="full" size="large" variant="weak" onClick={onBackToTimeline}>
              나중에 할게요
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
