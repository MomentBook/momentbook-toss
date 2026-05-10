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
      <section className="hero-card">
        <div className="hero-card__content">
          <span className="section-badge section-badge--primary">비공개 구성</span>
          <h2 className="hero-card__title">사진과 문장을 직접 골라 여정 초안을 만들어요.</h2>
          <p className="hero-card__description">
            앱인토스에서는 촬영 위치나 EXIF를 해석하지 않고, 내가 고른 사진과 메모만으로 모먼트를
            구성해요. 공개는 나중에 MomentBook 앱에서 이어갈 수 있도록 비공개 흐름으로 유지해요.
          </p>

          <div className="organizing-guide-grid">
            <article className="organizing-guide-card">
              <span className="organizing-guide-card__index">1</span>
              <div>
                <h3>여러 장 선택</h3>
                <p>아래 남은 사진에서 같은 장면으로 묶고 싶은 사진을 먼저 고르세요.</p>
              </div>
            </article>

            <article className="organizing-guide-card">
              <span className="organizing-guide-card__index">2</span>
              <div>
                <h3>드래그 또는 버튼</h3>
                <p>선택한 사진 스택을 순간에 끌어 놓거나 활성 순간에 바로 담을 수 있어요.</p>
              </div>
            </article>

            <article className="organizing-guide-card">
              <span className="organizing-guide-card__index">3</span>
              <div>
                <h3>빼고 다시 담기</h3>
                <p>잘못 담은 사진은 순간 카드에서 빼고 원하는 흐름으로 다시 정리할 수 있어요.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">여정 정보</p>
            <h3>네이티브 앱처럼 제목, 설명, 대표 사진을 먼저 잡아요</h3>
          </div>
        </div>

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

        <div className="cover-picker" aria-label="대표 사진 선택">
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
            <p className="section-heading__eyebrow">순간 버킷</p>
            <h3>위에서 흐름을 만들고 아래에서 사진을 채워요</h3>
          </div>

          <span className="stat-pill">{formatCount(unassignedPhotos.length, '장 남음')}</span>
        </div>

        <div aria-label="모먼트 버킷 목록" className="moment-bucket-row" role="tablist">
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
                <span className="moment-bucket__eyebrow">순간 {index + 1}</span>

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
                  <span>{moment.photos.length === 0 ? '아직 비어 있어요' : '사진이 담겨 있어요'}</span>
                </div>
              </button>
            )
          })}
        </div>

        {activeMoment != null ? (
          <article className="moment-detail-card">
            <div className="moment-detail-card__header">
              <div>
                <p className="section-heading__eyebrow">활성 순간</p>
                <h3>{activeMoment.title}</h3>
              </div>
              <span className="feature-chip">{formatCount(activeMoment.photos.length, '장')}</span>
            </div>

            <p className="helper-copy">
              모먼트 제목과 메모는 내가 직접 적어요. 잘못 담은 사진은 여기서 빼고 다시 고를 수 있어요.
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
                label="모먼트 메모"
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
              <div className="moment-photo-grid" aria-label={`${activeMoment.title}에 담긴 사진`}>
                {activeMoment.photos.map((photo, index) => (
                  <figure className="moment-photo-card" key={`${activeMoment.id}-${photo.id}`}>
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
                <p>선택한 사진을 끌어 놓거나 아래 버튼으로 이 순간에 바로 담아보세요.</p>
              </div>
            )}
          </article>
        ) : null}
      </section>

      <section className="panel-card">
        <div className="section-heading">
          <div>
            <p className="section-heading__eyebrow">남은 사진</p>
            <h3>아직 순간에 담기지 않은 사진이에요</h3>
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
            <strong>모든 사진을 순간에 담았어요.</strong>
            <p>이제 아래의 타임라인 미리보기 버튼으로 직접 만든 흐름을 확인해 보세요.</p>
          </div>
        )}

        {selectedCount > 0 && activeMoment != null ? (
          <div className="selection-dock">
            <button
              aria-label={`선택한 사진 ${selectedCount}장을 끌어서 순간에 놓기`}
              className="selection-drag-pill"
              type="button"
              onPointerCancel={(event) => handleDragEnd(event, true)}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
            >
              <span className="selection-drag-pill__count">{formatCount(selectedCount, '장')}</span>
              <span>끌어서 순간에 놓기</span>
            </button>

            <div className="selection-dock__actions">
              <Button
                display="full"
                size="large"
                variant="weak"
                onClick={() => handleAssignSelectedPhotos(activeMoment.id)}
              >
                선택한 사진 담기
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
          <strong>순간에 담기</strong>
        </div>
      ) : null}
    </>
  )
}
