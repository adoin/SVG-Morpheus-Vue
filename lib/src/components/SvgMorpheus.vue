<template>
  <div
    ref="containerRef"
    :class="['svg-morpheus-container', props.class]"
    :style="containerStyle"
  >
    <object
      ref="objectRef"
      :data="svgBlobUrl"
      type="image/svg+xml"
      class="svg-morpheus-object"
      @load="onSvgLoad"
    />
    <div v-if="isLoading" class="svg-morpheus-loading">
      <slot name="loading">加载中...</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { SVGMorpheus, bundleSvgs } from 'svg-morpheus-ts'
import type { SvgMorpheusProps, SvgMorpheusEmits, SvgFileMap } from '../types/type'
import { loadSvgFiles, createSvgFileMap } from '../utils/svgLoader'

// 定义组件属性
const props = withDefaults(defineProps<SvgMorpheusProps>(), {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'none',
  defaultIcon: '',
  customAttributes: () => ({
    viewBox: '0 0 24 24',
    class: 'svg-morpheus-iconset'
  })
})

// 定义事件
const emit = defineEmits<SvgMorpheusEmits>()

// 响应式引用
const containerRef = ref<HTMLDivElement>()
const objectRef = ref<HTMLObjectElement>()
const svgBlobUrl = ref<string>('')
const isLoading = ref(false)
const morpheusInstance = ref<SVGMorpheus>()

// 计算属性
const containerStyle = computed(() => {
  if (typeof props.style === 'string') {
    return props.style
  }
  return props.style || {}
})

// 从文件夹路径动态加载 SVG 文件
const loadSvgFromFolder = async (folderPath: string): Promise<SvgFileMap> => {
  const svgMap: SvgFileMap = {}
  
  try {
    // 这里需要根据实际情况实现文件夹扫描
    // 由于浏览器环境限制，通常需要预定义文件列表或使用构建工具
    console.warn('从文件夹加载 SVG 需要在构建时预处理文件列表')
    
    // 示例：如果是 public 文件夹下的图标
    if (folderPath.startsWith('/') || folderPath.startsWith('./')) {
      // 这里可以实现具体的文件加载逻辑
      // 比如通过 fetch 加载已知的文件列表
      
      // 为了演示，这里提供一个简单的实现
      // 实际使用时，您需要提供文件列表或使用构建工具生成
      const commonIconNames = ['circle.svg', 'square.svg', 'triangle.svg', 'star.svg', 'heart.svg']
      const fileMap = createSvgFileMap(folderPath, commonIconNames)
      return await loadSvgFiles(fileMap)
    }
  } catch (error) {
    console.error('加载 SVG 文件夹失败:', error)
  }
  
  return svgMap
}

// 生成 SVG 集合
const generateSvgBundle = async () => {
  if (!props.svgMap) return

  isLoading.value = true
  
  try {
    let svgMap: SvgFileMap = {}
    
    if (typeof props.svgMap === 'string') {
      // 如果是字符串路径，从文件夹加载
      svgMap = await loadSvgFromFolder(props.svgMap)
    } else {
      // 如果是对象，直接使用
      svgMap = props.svgMap
    }
    
    // 使用 bundleSvgs 生成合并的 SVG
    const bundledUrl = await bundleSvgs(svgMap, props.customAttributes)
    svgBlobUrl.value = bundledUrl
    
  } catch (error) {
    console.error('生成 SVG 集合失败:', error)
  } finally {
    isLoading.value = false
  }
}

// SVG 加载完成回调
const onSvgLoad = async () => {
  await nextTick()
  
  if (!objectRef.value) return
  
  try {
    // 初始化 SVGMorpheus 实例
    const svgDoc = objectRef.value.contentDocument
    if (!svgDoc) {
      console.error('无法访问 SVG 文档')
      return
    }
    
    // 创建 SVGMorpheus 实例，传入 SVG 容器
    morpheusInstance.value = new SVGMorpheus(svgDoc.documentElement, {
      duration: props.duration,
      easing: props.easing,
      rotation: props.rotation
    })
    
    // 切换到初始图标或默认图标
    const initialIcon = props.value || props.defaultIcon
    if (initialIcon) {
      await switchToIcon(initialIcon, false)
    }
    
  } catch (error) {
    console.error('初始化 SVGMorpheus 失败:', error)
  }
}

// 切换图标
const switchToIcon = async (iconName: string, animated = true) => {
  if (!morpheusInstance.value || !iconName) return
  
  try {
    emit('animationStart', iconName)
    emit('change', iconName)
    
    if (animated) {
      // 带动画切换
      await new Promise<void>((resolve) => {
        morpheusInstance.value!.to(iconName, {
          duration: props.duration,
          easing: props.easing,
          rotation: props.rotation
        }, () => {
          emit('animationEnd', iconName)
          resolve()
        })
      })
    } else {
      // 无动画切换（用于初始化）
      morpheusInstance.value.to(iconName, { duration: 0 })
      emit('animationEnd', iconName)
    }
    
  } catch (error) {
    console.error('切换图标失败:', error)
  }
}

// 监听 value 变化
watch(() => props.value, (newValue) => {
  if (newValue && morpheusInstance.value) {
    switchToIcon(newValue)
  }
})

// 监听 svgMap 变化
watch(() => props.svgMap, () => {
  generateSvgBundle()
}, { deep: true })

// 监听动画选项变化
watch([() => props.duration, () => props.easing, () => props.rotation], () => {
  if (morpheusInstance.value && objectRef.value?.contentDocument) {
    // 重新配置 morpheus 实例
    morpheusInstance.value = new SVGMorpheus(objectRef.value.contentDocument.documentElement, {
      duration: props.duration,
      easing: props.easing,
      rotation: props.rotation
    })
  }
})

// 组件挂载时生成 SVG 集合
onMounted(() => {
  generateSvgBundle()
})

// 组件卸载时清理资源
onUnmounted(() => {
  if (svgBlobUrl.value) {
    URL.revokeObjectURL(svgBlobUrl.value)
  }
})

// 暴露方法给父组件
defineExpose({
  switchToIcon,
  morpheusInstance: computed(() => morpheusInstance.value)
})
</script>

<style scoped lang="scss">
.svg-morpheus-container {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 24px;
  
  .svg-morpheus-object {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .svg-morpheus-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #666;
    white-space: nowrap;
  }
}
</style>
