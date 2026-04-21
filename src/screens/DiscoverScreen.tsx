import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { featuredJourneys } from '../lib/featuredJourneys'

type DiscoverScreenProps = {
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ onOpenJourney }: DiscoverScreenProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isLooping = featuredJourneys.length > 2
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    loop: isLooping,
  })

  useEffect(() => {
    if (emblaApi == null) {
      return
    }

    const syncActiveIndex = () => {
      setActiveIndex(emblaApi.selectedScrollSnap())
    }

    syncActiveIndex()
    emblaApi.on('select', syncActiveIndex)
    emblaApi.on('reInit', syncActiveIndex)

    return () => {
      emblaApi.off('select', syncActiveIndex)
      emblaApi.off('reInit', syncActiveIndex)
    }
  }, [emblaApi])

  const handleSelectSlide = (index: number) => {
    emblaApi?.scrollTo(index)
    setActiveIndex(index)
  }

  return (
    <section className="discover-simple">
      <div className="discover-simple__header">
        <div>
          <h2 className="discover-simple__title">다른 사람의 여정</h2>
        </div>
      </div>

      <div className="discover-simple__carousel">
        <div
          ref={emblaRef}
          aria-label="다른 사람의 여정 슬라이드"
          className="discover-simple__viewport"
        >
          <div className="discover-simple__list">
            {featuredJourneys.map((journey, index) => (
              <div
                key={journey.id}
                className={`discover-simple__slide discover-simple__slide--${getSlideState(index, activeIndex, featuredJourneys.length, isLooping)}`}
              >
                <button
                  className={`discover-simple__item${index === activeIndex ? ' discover-simple__item--active' : ''}`}
                  type="button"
                  onClick={() => onOpenJourney(journey.id)}
                >
                  <div className="discover-simple__item-hero">
                    <span className="discover-simple__item-kicker">
                      여정 {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="discover-simple__item-copy">
                      <h3>{journey.title}</h3>
                      <p className="discover-simple__item-tone">{journey.tone}</p>
                    </div>
                  </div>

                  <div className="discover-simple__item-body">
                    <p className="discover-simple__item-summary">{journey.summary}</p>

                    <div className="discover-simple__item-footer">
                      <p className="discover-simple__item-meta">
                        {journey.location} · {journey.duration}
                      </p>
                      <span className="discover-simple__item-action">자세히 보기</span>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div aria-label="여정 페이지 선택" className="discover-simple__pagination">
        {featuredJourneys.map((journey, index) => (
          <button
            key={journey.id}
            aria-label={`${index + 1}번째 여정 보기: ${journey.title}`}
            aria-pressed={index === activeIndex}
            className={`discover-simple__dot${index === activeIndex ? ' discover-simple__dot--active' : ''}`}
            type="button"
            onClick={() => handleSelectSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

function getSlideState(index: number, activeIndex: number, total: number, isLooping: boolean) {
  if (index === activeIndex || total <= 1) {
    return 'active'
  }

  const previousIndex = isLooping ? (activeIndex - 1 + total) % total : activeIndex - 1
  const nextIndex = isLooping ? (activeIndex + 1) % total : activeIndex + 1

  if (index === previousIndex) {
    return 'previous'
  }

  if (index === nextIndex) {
    return 'next'
  }

  return 'rest'
}
