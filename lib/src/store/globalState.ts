import type { SvgRegistryConfig, SvgFileMap, SvgRegistrySource } from '../types/type'

// 使用 window 对象保存全局状态，避免模块实例问题
declare global {
  interface Window {
    __SVG_MORPHLING_GLOBAL_STATE__?: {
      globalSvgMap: SvgFileMap
      globalSvgBlobUrl: string
    }
  }
}

// 初始化全局状态
if (typeof window !== 'undefined') {
  window.__SVG_MORPHLING_GLOBAL_STATE__ = window.__SVG_MORPHLING_GLOBAL_STATE__ || {
    globalSvgMap: {},
    globalSvgBlobUrl: ''
  }
}

// 获取全局状态的辅助函数
const getGlobalStateObject = () => {
  if (typeof window === 'undefined') {
    // SSR 环境的后备方案
    return { globalSvgMap: {}, globalSvgBlobUrl: '' }
  }
  if (!window.__SVG_MORPHLING_GLOBAL_STATE__) {
    window.__SVG_MORPHLING_GLOBAL_STATE__ = {
      globalSvgMap: {},
      globalSvgBlobUrl: ''
    }
  }
  return window.__SVG_MORPHLING_GLOBAL_STATE__
}

// 处理单个数据源的函数
const processSingleSource = async (source: SvgRegistrySource): Promise<SvgFileMap> => {
  const result: SvgFileMap = {}
  
  if (typeof source === 'object') {
    // 直接的 SVG 映射对象
    return { ...source }
  }
  
  if (typeof source === 'string') {
    if (source.endsWith('.svg')) {
      // 单个 SVG 文件
      try {
        const response = await fetch(source)
        if (response.ok) {
          const svgContent = await response.text()
          // 从文件路径提取文件名（去掉扩展名）
          const fileName = source.split('/').pop()?.replace('.svg', '') || 'icon'
          result[fileName] = svgContent
        } else {
          console.warn(`❌ 无法加载 SVG 文件: ${source} (状态码: ${response.status})`)
        }
      } catch (error) {
        console.warn(`❌ 加载 SVG 文件失败: ${source}`, error)
      }
    } else if (source.endsWith('/')) {
      // 文件夹路径 - 提示用户使用辅助函数
      console.warn(`❌ 文件夹路径 "${source}" 需要在调用 registry 前预处理`)
      console.warn('💡 请使用 createSvgMapFromFolder 辅助函数：')
      console.warn(`   const svgMap = await createSvgMapFromFolder('${source}')`)
      console.warn(`   await SvgMorphling.registry({ sources: [svgMap, ...] })`)
      console.warn('   或者直接在 main.ts 中使用 import.meta.glob')
    } else {
      console.warn(`❌ 不支持的路径格式: ${source}`)
      console.warn('💡 支持的格式：')
      console.warn('   - 文件路径：以 ".svg" 结尾，如 "./assets/logo.svg"')
      console.warn('   - SVG 映射对象：{ iconName: svgContent, ... }')
      console.warn('   - 文件夹：请使用 createSvgMapFromFolder 辅助函数预处理')
    }
  }
  
  return result
}

// 辅助函数：从 Vite glob 结果创建 SVG 映射
export const createSvgMapFromFolder = async (
  globModules: Record<string, () => Promise<string>>
): Promise<SvgFileMap> => {
  const result: SvgFileMap = {}
  
  for (const path in globModules) {
    const fileName = path.split('/').pop()?.replace('.svg', '') || ''
    if (fileName) {
      try {
        const svgContent = await globModules[path]()
        result[fileName] = svgContent
      } catch (error) {
        console.warn(`❌ 加载文件失败: ${path}`, error)
      }
    }
  }
  
  return result
}

// 全局注册方法
export const registry = async (config: SvgRegistryConfig): Promise<void> => {
  const { bundleSvgs } = await import('svg-morpheus-ts')
  
  try {
    const globalState = getGlobalStateObject()
    
    // 清空之前的全局集合
    globalState.globalSvgMap = {}
    
    // 处理所有数据源
    const processPromises = config.sources.map(source => processSingleSource(source))
    const results = await Promise.all(processPromises)
    
    // 合并所有结果
    results.forEach(sourceMap => {
      Object.assign(globalState.globalSvgMap, sourceMap)
    })
    
    // 生成全局 SVG 集合
    if (Object.keys(globalState.globalSvgMap).length > 0) {
      const attributes = config.customAttributes || {
        viewBox: '0 0 24 24',
        class: 'svg-morphling-global-iconset'
      }
      
      // 释放之前的 URL
      if (globalState.globalSvgBlobUrl) {
        URL.revokeObjectURL(globalState.globalSvgBlobUrl)
      }
      
      globalState.globalSvgBlobUrl = await bundleSvgs(globalState.globalSvgMap, attributes)
    }
    
  } catch (error) {
    console.error('全局 SVG 集合注册失败:', error)
  }
}

// 获取全局集合的方法
export const getGlobalSvgMap = (): SvgFileMap => {
  const globalState = getGlobalStateObject()
  return globalState.globalSvgMap
}

export const getGlobalSvgBlobUrl = (): string => {
  const globalState = getGlobalStateObject()
  return globalState.globalSvgBlobUrl
}

// 直接导出全局状态变量的引用函数（用于调试）
export const getGlobalState = () => getGlobalStateObject() 