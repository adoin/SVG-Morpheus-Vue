export interface MorpheusProps  {
    value:string
    
}

export interface SvgMorpheusProps {
  /** 当前显示的图标名称 */
  value: string
  /** SVG 图标映射对象或文件夹路径 */
  svgMap?: Record<string, string> | string
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

export interface SvgMorpheusEmits {
  /** 动画开始时触发 */
  (e: 'animationStart', iconName: string): void
  /** 动画完成时触发 */
  (e: 'animationEnd', iconName: string): void
  /** 图标切换时触发 */
  (e: 'change', iconName: string): void
}

export interface SvgMorpheusOptions {
  duration?: number
  easing?: string
  rotation?: 'none' | 'clock' | 'counterclock' | 'random'
}

export interface SvgFileMap {
  [iconName: string]: string
}
