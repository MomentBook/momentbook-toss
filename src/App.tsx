import { startTransition, useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import './App.css'
import {
  getRuntimeSnapshot,
  persistLaunchMarker,
  triggerSuccessHaptic,
  type RuntimeActionResult,
  type RuntimeSnapshot,
} from './lib/appsInToss'

type FeedbackTone = 'neutral' | 'success' | 'error'

type FeedbackState = {
  tone: FeedbackTone
  message: string
}

const environmentCopy = {
  browser: {
    badge: 'Browser Preview',
    title: '로컬 브라우저 미리보기',
    description: '브리지 없이 UI와 구조를 먼저 점검하는 상태입니다.',
  },
  sandbox: {
    badge: 'Sandbox',
    title: '샌드박스 런타임',
    description: '개발용 토스 앱에서 공식 브리지와 WebView 설정이 연결된 상태입니다.',
  },
  toss: {
    badge: 'Toss App',
    title: '토스 앱 런타임',
    description: '실제 토스 앱 안에서 미니앱 브리지가 활성화된 상태입니다.',
  },
} as const

const defaultFeedback: FeedbackState = {
  tone: 'neutral',
  message: '앱인토스 브리지 상태를 읽는 중입니다.',
}

function App() {
  const [runtime, setRuntime] = useState<RuntimeSnapshot | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackState>(defaultFeedback)

  useEffect(() => {
    void refreshRuntime({
      setRuntime,
      setIsRefreshing,
      feedbackMessage: '앱인토스 런타임 스냅샷을 불러왔습니다.',
      setFeedback,
    })
  }, [])

  const snapshot = runtime
  const context = environmentCopy[snapshot?.environment ?? 'browser']

  const handleAction = async (action: () => Promise<RuntimeActionResult>) => {
    const result = await action()

    setFeedback({
      tone: result.ok ? 'success' : 'error',
      message: result.message,
    })

    await refreshRuntime({ setRuntime, setIsRefreshing })
  }

  return (
    <main className="app-shell">
      <div className="device-shell">
        <div className="status-bar">
          <span>12:00</span>
          <div className="status-icons" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Apps in Toss WebView</p>
            <div className="hero-heading">
              <h1>Momentbook</h1>
              <span className="environment-pill">{context.badge}</span>
            </div>
            <p className="hero-description">{context.description}</p>
          </div>

          <div className="balance-card">
            <p className="balance-label">앱 상태</p>
            <strong>{context.title}</strong>
            <span className="balance-caption">
              {snapshot?.bridgeStatus === 'connected'
                ? '공식 브리지 연결 확인'
                : '브리지 없는 브라우저 시뮬레이션'}
            </span>
          </div>
        </section>

        <section className="section-card feedback-card" data-tone={feedback.tone}>
          <div>
            <p className="section-kicker">실행 피드백</p>
            <strong>{feedback.message}</strong>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() =>
              void refreshRuntime({
                setRuntime,
                setIsRefreshing,
                feedbackMessage: '런타임 스냅샷을 새로 읽었습니다.',
                setFeedback,
              })
            }
          >
            {isRefreshing ? '새로 읽는 중' : '새로고침'}
          </button>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">런타임 계약</p>
              <h2>브리지 상태</h2>
            </div>
            <span className="section-badge">{snapshot?.environment ?? 'loading'}</span>
          </div>

          <div className="info-grid">
            <InfoTile label="브랜드" value={snapshot?.brandDisplayName ?? 'Momentbook'} />
            <InfoTile label="배포 ID" value={snapshot?.deploymentId ?? '브라우저 미리보기'} />
            <InfoTile label="토스 앱 버전" value={snapshot?.tossAppVersion ?? '브리지 없음'} />
            <InfoTile label="로케일" value={snapshot?.locale ?? '브리지 없음'} />
            <InfoTile label="기기 ID" value={snapshot?.deviceId ?? '브리지 없음'} />
            <InfoTile label="네트워크" value={snapshot?.networkStatus ?? '브리지 없음'} />
          </div>

          <dl className="detail-list">
            <DetailRow label="scheme URI" value={snapshot?.schemeUri ?? '브라우저에서는 확인 불가'} />
            <DetailRow
              label="Storage 저장 마커"
              value={snapshot?.lastLaunchMarker ?? '아직 저장된 마커 없음'}
            />
          </dl>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">SDK 액션</p>
              <h2>실행 테스트</h2>
            </div>
          </div>

          <div className="action-grid">
            <ActionButton
              title="햅틱 호출"
              description="`generateHapticFeedback`로 성공 햅틱을 요청합니다."
              onClick={() => void handleAction(triggerSuccessHaptic)}
            />
            <ActionButton
              title="Storage 저장"
              description="브리지 저장소에 마지막 실행 시각을 기록합니다."
              onClick={() => void handleAction(persistLaunchMarker)}
            />
          </div>
        </section>

        <section className="section-card">
          <div className="section-header">
            <div>
              <p className="section-kicker">구현 체크</p>
              <h2>현재 패치 범위</h2>
            </div>
          </div>

          <div className="checklist">
            <ChecklistItem text="`granite.config.ts`로 앱 이름, 브랜드, WebView 계약을 명시했습니다." />
            <ChecklistItem text="브라우저, 샌드박스, 토스 앱 런타임을 한 UI에서 구분해 표시합니다." />
            <ChecklistItem text="브리지 API 호출은 얇은 래퍼로 감싸 로컬 브라우저와 앱 런타임을 같은 계약으로 다룹니다." />
            <ChecklistItem text="스타터 템플릿을 제거하고 모바일 우선 레이아웃으로 재구성했습니다." />
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <article className="info-tile">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ActionButton({
  title,
  description,
  onClick,
}: {
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button className="action-button" type="button" onClick={onClick}>
      <strong>{title}</strong>
      <span>{description}</span>
    </button>
  )
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="checklist-item">
      <span className="checklist-mark" aria-hidden="true">
        •
      </span>
      <p>{text}</p>
    </div>
  )
}

async function refreshRuntime({
  setRuntime,
  setIsRefreshing,
  setFeedback,
  feedbackMessage,
}: {
  setRuntime: Dispatch<SetStateAction<RuntimeSnapshot | null>>
  setIsRefreshing: Dispatch<SetStateAction<boolean>>
  setFeedback?: Dispatch<SetStateAction<FeedbackState>>
  feedbackMessage?: string
}) {
  setIsRefreshing(true)
  const snapshot = await getRuntimeSnapshot()

  startTransition(() => {
    setRuntime(snapshot)
    setIsRefreshing(false)

    if (setFeedback != null && feedbackMessage != null) {
      setFeedback({
        tone: 'neutral',
        message: feedbackMessage,
      })
    }
  })
}

export default App
