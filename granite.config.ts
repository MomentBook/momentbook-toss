import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'my-granite-app', // 앱인토스 콘솔에서 등록한 앱 이름으로 바꿔주세요.
  brand: {
    displayName: 'MomentBook', // 앱인토스 콘솔에 등록한 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#81C784', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: '', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});