import { Button, TextArea, TextField } from '@toss/tds-mobile'
import { useRef, useState, type ChangeEvent, type PointerEvent } from 'react'
import {
  assignPhotosToJourneyMoment,
  formatCount,
  getUnassignedPhotos,
  removePhotoFromJourneyMoment,
  updateJourneyMomentDetails,
  type JourneyDetails,
  type JourneyMoment,
  type PhotoAsset,
} from '../lib/momentbook'

type OrganizingScreenProps = {
  details: JourneyDetails
  photos: PhotoAsset[]
  moments: JourneyMoment[]
  onChangeDetails: (details: JourneyDetails) => void
  onChangeMoments: (moments: JourneyMoment[]) => void
}

type DragState = {
  overMomentId: string | null
  x: number
  y: number
}

export function OrganizingScreen({
  details,
  photos,
  moments,
  onChangeDetails,
  onChangeMoments,
}: OrganizingScreenProps) {
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [activeMomentId, setActiveMomentId] = useState(moments[0]?.id ?? '')
  const [dragState, setDragState] = useState<DragState | null>(null)
  const bucketRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const unassignedPhotos = getUnassignedPhotos(photos, moments)
  const availablePhotoIds = new Set(unassignedPhotos.map((photo) => photo.id))
  const selectedPhotoIdsInTray = selectedPhotoIds.filter((photoId) => availablePhotoIds.has(photoId))
  const resolvedActiveMomentId = moments.some((moment) => moment.id === activeMomentId)
    ? activeMomentId
    : moments[0]?.id ?? ''
  const activeMoment = moments.find((moment) => moment.id === resolvedActiveMomentId) ?? moments[0] ?? null
  const selectedCount = selectedPhotoIdsInTray.length
  const assignedPhotoCount = photos.length - unassignedPhotos.length
  const groupedPercent = photos.length === 0 ? 0 : Math.round((assignedPhotoCount / photos.length) * 100)
  const coverPhoto = photos.find((photo) => photo.id === details.coverPhotoId) ?? photos[0] ?? null

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

  const handleTogglePhoto = (photoId: string) => {
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((selectedPhotoId) => selectedPhotoId !== photoId)
        : [...current, photoId],
    )
  }

  const handleAssignSelectedPhotos = (momentId: string) => {
    if (selectedPhotoIdsInTray.length === 0) {
      return
    }

    onChangeMoments(assignPhotosToJourneyMoment(moments, photos, selectedPhotoIdsInTray, momentId))
    setActiveMomentId(momentId)
    setSelectedPhotoIds([])
  }

  const handleRemovePhoto = (momentId: string, photoId: string) => {
    onChangeMoments(removePhotoFromJourneyMoment(moments, momentId, photoId))
  }

  const handleMomentTitleChange = (momentId: string, title: string) => {
    onChangeMoments(updateJourneyMomentDetails(moments, momentId, { title }))
  }

  const handleMomentSummaryChange = (momentId: string, summary: string) => {
    onChangeMoments(updateJourneyMomentDetails(moments, momentId, { summary }))
  }

  const resolveDropMomentId = (x: number, y: number) => {
    for (const moment of moments) {
      const element = bucketRefs.current[moment.id]

      if (element == null) {
        continue
      }

      const bounds = element.getBoundingClientRect()

      if (x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom) {
        return moment.id
      }
    }

    return null
  }

  const handleDragStart = (event: PointerEvent<HTMLButtonElement>) => {
    if (selectedPhotoIdsInTray.length === 0) {
      return
    }

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragState({
      overMomentId: resolveDropMomentId(event.clientX, event.clientY),
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handleDragMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragState == null) {
      return
    }

    event.preventDefault()
    setDragState({
      overMomentId: resolveDropMomentId(event.clientX, event.clientY),
      x: event.clientX,
      y: event.clientY,
    })
  }

  const handleDragEnd = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    if (dragState == null) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const targetMomentId = cancelled ? null : dragState.overMomentId
    setDragState(null)

    if (targetMomentId != null) {
      handleAssignSelectedPhotos(targetMomentId)
    }
  }

  return (
    <>
      <section className="hero-card hero-card--organizing">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">비공개 구성</span>
          <h2 className="hero-card__title">여정의 흐름을 정리하세요</h2>
          <p className="hero-card__description">사진을 모먼트에 나누고 필요한 메모만 남겨요.</p>

          <div
            className="organizing-progress"
            aria-label={`전체 사진 ${photos.length}장 중 ${assignedPhotoCount}장을 모먼트에 담았어요`}
          >
            <div className="progress-summary">
              <span>모먼트에 담은 사진</span>
              <strong>{assignedPhotoCount}/{photos.length}장</strong>
            </div>
            <div className="progress-bar" aria-hidden="true">
              <span style={{ width: `${groupedPercent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="panel-card journey-editor-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">여정 정보</p>
            <h3>제목과 대표 사진</h3>
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
              placeholder="이 여정에서 기억하고 싶은 분위기를 짧게 적어주세요."
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

        <div className="cover-picker cover-picker--strip" aria-label="대표 사진 선택">
          {photos.slice(0, 8).map((photo, index) => {
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
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">모먼트</p>
            <h3>사진을 나눠 담기</h3>
          </div>

          <span className="stat-pill">{formatCount(unassignedPhotos.length, '장 남음')}</span>
        </div>

        <div aria-label="모먼트 목록" className="moment-bucket-row" role="tablist">
          {moments.map((moment, index) => {
            const isActive = moment.id === activeMomentId
            const isDropTarget = dragState?.overMomentId === moment.id

            return (
              <button
                key={moment.id}
                ref={(element) => {
                  bucketRefs.current[moment.id] = element
                }}
                aria-selected={isActive}
                className={`moment-bucket${isActive ? ' moment-bucket--active' : ''}${isDropTarget ? ' moment-bucket--drop-target' : ''}`}
                role="tab"
                type="button"
                onClick={() => setActiveMomentId(moment.id)}
              >
                <span className="moment-bucket__eyebrow">모먼트 {index + 1}</span>

                {moment.photos.length > 0 ? (
                  <div className="moment-bucket__preview-stack" aria-hidden="true">
                    {moment.photos.slice(0, 3).map((photo, photoIndex) => (
                      <span
                        className="moment-bucket__preview"
                        key={`${moment.id}-${photo.id}`}
                        style={{ zIndex: 3 - photoIndex }}
                      >
                        <img alt="" loading="lazy" src={photo.previewUrl} />
                      </span>
                    ))}
                  </div>
                ) : (
                  <div aria-hidden="true" className="moment-bucket__empty">
                    +
                  </div>
                )}

                <div className="moment-bucket__meta">
                  <strong>{formatCount(moment.photos.length, '장')}</strong>
                  <span>{moment.photos.length === 0 ? '비어 있어요' : '담겨 있어요'}</span>
                </div>
              </button>
            )
          })}
        </div>

        {activeMoment != null ? (
          <article className="moment-detail-card">
            <div className="moment-detail-card__header">
              <div>
                <p className="section-heading__eyebrow">선택한 모먼트</p>
                <h3>{activeMoment.title}</h3>
              </div>
              <span className="feature-chip">{formatCount(activeMoment.photos.length, '장')}</span>
            </div>

            <p className="helper-copy">
              제목과 메모를 적고, 잘못 담은 사진은 다시 뺄 수 있어요.
            </p>

            <div className="moment-editor-form">
              <TextField
                label="모먼트 제목"
                labelOption="sustain"
                maxLength={48}
                placeholder="예: 바다가 처음 보이던 길"
                value={activeMoment.title}
                variant="box"
                onChange={(event) => handleMomentTitleChange(activeMoment.id, event.currentTarget.value)}
              />

              <TextArea
                label="메모"
                labelOption="sustain"
                maxLength={160}
                minHeight={88}
                placeholder="이 장면을 설명할 한두 문장을 적어주세요."
                value={activeMoment.summary}
                variant="box"
                onChange={(event) => handleMomentSummaryChange(activeMoment.id, event.currentTarget.value)}
              />
            </div>

            {activeMoment.photos.length > 0 ? (
              <div className="moment-photo-grid moment-photo-grid--artifact" aria-label={`${activeMoment.title}에 담긴 사진`}>
                {activeMoment.photos.map((photo, index) => (
                  <figure
                    className={`moment-photo-card${index === 0 ? ' moment-photo-card--lead' : ''}`}
                    key={`${activeMoment.id}-${photo.id}`}
                  >
                    <img alt={`${activeMoment.title} 사진 ${index + 1}`} loading="lazy" src={photo.previewUrl} />
                    <button
                      aria-label={`${activeMoment.title}에서 사진 ${index + 1} 빼기`}
                      className="moment-photo-card__remove"
                      type="button"
                      onClick={() => handleRemovePhoto(activeMoment.id, photo.id)}
                    >
                      빼기
                    </button>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="moment-detail-card__empty">
                <strong>아직 담긴 사진이 없어요.</strong>
                <p>아래에서 사진을 선택해 이 모먼트에 담아보세요.</p>
              </div>
            )}
          </article>
        ) : null}
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">남은 사진</p>
            <h3>모먼트에 담을 사진</h3>
          </div>

          {selectedCount > 0 ? <span className="stat-pill">{formatCount(selectedCount, '장 선택')}</span> : null}
        </div>

        {unassignedPhotos.length > 0 ? (
          <div className="organizing-photo-grid" aria-label="남은 사진 목록">
            {unassignedPhotos.map((photo, index) => {
              const isSelected = selectedPhotoIdsInTray.includes(photo.id)

              return (
                <button
                  key={photo.id}
                  aria-pressed={isSelected}
                  className={`organizing-photo-tile${isSelected ? ' organizing-photo-tile--selected' : ''}`}
                  type="button"
                  onClick={() => handleTogglePhoto(photo.id)}
                >
                  <img alt={`남은 사진 ${index + 1}`} loading="lazy" src={photo.previewUrl} />
                  <span className="organizing-photo-tile__check" aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="organizing-complete-state">
            <strong>모든 사진을 모먼트에 담았어요.</strong>
            <p>이제 타임라인에서 흐름을 확인해 보세요.</p>
          </div>
        )}

        {selectedCount > 0 && activeMoment != null ? (
          <div className="selection-dock">
            <button
              aria-label={`선택한 사진 ${selectedCount}장을 끌어서 모먼트에 놓기`}
              className="selection-drag-pill"
              type="button"
              onPointerCancel={(event) => handleDragEnd(event, true)}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
            >
              <span className="selection-drag-pill__count">{formatCount(selectedCount, '장')}</span>
              <span>끌어서 모먼트에 놓기</span>
            </button>

            <div className="selection-dock__actions">
              <Button
                display="full"
                size="large"
                variant="weak"
                onClick={() => handleAssignSelectedPhotos(activeMoment.id)}
              >
                이 모먼트에 담기
              </Button>

              <button className="selection-dock__clear" type="button" onClick={() => setSelectedPhotoIds([])}>
                선택 해제
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {dragState != null ? (
        <div
          aria-hidden="true"
          className={`selection-drag-ghost${dragState.overMomentId != null ? ' selection-drag-ghost--ready' : ''}`}
          style={{
            left: dragState.x,
            top: dragState.y,
          }}
        >
          <span>{formatCount(selectedCount, '장')}</span>
          <strong>모먼트에 담기</strong>
        </div>
      ) : null}
    </>
  )
}
