import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.stories.*', 'src/**/*.test.*']
    })
  ],
  resolve: {
    alias: {
      '@': './src'
    }
  },
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'SvgMorpheusVue',
      fileName: 'index',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['vue', 'svg-morpheus-ts'],
      output: {
        globals: {
          vue: 'Vue',
          'svg-morpheus-ts': 'SVGMorpheus'
        }
      }
    }
  },
}) 