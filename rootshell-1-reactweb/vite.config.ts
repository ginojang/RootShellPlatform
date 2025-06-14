import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // ← Netlify나 자체서버면 이 설정 해줘야 dist 내 상대경로 문제 안 생김
  plugins: [react()],
})
