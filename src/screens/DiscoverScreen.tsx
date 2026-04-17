import { featuredJourneys } from '../lib/featuredJourneys'

type DiscoverScreenProps = {
  hasSelectedPhotos: boolean
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ hasSelectedPhotos, onOpenJourney }: DiscoverScreenProps) {
  return (
    <section className="hero-card discover-simple">
      <div className="hero-card__content discover-simple__intro">
        <span className="section-badge section-badge--primary">둘러보기</span>
        <h2 className="hero-card__title">어떤 결과가 나오는지 짧게 보고 바로 시작해 보세요.</h2>
        <p className="hero-card__description">
          샘플은 흐름만 보여주는 예시예요. 여정을 누르면 해당 화면으로 이동할 수 있어요.
        </p>
      </div>

      <div className="discover-simple__list" aria-label="샘플 여정 목록">
        {featuredJourneys.map((journey) => (
          <button
            className="discover-simple__item"
            key={journey.id}
            type="button"
            onClick={() => onOpenJourney(journey.id)}
          >
            <div className="discover-simple__item-copy">
              <p className="eyebrow">샘플 여정</p>
              <h3>{journey.title}</h3>
              <p>{journey.summary}</p>
            </div>

            <span className="discover-simple__item-action">자세히 보기</span>
          </button>
        ))}
      </div>

      <p className="helper-copy">
        {hasSelectedPhotos
          ? '이미 고른 사진이 있다면 아래 버튼으로 바로 이어서 정리할 수 있어요.'
          : '복잡한 설정 없이 사진만 고르면 바로 초안을 만들어드려요.'}
      </p>
    </section>
  )
}
