import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': './src'
    }
  },
  optimizeDeps: {
    include: ['svg-morpheus-vue']
  },
  server: {
    port: 3000,
    open: true
  }
}) 