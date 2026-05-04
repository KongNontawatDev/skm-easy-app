import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiProxyTarget = env.VITE_DEV_API_PROXY || 'http://127.0.0.1:3000'

  return {
  resolve: {
    /** ลดโอกาส Invalid hook call กับ Radix/LIFF ที่ resolve React คนละชุดจาก chunk */
    dedupe: ['react', 'react-dom'],
  },
  server: {
    // hostname เท่านั้น (ไม่ใส่ https:// หรือ path) — นำหน้าด้วย "." = อนุญาตทุก subdomain
    allowedHosts: ['.ngrok-free.app', 'miniapp.line.me','effigial-inaccurately-heide.ngrok-free.dev'],
    proxy: {
      '/api': { target: apiProxyTarget, changeOrigin: true },
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    tailwindcss(),
    react(),
    tsconfigPaths(), // 👈 ต้องอยู่หลัง plugin อื่น
  ] as UserConfig['plugins'],
  }
})
