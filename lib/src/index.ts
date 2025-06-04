import { App } from 'vue'
import SvgMorpheus from './components/SvgMorpheus.vue'

// 导出组件
export { SvgMorpheus }

// 导出类型
export * from './types/type'

// 导出工具函数
export * from './utils/svgLoader'

// Vue 插件安装函数
export default {
  install(app: App) {
    app.component('SvgMorpheus', SvgMorpheus)
  }
}

// 导出样式
import './styles/index.scss' 