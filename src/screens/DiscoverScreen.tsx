import { useEffect, useRef, useState } from 'react'
import { featuredJourneys } from '../lib/featuredJourneys'

type DiscoverScreenProps = {
  onOpenJourney: (journeyId: string) => void
}

export function DiscoverScreen({ onOpenJourney }: DiscoverScreenProps) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const slideRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    const slides = slideRefs.current.filter(
      (slide): slide is HTMLButtonElement => slide != null,
    )

    if (track == null || slides.length === 0 || !('IntersectionObserver' in window)) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        if (visibleEntry == null) {
          return
        }

        const nextIndex = slides.findIndex((slide) => slide === visibleEntry.target)

        if (nextIndex >= 0) {
          setActiveIndex(nextIndex)
        }
      },
      {
        root: track,
        threshold: [0.6, 0.75, 0.9],
      },
    )

    slides.forEach((slide) => observer.observe(slide))

    return () => observer.disconnect()
  }, [])

  const handleSelectSlide = (index: number) => {
    const slide = slideRefs.current[index]

    if (slide == null) {
      return
    }

    slide.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    })
    setActiveIndex(index)
  }

  return (
    <section className="discover-simple">
      <div className="discover-simple__header">
        <div>
          <h2 className="discover-simple__title">다른 사람의 여정</h2>
        </div>
      </div>

      <div
        ref={trackRef}
        aria-label="다른 사람의 여정 슬라이드"
        className="discover-simple__list"
      >
        {featuredJourneys.map((journey, index) => (
          <button
            key={journey.id}
            ref={(element) => {
              slideRefs.current[index] = element
            }}
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
        ))}
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
