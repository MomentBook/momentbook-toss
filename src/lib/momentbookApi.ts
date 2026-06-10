import { serverConfig } from './environment'

export type TossAuthorizationPayload = {
  authorizationCode: string
  referrer: string
}

export type TossAuthSession = {
  accessToken: string
  userId: string | null
}

type ApiEnvelope = {
  data?: unknown
  message?: unknown
  error?: unknown
}

export async function authenticateWithTossAuthorization(
  payload: TossAuthorizationPayload,
): Promise<TossAuthSession> {
  const response = await fetch(`${serverConfig.apiBaseUrl}/v2/auth/toss`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const responseBody = await readApiEnvelope(response)

  if (!response.ok) {
    throw new Error(resolveApiErrorMessage(responseBody, 'Toss 로그인에 실패했어요.'))
  }

  const data = isRecord(responseBody.data) ? responseBody.data : null
  const accessToken = data != null ? getStringField(data, 'accessToken') : null
  const user = data != null && isRecord(data.user) ? data.user : null

  if (accessToken == null) {
    throw new Error('Toss 로그인을 완료했지만 세션 응답을 확인하지 못했어요.')
  }

  return {
    accessToken,
    userId: user != null ? getStringField(user, 'id') : null,
  }
}

async function readApiEnvelope(response: Response): Promise<ApiEnvelope> {
  const contentType = response.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    return {}
  }

  const body = await response.json()

  return isRecord(body) ? body : {}
}

function resolveApiErrorMessage(responseBody: ApiEnvelope, fallbackMessage: string) {
  const message =
    typeof responseBody.message === 'string'
      ? responseBody.message
      : typeof responseBody.error === 'string'
        ? responseBody.error
        : null

  return message != null && message.trim().length > 0 ? message : fallbackMessage
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null
}

function getStringField(source: Record<string, unknown>, key: string) {
  const value = source[key]

  return typeof value === 'string' && value.trim().length > 0 ? value : null
}
