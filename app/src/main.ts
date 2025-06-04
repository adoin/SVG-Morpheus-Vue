import { createApp } from 'vue'
import App from './App.vue'
import SvgMorpheusVue from '@svg-morpheus-vue/lib'

// 引入样式
import './styles/main.scss'

const app = createApp(App)

// 注册 SVG Morpheus 组件库
app.use(SvgMorpheusVue)

app.mount('#app') 