import { defineConfig } from '@apps-in-toss/web-framework/config'

export default defineConfig({
  appName: 'momentbook-toss',
  brand: {
    displayName: 'Momentbook',
    primaryColor: '#0064FF',
    icon: '/momentbook-icon.svg',
  },
  permissions: [{ name: 'photos', access: 'read' }],
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  web: {
    port: 5173,
    commands: {
      dev: 'npm run dev:host',
      build: 'npm run build:web',
    },
  },
  webViewProps: {
    type: 'partner',
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
  },
  outdir: 'dist',
})
