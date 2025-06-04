# 🎨 SVG Morpheus Vue

基于 [SVG-Morpheus-ts](https://adoin.github.io/SVG-Morpheus-ts/) 的 Vue3 组件库，提供流畅的 SVG 图标变形动画效果。

## ✨ 特性

- 🚀 **基于 Vue 3 + TypeScript** - 完全的类型安全
- 🎯 **简单易用** - 只需传入 `value` 即可切换图标
- 🎨 **动画丰富** - 支持多种缓动函数和旋转效果
- 📦 **开箱即用** - 内置常用图标集合
- 🔧 **高度可配置** - 支持自定义 SVG 映射和属性
- 📱 **响应式设计** - 支持各种尺寸和主题

## 🚀 快速开始

### 安装

使用 pnpm（推荐）：

```bash
pnpm install
```

### 开发

启动开发服务器：

```bash
pnpm dev
```

构建组件库：

```bash
pnpm build
```

构建示例应用：

```bash
pnpm build:app
```

## 📖 使用指南

### 基础用法

```vue
<template>
  <div>
    <SvgMorpheus :value="currentIcon" :svg-map="iconMap" />
    <button @click="switchIcon">切换图标</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorpheus, iconSets } from '@svg-morpheus-vue/lib'

const currentIcon = ref('circle')
const iconMap = iconSets.basic

const switchIcon = () => {
  const icons = Object.keys(iconMap)
  const currentIndex = icons.indexOf(currentIcon.value)
  const nextIndex = (currentIndex + 1) % icons.length
  currentIcon.value = icons[nextIndex]
}
</script>
```

### 高级配置

```vue
<template>
  <SvgMorpheus 
    :value="icon"
    :svg-map="customIcons"
    :duration="800"
    easing="elastic-in-out"
    rotation="clock"
    :custom-attributes="{ viewBox: '0 0 32 32' }"
    class="my-icon"
    @animation-start="onStart"
    @animation-end="onEnd"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorpheus } from '@svg-morpheus-vue/lib'

const icon = ref('play')

const customIcons = {
  play: \`<svg viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>\`,
  pause: \`<svg viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>\`
}

const onStart = (iconName: string) => {
  console.log('动画开始:', iconName)
}

const onEnd = (iconName: string) => {
  console.log('动画结束:', iconName)
}
</script>
```

### 使用文件路径

```vue
<template>
  <SvgMorpheus 
    :value="icon"
    :svg-map="fileBasedIcons"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorpheus } from '@svg-morpheus-vue/lib'

const icon = ref('home')

// 基于文件路径的图标映射
const fileBasedIcons = {
  home: '/icons/home.svg',
  user: '/icons/user.svg',
  settings: '/icons/settings.svg'
}
</script>
```

## 🔧 API 参考

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `value` | `string` | `''` | 当前显示的图标名称 |
| `svgMap` | `Record<string, string> \| string` | `undefined` | SVG 图标映射或文件夹路径 |
| `duration` | `number` | `600` | 动画持续时间（毫秒） |
| `easing` | `string` | `'quad-in-out'` | 缓动函数 |
| `rotation` | `'none' \| 'clock' \| 'counterclock' \| 'random'` | `'none'` | 旋转方向 |
| `customAttributes` | `Record<string, string>` | `{}` | 自定义 SVG 属性 |
| `class` | `string` | `''` | 容器 CSS 类名 |
| `style` | `string \| Record<string, string>` | `{}` | 容器样式 |
| `defaultIcon` | `string` | `''` | 默认图标 |

### Events

| 事件 | 参数 | 描述 |
|------|------|------|
| `animation-start` | `(iconName: string)` | 动画开始时触发 |
| `animation-end` | `(iconName: string)` | 动画结束时触发 |
| `change` | `(iconName: string)` | 图标切换时触发 |

### 内置图标集

```typescript
import { iconSets } from '@svg-morpheus-vue/lib'

// 基础图标
iconSets.basic // { circle, square, triangle, star, heart }

// 箭头图标
iconSets.arrows // { arrow-up, arrow-down, arrow-left, arrow-right }
```

### 缓动函数选项

- `quad-in-out` (默认)
- `cubic-in-out`
- `quart-in-out`
- `quint-in-out`
- `sine-in-out`
- `expo-in-out`
- `circ-in-out`
- `back-in-out`
- `elastic-in-out`
- `bounce-in-out`

## 🎨 样式自定义

### CSS 变量

```css
:root {
  --svg-morpheus-color: currentColor;
  --svg-morpheus-size: 24px;
  --svg-morpheus-loading-color: #666;
}
```

### 预定义尺寸类

```vue
<template>
  <!-- 小尺寸 (16x16) -->
  <SvgMorpheus :value="icon" class="svg-morpheus-small" />
  
  <!-- 默认尺寸 (24x24) -->
  <SvgMorpheus :value="icon" />
  
  <!-- 大尺寸 (48x48) -->
  <SvgMorpheus :value="icon" class="svg-morpheus-large" />
</template>
```

### 主题类

```vue
<template>
  <!-- 主色主题 -->
  <SvgMorpheus :value="icon" class="svg-morpheus-primary" />
  
  <!-- 成功主题 -->
  <SvgMorpheus :value="icon" class="svg-morpheus-success" />
  
  <!-- 警告主题 -->
  <SvgMorpheus :value="icon" class="svg-morpheus-warning" />
  
  <!-- 危险主题 -->
  <SvgMorpheus :value="icon" class="svg-morpheus-danger" />
</template>
```

## 🛠️ 工具函数

### loadSvgFiles

批量加载 SVG 文件：

```typescript
import { loadSvgFiles } from '@svg-morpheus-vue/lib'

const fileMap = {
  home: '/icons/home.svg',
  user: '/icons/user.svg'
}

const svgMap = await loadSvgFiles(fileMap)
```

### createSvgFileMap

从文件夹路径创建文件映射：

```typescript
import { createSvgFileMap } from '@svg-morpheus-vue/lib'

const fileMap = createSvgFileMap('/icons', [
  'home.svg',
  'user.svg',
  'settings.svg'
])
```

## 📂 项目结构

```
SVG-Morpheus-Vue/
├── app/                 # 示例应用
│   ├── src/
│   │   ├── App.vue     # 主要示例
│   │   └── main.ts     # 应用入口
│   └── package.json
├── lib/                 # 组件库
│   ├── src/
│   │   ├── components/  # Vue 组件
│   │   ├── types/       # TypeScript 类型
│   │   ├── utils/       # 工具函数
│   │   ├── styles/      # 样式文件
│   │   └── index.ts     # 库入口
│   └── package.json
├── package.json         # 根配置
└── pnpm-workspace.yaml  # pnpm 工作空间配置
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [SVG-Morpheus-ts](https://adoin.github.io/SVG-Morpheus-ts/) - 底层 TypeScript 库
- [Vue 3](https://vuejs.org/) - Vue.js 框架
- [TypeScript](https://www.typescriptlang.org/) - TypeScript 语言
- [Vite](https://vitejs.dev/) - 构建工具
