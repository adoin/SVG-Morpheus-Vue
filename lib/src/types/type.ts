export interface MorpheusProps  {
    value:string
    
}

export interface SvgMorphlingProps {
  /** 当前显示的图标名称 */
  value: string
  /** 直接传入的 SVG 图标映射对象 */
  svgMap?: Record<string, string>
  /** 动画持续时间 (毫秒) */
  duration?: number
  /** 缓动函数 */
  easing?: string
  /** 旋转方向 */
  rotation?: 'none' | 'clock' | 'counterclock' | 'random'
  /** 自定义 SVG 属性 */
  customAttributes?: Record<string, string>
  /** 容器样式类名 */
  class?: string
  /** 容器样式 */
  style?: string | Record<string, string>
  /** 默认图标 */
  defaultIcon?: string
}

export interface SvgMorphlingEmits {
  /** 动画开始时触发 */
  (e: 'animationStart', iconName: string): void
  /** 动画完成时触发 */
  (e: 'animationEnd', iconName: string): void
  /** 图标切换时触发 */
  (e: 'change', iconName: string): void
}

export interface SvgMorphlingOptions {
  duration?: number
  easing?: string
  rotation?: 'none' | 'clock' | 'counterclock' | 'random'
}

export interface SvgFileMap {
  [iconName: string]: string
}

/** 全局注册的数据源类型 */
export type SvgRegistrySource = 
  | Record<string, string>  // 直接的 SVG 映射
  | string                  // 文件路径（.svg 结尾）或文件夹路径（/ 结尾）

/** 全局注册配置 */
export interface SvgRegistryConfig {
  /** 数据源数组 */
  sources: SvgRegistrySource[]
  /** 自定义 SVG 属性 */
  customAttributes?: Record<string, string>
}

/** 组件静态方法类型 */
export interface SvgMorphlingStatic {
  registry: (config: SvgRegistryConfig) => Promise<void>
  getGlobalSvgMap: () => SvgFileMap
  getGlobalSvgBlobUrl: () => string
}
