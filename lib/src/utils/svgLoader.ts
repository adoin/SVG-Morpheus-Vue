import type { SvgFileMap } from '../types'

/**
 * 批量加载 SVG 文件
 * @param fileMap SVG 文件路径映射
 * @returns Promise<SvgFileMap> 包含 SVG 内容的映射
 */
export async function loadSvgFiles(fileMap: Record<string, string>): Promise<SvgFileMap> {
  const svgMap: SvgFileMap = {}
  
  const promises = Object.entries(fileMap).map(async ([iconName, filePath]) => {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`无法加载 SVG 文件: ${filePath}`)
      }
      const svgContent = await response.text()
      svgMap[iconName] = svgContent
    } catch (error) {
      console.error(`加载 SVG 文件 ${filePath} 失败:`, error)
    }
  })
  
  await Promise.allSettled(promises)
  return svgMap
}

/**
 * 从文件夹路径生成 SVG 文件映射
 * 注意：此函数需要预定义的文件列表，因为浏览器无法直接扫描文件夹
 * @param folderPath 文件夹路径
 * @param iconNames 图标名称列表
 * @returns 文件路径映射
 */
export function createSvgFileMap(folderPath: string, iconNames: string[]): Record<string, string> {
  const fileMap: Record<string, string> = {}
  
  iconNames.forEach(iconName => {
    // 移除文件扩展名作为图标名称
    const cleanIconName = iconName.replace(/\.svg$/, '')
    fileMap[cleanIconName] = `${folderPath}/${iconName}`
  })
  
  return fileMap
}

/**
 * 预定义一些常用的图标集合
 */
export const iconSets = {
  /**
   * 基础图标集
   */
  basic: {
    'circle': `<svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>`,
    'square': `<svg viewBox="0 0 24 24">
      <rect x="2" y="2" width="20" height="20" fill="currentColor"/>
    </svg>`,
    'triangle': `<svg viewBox="0 0 24 24">
      <polygon points="12,2 22,20 2,20" fill="currentColor"/>
    </svg>`,
    'star': `<svg viewBox="0 0 24 24">
      <polygon points="12,2 15.09,8.26 22,9 17,14.74 18.18,21.02 12,17.77 5.82,21.02 7,14.74 2,9 8.91,8.26" fill="currentColor"/>
    </svg>`,
    'heart': `<svg viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor"/>
    </svg>`
  },
  
  /**
   * 箭头图标集
   */
  arrows: {
    'arrow-up': `<svg viewBox="0 0 24 24">
      <polyline points="18,15 12,9 6,15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'arrow-down': `<svg viewBox="0 0 24 24">
      <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'arrow-left': `<svg viewBox="0 0 24 24">
      <polyline points="15,18 9,12 15,6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    'arrow-right': `<svg viewBox="0 0 24 24">
      <polyline points="9,18 15,12 9,6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  }
} 