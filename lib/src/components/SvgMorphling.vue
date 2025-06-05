<template>
  <div
    ref="containerRef"
    :class="props.class"
    :style="containerStyle"
  >
    <object
      ref="objectRef"
      :data="svgBlobUrl"
      type="image/svg+xml"
      @load="onSvgLoad"
      :key="`${instanceId}-${svgBlobUrl}`"
    />
    <div v-if="isLoading">
      <slot name="loading">加载中...</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { SVGMorpheus, bundleSvgs } from 'svg-morpheus-ts'
import { getGlobalSvgBlobUrl } from '../store/globalState'
import type { SvgMorphlingProps, SvgMorphlingEmits } from '../types/type'

// 生成唯一实例 ID
const instanceId = Math.random().toString(36).substring(2, 15)

// 定义组件属性
const props = withDefaults(defineProps<SvgMorphlingProps>(), {
  duration: 600,
  easing: 'quad-in-out',
  rotation: 'none',
  defaultIcon: '',
  customAttributes: () => ({
    viewBox: '0 0 24 24',
    class: 'svg-morphling-iconset'
  })
})

// 定义事件
const emit = defineEmits<SvgMorphlingEmits>()

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

// 生成 SVG 集合
const generateSvgBundle = async () => {
  if (props.svgMap) {
    // 模式1: 直接传入 svgMap
    isLoading.value = true
    
    try {
      const bundledUrl = await bundleSvgs(props.svgMap, props.customAttributes)
      svgBlobUrl.value = bundledUrl
    } catch (error) {
      // 生成 SVG 集合失败
    } finally {
      isLoading.value = false
    }
  } else {
    // 模式2: 使用全局注册的集合
    const globalUrl = getGlobalSvgBlobUrl()
    if (globalUrl) {
      svgBlobUrl.value = globalUrl
    }
  }
}

// SVG 加载完成回调
const onSvgLoad = async () => {
  await nextTick()
  
  if (!objectRef.value) return
  
  try {
    // 创建 SVGMorpheus 实例，传入 object 元素（不是 SVG 文档）
    morpheusInstance.value = new SVGMorpheus(objectRef.value, {
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
    // 初始化 SVGMorpheus 失败
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
    // 切换图标失败
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
  if (morpheusInstance.value && objectRef.value) {
    // 重新配置 morpheus 实例
    morpheusInstance.value = new SVGMorpheus(objectRef.value, {
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
    // 只清理非全局的 URL
    const globalUrl = getGlobalSvgBlobUrl()
    if (svgBlobUrl.value !== globalUrl) {
      URL.revokeObjectURL(svgBlobUrl.value)
    }
  }
})

// 暴露方法给父组件
defineExpose({
  switchToIcon,
  morpheusInstance: computed(() => morpheusInstance.value)
})
</script> 