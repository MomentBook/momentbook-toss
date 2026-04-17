import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devPort = 5173

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: devPort,
    strictPort: true,
  },
  preview: {
    host: true,
    port: devPort,
    strictPort: true,
  },
})
