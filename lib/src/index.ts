import { App } from 'vue'
import SvgMorphling from './components/SvgMorphling.vue'
import { registry, getGlobalSvgMap, getGlobalSvgBlobUrl, createSvgMapFromFolder } from './store/globalState'

// 为组件添加静态方法
Object.assign(SvgMorphling, {
  registry,
  getGlobalSvgMap,
  getGlobalSvgBlobUrl
})

// 导出组件
export { SvgMorphling }

// 导出全局状态获取函数和工具函数
export { getGlobalSvgMap, getGlobalSvgBlobUrl, createSvgMapFromFolder }

// 导出类型
export * from './types/type'

// 导出工具函数
export * from './utils/svgLoader'

// Vue 插件安装函数
export default {
  install(app: App) {
    app.component('SvgMorphling', SvgMorphling)
  }
} 