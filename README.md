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

### 模式1：直接传入 SVG 映射

这种方式适合单个组件使用独立的图标集合：

```vue
<template>
  <div>
    <SvgMorphling :value="currentIcon" :svg-map="iconMap" />
    <button @click="switchIcon">切换图标</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorphling } from '@svg-morpheus-vue/lib'

const currentIcon = ref('circle')

// 直接定义 SVG 映射
const iconMap = {
  circle: `<svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
  </svg>`,
  square: `<svg viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" fill="currentColor"/>
  </svg>`,
  triangle: `<svg viewBox="0 0 24 24">
    <polygon points="12,2 22,20 2,20" fill="currentColor"/>
  </svg>`
}

const switchIcon = () => {
  const icons = Object.keys(iconMap)
  const currentIndex = icons.indexOf(currentIcon.value)
  const nextIndex = (currentIndex + 1) % icons.length
  currentIcon.value = icons[nextIndex]
}
</script>
```

### 模式2：全局注册 SVG 集合

这种方式适合在应用中全局共享图标集合：

#### 全局注册

在应用入口处注册全局图标集合：

```typescript
// main.ts
import { createApp } from 'vue'
import { SvgMorphling, createSvgMapFromFolder } from '@svg-morpheus-vue/lib'
import App from './App.vue'

async function initSvgIcons() {
  // 使用 Vite 的 import.meta.glob 加载文件夹
  const svgModules = (import.meta as any).glob('./assets/svg/*.svg', { 
    query: '?raw', 
    import: 'default' 
  })
  const assetSvgs = await createSvgMapFromFolder(svgModules)
  
  await SvgMorphling.registry({
    sources: [
      // 方式1: 从文件夹加载（使用辅助函数预处理）
      assetSvgs,
      
      // 方式2: 单个 SVG 文件（文件名自动作为 key）
      './assets/icons/logo.svg',
      
      // 方式3: 直接传入 SVG 映射对象
      {
        home: `<svg viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
        </svg>`,
        user: `<svg viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </svg>`
      }
    ],
    customAttributes: {
      viewBox: '0 0 24 24',
      class: 'global-icons'
    }
  })
}

// 初始化图标后挂载应用
initSvgIcons().then(() => {
  const app = createApp(App)
  app.mount('#app')
})
```

**数据源类型说明：**

1. **文件夹加载**（推荐）
   - 使用 `createSvgMapFromFolder` 辅助函数
   - 先用 `import.meta.glob` 加载，再传递给辅助函数处理
   - 文件名（去掉扩展名）自动作为图标 key

2. **单个文件路径**（以 `.svg` 结尾）
   - 示例：`'./assets/logo.svg'`
   - 文件名（去掉扩展名）作为图标 key

3. **SVG 映射对象**
   - 示例：`{ iconName: 'svgContent', ... }`
   - 直接定义图标名称和 SVG 内容

**为什么需要辅助函数？**

由于 Vite 的 `import.meta.glob` 要求使用字面量字符串，不能动态构建路径。所以需要在调用 `registry` 前使用辅助函数预处理文件夹内容。

**文件夹结构示例：**
```
src/
├── assets/
│   └── svg/
│       ├── home.svg     → 注册为 'home'
│       ├── user.svg     → 注册为 'user'
│       ├── settings.svg → 注册为 'settings'
│       └── search.svg   → 注册为 'search'
├── main.ts
└── App.vue
```

#### 使用全局图标

注册后，所有组件都可以直接使用全局图标，无需传入 `svg-map`：

```vue
<template>
  <div>
    <!-- 直接使用全局注册的图标 -->
    <SvgMorphling :value="currentIcon" />
    
    <div class="icon-controls">
      <button @click="currentIcon = 'home'">首页</button>
      <button @click="currentIcon = 'user'">用户</button>
      <button @click="currentIcon = 'settings'">设置</button>
      <button @click="currentIcon = 'search'">搜索</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorphling } from '@svg-morpheus-vue/lib'

const currentIcon = ref('home')
</script>
```

### 混合使用

也可以在同一个应用中混合使用两种模式：

```vue
<template>
  <div>
    <!-- 使用全局图标 -->
    <SvgMorphling :value="globalIcon" />
    
    <!-- 使用局部图标 -->
    <SvgMorphling :value="localIcon" :svg-map="localIcons" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SvgMorphling } from '@svg-morpheus-vue/lib'

const globalIcon = ref('home')  // 使用全局注册的图标
const localIcon = ref('play')   // 使用局部定义的图标

// 局部图标映射（优先级高于全局）
const localIcons = {
  play: `<svg viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
  </svg>`,
  pause: `<svg viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>`
}
</script>
```

## 🔧 API 参考

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `value` | `string` | `''` | 当前显示的图标名称 |
| `svgMap` | `Record<string, string>` | `undefined` | 直接传入的 SVG 图标映射对象 |
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

### 静态方法

#### SvgMorphling.registry(config)

全局注册 SVG 图标集合。

**参数：**

- `config: SvgRegistryConfig` - 注册配置对象

```typescript
interface SvgRegistryConfig {
  sources: SvgRegistrySource[]        // 数据源数组
  customAttributes?: Record<string, string>  // 自定义 SVG 属性
}

type SvgRegistrySource = 
  | Record<string, string>  // 直接的 SVG 映射
  | string                  // 文件路径（.svg 结尾）或文件夹路径（/ 结尾）
```

**示例：**

```typescript
await SvgMorphling.registry({
  sources: [
    // SVG 映射对象
    { home: '<svg>...</svg>', user: '<svg>...</svg>' },
    // 单个文件
    '/icons/settings.svg',
    // 文件夹（Vite 环境）
    '/icons/arrows/'
  ],
  customAttributes: {
    viewBox: '0 0 24 24',
    class: 'global-icons'
  }
})
```

#### SvgMorphling.getGlobalSvgMap()

获取当前全局注册的 SVG 映射对象。

**返回值：** `Record<string, string>`

#### SvgMorphling.getGlobalSvgBlobUrl()

获取当前全局 SVG 集合的 Blob URL。

**返回值：** `string`

### 内置图标集

> **注意：** 从 v2.0 开始，内置图标集已移除。请使用全局注册功能或直接传入 SVG 映射。

```typescript
// 旧版本（已废弃）
import { iconSets } from '@svg-morpheus-vue/lib'

// 新版本（推荐）
await SvgMorphling.registry({
  sources: [
    {
      circle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
      square: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="currentColor"/></svg>',
      // ...更多图标
    }
  ]
})
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
  <SvgMorphling :value="icon" class="svg-morpheus-small" />
  
  <!-- 默认尺寸 (24x24) -->
  <SvgMorphling :value="icon" />
  
  <!-- 大尺寸 (48x48) -->
  <SvgMorphling :value="icon" class="svg-morpheus-large" />
</template>
```

### 主题类

```vue
<template>
  <!-- 主色主题 -->
  <SvgMorphling :value="icon" class="svg-morpheus-primary" />
  
  <!-- 成功主题 -->
  <SvgMorphling :value="icon" class="svg-morpheus-success" />
  
  <!-- 警告主题 -->
  <SvgMorphling :value="icon" class="svg-morpheus-warning" />
  
  <!-- 危险主题 -->
  <SvgMorphling :value="icon" class="svg-morpheus-danger" />
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
