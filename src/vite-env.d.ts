/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOMENTBOOK_APP_ENV: 'development' | 'production'
  readonly VITE_MOMENTBOOK_API_BASE_URL: string
  readonly VITE_MOMENTBOOK_WEB_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
