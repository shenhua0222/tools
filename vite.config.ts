import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@src': '/src',
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
    },
  },
})
