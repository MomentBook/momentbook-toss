export type AppEnvironment = 'development' | 'production'

export type ServerConfig = {
  appEnvironment: AppEnvironment
  apiBaseUrl: string
  webBaseUrl: string
}

const appEnvironment = resolveAppEnvironment(
  import.meta.env.VITE_MOMENTBOOK_APP_ENV,
  import.meta.env.MODE,
)

export const serverConfig: ServerConfig = Object.freeze({
  appEnvironment,
  apiBaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_MOMENTBOOK_API_BASE_URL,
    'VITE_MOMENTBOOK_API_BASE_URL',
    appEnvironment === 'production',
  ),
  webBaseUrl: normalizeBaseUrl(
    import.meta.env.VITE_MOMENTBOOK_WEB_BASE_URL,
    'VITE_MOMENTBOOK_WEB_BASE_URL',
    appEnvironment === 'production',
  ),
})

function resolveAppEnvironment(
  configuredEnvironment: string | undefined,
  viteMode: string,
): AppEnvironment {
  const normalizedEnvironment = configuredEnvironment?.trim()

  if (normalizedEnvironment === 'development' || normalizedEnvironment === 'production') {
    return normalizedEnvironment
  }

  return viteMode === 'production' ? 'production' : 'development'
}

function normalizeBaseUrl(
  rawValue: string | undefined,
  variableName: string,
  requireHttps: boolean,
) {
  const value = rawValue?.trim()

  if (!value) {
    throw new Error(`${variableName} is required.`)
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(value)
  } catch {
    throw new Error(`${variableName} must be a valid absolute URL.`)
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`${variableName} must use http or https.`)
  }

  if (requireHttps && parsedUrl.protocol !== 'https:') {
    throw new Error(`${variableName} must use https in production.`)
  }

  parsedUrl.hash = ''
  parsedUrl.search = ''

  return parsedUrl.toString().replace(/\/$/, '')
}
