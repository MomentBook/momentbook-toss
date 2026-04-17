import { Loader, Top } from '@toss/tds-mobile'
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
              <span className="top-badge top-badge--brand">정리 중</span>
              <span className="top-badge">
                {activeStepIndex + 1}/{organizingSteps.length}
              </span>
            </div>
          }
          title={<Top.TitleParagraph>사진을 정리하고 있어요</Top.TitleParagraph>}
          subtitleBottom={<Top.SubtitleParagraph>{activeStep.description}</Top.SubtitleParagraph>}
        />
      </section>

      <section className="surface-card">
        <div className="loader-panel" aria-live="polite">
          <Loader label={activeStep.title} size="large" type="primary" />
          <p className="support-copy">{totalPhotos}장</p>
        </div>
      </section>
    </>
  )
}
