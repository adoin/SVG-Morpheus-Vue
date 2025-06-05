import { createApp } from 'vue'
import App from './App.vue'
import SvgMorphlingVue, { SvgMorphling, createSvgMapFromFolder } from 'svg-morpheus-vue'

// 引入样式
import './styles/main.scss'

const app = createApp(App)

// 全局注册 SVG 图标集合
async function initSvgIcons() {
  try {
    // 使用 Vite 的 import.meta.glob 加载 assets/svg 文件夹
    const svgModules = (import.meta as any).glob('./assets/svg/*.svg', { 
      query: '?raw', 
      import: 'default' 
    })
    const assetSvgs = await createSvgMapFromFolder(svgModules)
    try {
      await SvgMorphling.registry({
        sources: [
          // 方式1: 从文件夹加载的 SVG（使用辅助函数预处理）
          assetSvgs,
          
          // 方式2: 单个 SVG 文件
          // './assets/icons/special.svg',
          
          // 方式3: 直接传入 SVG 映射（基础图标集合）
          {
            home: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>`,
            user: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>`,
            settings: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>`,
            search: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>`,
            heart: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
            </svg>`,
            star: `<svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
            </svg>`
          }
        ],
        customAttributes: {
          viewBox: '0 0 24 24',
          class: 'global-svg-icons'
        }
      })
    } catch (registryError) {
      console.error('❌ SvgMorphling.registry 调用失败:', registryError)
      throw registryError
    }
    
  } catch (error) {
    console.error('❌ 全局 SVG 图标注册失败:', error)
  }
}

// 初始化图标然后挂载应用
initSvgIcons().then(() => {
  // 注册 SVG Morphling 组件库
  app.use(SvgMorphlingVue)
  app.mount('#app')
}).catch((error) => {
  console.error('应用初始化失败:', error)
  // 即使图标注册失败，也要挂载应用
  app.use(SvgMorphlingVue)
  app.mount('#app')
})

// 导出全局注册方法，供其他地方使用
export { SvgMorphling } 