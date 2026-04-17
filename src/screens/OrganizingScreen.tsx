import { Loader } from '@toss/tds-mobile'
import { organizingSteps } from '../lib/momentbook'

type OrganizingScreenProps = {
  activeStepIndex: number
  totalPhotos: number
}

export function OrganizingScreen({ activeStepIndex, totalPhotos }: OrganizingScreenProps) {
  const activeStep = organizingSteps[activeStepIndex] ?? organizingSteps[0]
  const progress = ((activeStepIndex + 1) / organizingSteps.length) * 100

  return (
    <>
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">자동 정리 진행 중</span>
          <h2 className="hero-card__title">사진을 모먼트 단위로 묶고 있어요.</h2>
          <p className="hero-card__description">
            {totalPhotos}장의 사진을 시간과 분위기에 맞게 정리하고 있어요. 잠시만 기다려 주세요.
          </p>

          <div className="progress-summary">
            <strong>
              {activeStepIndex + 1} / {organizingSteps.length}
            </strong>
            <span>{activeStep.title}</span>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className="panel-card panel-card--muted">
        <div className="processing-layout" aria-live="polite">
          <div className="processing-loader">
            <Loader label={activeStep.title} size="large" type="primary" />
            <p className="helper-copy">{activeStep.description}</p>
          </div>

          <div className="processing-steps">
            {organizingSteps.map((step, index) => (
              <article
                className={`processing-step ${index === activeStepIndex ? 'processing-step--active' : ''}`}
                key={step.id}
              >
                <span className="processing-step__index">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
