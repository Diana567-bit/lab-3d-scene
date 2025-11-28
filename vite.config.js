import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,      // 固定端口
    strictPort: true // 如果端口被占用则报错而不是自动切换
  },
  // Gitee Pages: 设置为仓库名（部署时需要与 Gitee 仓库名一致）
  // 例如仓库名是 lab-3d-scene，则 base: '/lab-3d-scene/'
  base: '/lab-3d-scene/'
})
