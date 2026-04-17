import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'MomentBook',
  brand: {
    displayName: 'MomentBook',
    primaryColor: '#81C784',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
