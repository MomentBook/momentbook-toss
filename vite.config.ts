import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devPort = 5173
const ignoredWatchPaths = [
  '**/.agents/**',
  '**/.codex/**',
  '**/.git/**',
  '**/.yarn/**',
  '**/dist/**',
  '**/docs/**',
  '**/node_modules/**',
]

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: devPort,
    strictPort: true,
    watch: {
      ignored: ignoredWatchPaths,
      // Remote dev hosts can have low shared inotify limits.
      usePolling: true,
    },
  },
  preview: {
    host: true,
    port: devPort,
    strictPort: true,
  },
})
