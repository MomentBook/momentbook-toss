import { Button, Loader, TextArea, TextField } from '@toss/tds-mobile'
import { type ChangeEvent } from 'react'
import { formatCount, formatSourceLabel, type JourneyDetails, type PhotoAsset } from '../lib/momentbook'

type JourneyBasicsScreenProps = {
  details: JourneyDetails
  isPickingPhotos: boolean
  photos: PhotoAsset[]
  selectionErrorMessage: string | null
  onChangeDetails: (details: JourneyDetails) => void
  onPickPhotos: () => void
}

export function JourneyBasicsScreen({
  details,
  isPickingPhotos,
  photos,
  selectionErrorMessage,
  onChangeDetails,
  onPickPhotos,
}: JourneyBasicsScreenProps) {
  const coverPhoto = photos.find((photo) => photo.id === details.coverPhotoId) ?? photos[0] ?? null
  const sourceLabel = photos[0] != null ? formatSourceLabel(photos[0].source) : null

  const handleJourneyTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeDetails({
      ...details,
      title: event.currentTarget.value,
    })
  }

  const handleJourneyDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDetails({
      ...details,
      description: event.currentTarget.value,
    })
  }

  const handleCoverPhotoChange = (coverPhotoId: string) => {
    onChangeDetails({
      ...details,
      coverPhotoId,
    })
  }

  return (
    <>
      <section className="hero-card journey-basics-hero">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">2/4 여정 정보</span>
          <h2 className="hero-card__title">여행의 이름을 가볍게 정해요</h2>
          <p className="hero-card__description">
            제목과 대표 사진만 먼저 고르고, 장면별 기록은 다음 단계에서 정리해요.
          </p>

          <div className="feature-chips">
            <span className="stat-pill">{formatCount(photos.length, '장')}</span>
            {sourceLabel != null ? <span className="feature-chip">{sourceLabel}</span> : null}
          </div>
        </div>
      </section>

      <section className="panel-card journey-basics-editor">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">기본 정보</p>
            <h3>제목과 분위기</h3>
          </div>
        </div>

        <div className="journey-editor-layout">
          <div className="journey-editor-form">
            <TextField
              label="여정 제목"
              labelOption="sustain"
              maxLength={60}
              placeholder="예: 제주에서 천천히 걸은 주말"
              value={details.title}
              variant="box"
              onChange={handleJourneyTitleChange}
            />

            <TextArea
              label="여정 설명"
              labelOption="sustain"
              maxLength={180}
              minHeight={96}
              placeholder="기억하고 싶은 분위기를 짧게 적어주세요."
              value={details.description}
              variant="box"
              onChange={handleJourneyDescriptionChange}
            />
          </div>

          {coverPhoto != null ? (
            <figure className="cover-preview">
              <img alt="선택한 대표 사진 미리보기" loading="lazy" src={coverPhoto.previewUrl} />
              <figcaption>대표 사진</figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      <section className="panel-card journey-basics-photos">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">대표 사진</p>
            <h3>처음 보일 사진</h3>
          </div>
        </div>

        <div className="cover-picker cover-picker--strip" aria-label="대표 사진 선택">
          {photos.slice(0, 10).map((photo, index) => {
            const isSelected = details.coverPhotoId === photo.id

            return (
              <button
                key={photo.id}
                aria-label={`대표 사진 ${index + 1} 선택`}
                aria-pressed={isSelected}
                className={`cover-picker__item${isSelected ? ' cover-picker__item--selected' : ''}`}
                type="button"
                onClick={() => handleCoverPhotoChange(photo.id)}
              >
                <img alt="" loading="lazy" src={photo.previewUrl} />
                <span>{isSelected ? '대표' : String(index + 1)}</span>
              </button>
            )
          })}
        </div>

        <div className="journey-basics-photo-actions">
          {isPickingPhotos ? (
            <div aria-live="polite" className="upload-feedback upload-feedback--loading" role="status">
              <Loader label="새 사진을 확인하는 중이에요." size="small" />
            </div>
          ) : null}

          {selectionErrorMessage != null ? (
            <div className="upload-feedback upload-feedback--error" role="alert">
              <div className="upload-feedback__copy">
                <strong>새 사진을 불러오지 못했어요</strong>
                <p>{selectionErrorMessage}</p>
              </div>
            </div>
          ) : null}

          <Button
            display="full"
            disabled={isPickingPhotos}
            size="large"
            variant="weak"
            onClick={onPickPhotos}
          >
            사진 다시 고르기
          </Button>
        </div>
      </section>
    </>
  )
}
