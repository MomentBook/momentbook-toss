import { ListHeader, Loader, Top } from '@toss/tds-mobile'
import { organizingSteps } from '../lib/momentbook'

type OrganizingScreenProps = {
  activeStepIndex: number
  totalPhotos: number
}

export function OrganizingScreen({ activeStepIndex, totalPhotos }: OrganizingScreenProps) {
  const activeStep = organizingSteps[activeStepIndex] ?? organizingSteps[0]

  return (
    <>
      <section className="surface-card hero-card">
        <Top
          upper={
            <div className="top-badge-row">
              <span className="top-badge top-badge--brand">자동 정리</span>
              <span className="top-badge">{totalPhotos}장 처리 중</span>
            </div>
          }
          title={<Top.TitleParagraph>사진을 여정 흐름으로 정리하고 있어요</Top.TitleParagraph>}
          subtitleBottom={
            <Top.SubtitleParagraph>
              촬영 순서와 비슷한 장면을 기준으로 공개하기 좋은 타임라인을 준비하는 중이에요.
            </Top.SubtitleParagraph>
          }
        />
      </section>

      <section className="surface-card">
        <div className="loader-panel" aria-live="polite">
          <Loader label={activeStep.title} size="large" type="primary" />
          <p className="support-copy">{activeStep.description}</p>
        </div>
      </section>

      <section className="surface-card">
        <ListHeader
          title={
            <ListHeader.TitleParagraph typography="t5" fontWeight="bold">
              정리 중인 단계
            </ListHeader.TitleParagraph>
          }
          description={
            <ListHeader.DescriptionParagraph>
              토스 앱 안에서는 한 번에 하나의 상태만 또렷하게 보이도록 단계형 화면으로 구성했어요.
            </ListHeader.DescriptionParagraph>
          }
        />

        <div className="progress-list">
          {organizingSteps.map((step, index) => {
            const statusClass =
              index < activeStepIndex
                ? 'progress-item is-complete'
                : index === activeStepIndex
                  ? 'progress-item is-active'
                  : 'progress-item'

            return (
              <div className={statusClass} key={step.id}>
                <span className="status-dot" aria-hidden="true" />
                <div className="progress-copy">
                  <strong>{step.title}</strong>
                  <span>{step.description}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
