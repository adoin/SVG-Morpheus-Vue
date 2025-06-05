<template>
  <div id="app">
    <!-- 页面头部 -->
    <header class="header">
      <div class="header-content">
        <div class="hero-section">
          <h1 class="hero-title">
            <span class="icon-wrapper">🎨</span>
            SVG Morpheus Vue
          </h1>
          <p class="hero-subtitle">流畅的 SVG 图标变形动画组件库</p>
          <div class="feature-badges">
            <span class="badge">Vue 3</span>
            <span class="badge">TypeScript</span>
            <span class="badge">SVG 动画</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <!-- 全局注册示例 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>🌍 全局注册示例</h2>
          <p>使用 import.meta.glob 从 app/src/assets/svg 文件夹动态加载图标</p>
        </div>
        
        <div class="demo-card">
          <div class="global-showcase">
            <div class="icon-display large">
              <SvgMorphling 
                :value="globalIcon" 
                :duration="750"
                easing="elastic-in-out"
                rotation="clock"
                class="global-icon"
                @animation-start="onAnimationStart"
                @animation-end="onAnimationEnd"
                @change="onIconChange"
              />
            </div>
            <div class="current-icon-info">
              <h3>{{ globalIcon }}</h3>
              <p>全局注册图标 - 无需传入 svg-map</p>
            </div>
          </div>
          
          <div class="global-controls">
            <div class="icon-category">
              <h4>📁 资源文件图标</h4>
              <p>来自 app/src/assets/svg 目录</p>
              <div class="icon-grid">
                <button 
                  v-for="iconName in assetIcons"
                  :key="iconName"
                  :class="['icon-btn', { active: globalIcon === iconName }]"
                  @click="globalIcon = iconName"
                >
                  <span class="icon-preview">
                    <SvgMorphling 
                      :value="iconName" 
                      class="preview-icon small"
                    />
                  </span>
                  <span class="icon-label">{{ iconName }}</span>
                </button>
              </div>
            </div>
            
            <div class="icon-category">
              <h4>🎨 基础图标集合</h4>
              <p>常用的基础图标</p>
              <div class="icon-grid">
                <button 
                  v-for="iconName in basicIconNames"
                  :key="iconName"
                  :class="['icon-btn', { active: globalIcon === iconName }]"
                  @click="globalIcon = iconName"
                >
                  <span class="icon-preview">
                    <SvgMorphling 
                      :value="iconName" 
                      class="preview-icon small"
                    />
                  </span>
                  <span class="icon-label">{{ iconName }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 基础用法示例 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>✨ 直接传入 SVG 映射</h2>
          <p>使用 :svg-map 属性直接传入图标映射对象</p>
        </div>
        
        <div class="demo-card">
          <div class="icon-showcase">
            <div class="icon-display">
              <SvgMorphling 
                :value="currentIcon" 
                :svg-map="localIcons"
                :duration="600"
                easing="quad-in-out"
                rotation="none"
                class="demo-icon"
                @animation-start="onAnimationStart"
                @animation-end="onAnimationEnd"
                @change="onIconChange"
              />
            </div>
            <div class="current-icon-name">{{ currentIcon }}</div>
          </div>
          
          <div class="icon-controls">
            <h3>选择图标</h3>
            <div class="icon-grid">
              <button 
                v-for="iconName in Object.keys(localIcons)"
                :key="iconName"
                :class="['icon-btn', { active: currentIcon === iconName }]"
                @click="currentIcon = iconName"
              >
                <span class="icon-preview">
                  <SvgMorphling 
                    :value="iconName" 
                    :svg-map="localIcons"
                    class="preview-icon"
                  />
                </span>
                <span class="icon-label">{{ iconName }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 动画配置示例 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>⚙️ 动画配置</h2>
          <p>实时调整动画参数，体验不同的变形效果</p>
        </div>

        <div class="demo-card">
          <div class="config-showcase">
            <div class="icon-display large">
              <SvgMorphling 
                :value="animatedIcon" 
                :svg-map="arrowIcons"
                :duration="animationDuration"
                :easing="animationEasing"
                :rotation="animationRotation"
                class="config-icon"
              />
            </div>
            <div class="current-settings">
              <div class="setting-item">
                <span class="label">图标:</span>
                <span class="value">{{ animatedIcon }}</span>
              </div>
              <div class="setting-item">
                <span class="label">持续时间:</span>
                <span class="value">{{ animationDuration }}ms</span>
              </div>
              <div class="setting-item">
                <span class="label">缓动:</span>
                <span class="value">{{ animationEasing }}</span>
              </div>
              <div class="setting-item">
                <span class="label">旋转:</span>
                <span class="value">{{ animationRotation }}</span>
              </div>
            </div>
          </div>
          
          <div class="config-panel">
            <div class="control-grid">
              <div class="control-group">
                <label>图标选择</label>
                <select v-model="animatedIcon" class="select-input">
                  <option v-for="iconName in Object.keys(arrowIcons)" :key="iconName" :value="iconName">
                    {{ iconName }}
                  </option>
                </select>
              </div>
              
              <div class="control-group">
                <label>持续时间: {{ animationDuration }}ms</label>
                <input 
                  v-model.number="animationDuration" 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100"
                  class="range-input"
                />
              </div>
              
              <div class="control-group">
                <label>缓动函数</label>
                <select v-model="animationEasing" class="select-input">
                  <option value="quad-in-out">quad-in-out</option>
                  <option value="cubic-in-out">cubic-in-out</option>
                  <option value="quart-in-out">quart-in-out</option>
                  <option value="quint-in-out">quint-in-out</option>
                  <option value="sine-in-out">sine-in-out</option>
                  <option value="expo-in-out">expo-in-out</option>
                  <option value="circ-in-out">circ-in-out</option>
                  <option value="back-in-out">back-in-out</option>
                  <option value="elastic-in-out">elastic-in-out</option>
                  <option value="bounce-in-out">bounce-in-out</option>
                </select>
              </div>
              
              <div class="control-group">
                <label>旋转方向</label>
                <select v-model="animationRotation" class="select-input">
                  <option value="none">无旋转</option>
                  <option value="clock">顺时针</option>
                  <option value="counterclock">逆时针</option>
                  <option value="random">随机</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 自动播放示例 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>🔄 自动播放</h2>
          <p>连续的图标变形动画演示</p>
        </div>

        <div class="demo-card">
          <div class="autoplay-showcase">
            <div class="icon-display xlarge">
              <SvgMorphling 
                :value="autoIcon" 
                :duration="800"
                easing="elastic-in-out"
                rotation="clock"
                class="autoplay-icon"
              />
            </div>
            <div class="autoplay-status">
              <div class="status-indicator" :class="{ active: isAutoPlaying }"></div>
              <span>{{ isAutoPlaying ? '自动播放中' : '已暂停' }}</span>
            </div>
          </div>
          
          <div class="autoplay-controls">
            <button @click="toggleAutoPlay" class="play-btn" :class="{ playing: isAutoPlaying }">
              <span class="btn-icon">{{ isAutoPlaying ? '⏸️' : '▶️' }}</span>
              <span class="btn-text">{{ isAutoPlaying ? '停止播放' : '开始播放' }}</span>
            </button>
            <p v-if="isAutoPlaying" class="play-info">每 2 秒自动切换图标</p>
          </div>
        </div>
      </section>

      <!-- 事件日志 -->
      <section class="demo-section">
        <div class="section-header">
          <h2>📊 事件监听</h2>
          <p>实时显示组件触发的事件</p>
        </div>
        
        <div class="demo-card">
          <div class="event-log">
            <div class="log-header">
              <span>实时事件日志</span>
              <button @click="clearEventLog" class="clear-btn">清空</button>
            </div>
            <div class="log-content">
              <div v-for="(event, index) in eventLog" :key="index" class="log-item">
                <span class="log-time">{{ event.time }}</span>
                <span class="log-type" :class="`type-${event.type}`">{{ event.type }}</span>
                <span class="log-data">{{ event.data }}</span>
              </div>
              <div v-if="eventLog.length === 0" class="log-empty">
                暂无事件记录
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页面底部 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 SVG Morpheus Vue</p>
        <p>基于 <a href="https://adoin.github.io/SVG-Morpheus-ts/" target="_blank">SVG-Morpheus-ts</a> 构建</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// 只导入用于调用静态方法，组件已在 main.ts 中全局注册
import { SvgMorphling } from 'svg-morpheus-vue'

// 响应式数据
const currentIcon = ref('circle')
const globalIcon = ref('vite')
const animatedIcon = ref('arrow-up')
const autoIcon = ref('circle')
const animationDuration = ref(600)
const animationEasing = ref('quad-in-out')
const animationRotation = ref<'none' | 'clock' | 'counterclock' | 'random'>('none')
const isAutoPlaying = ref(false)
const eventLog = ref<Array<{ time: string; type: string; data: string }>>([])

// 图标数据
const assetIcons = ['vite', 'bag', 'diving']
const basicIconNames = ['home', 'user', 'settings', 'search', 'heart', 'star']

// 局部图标映射（用于演示直接传入 svg-map 的用法）
const localIcons = {
  circle: `<svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10"/>
  </svg>`,
  square: `<svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20"/>
  </svg>`,
  triangle: `<svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,2 22,20 2,20"/>
  </svg>`,
  diamond: `<svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12,1 22,12 12,23 2,12"/>
  </svg>`,
  hexagon: `<svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="17.5,3.5 22.5,12 17.5,20.5 6.5,20.5 1.5,12 6.5,3.5"/>
  </svg>`
}

// 箭头图标集合（用于动画配置示例）
const arrowIcons = {
  'arrow-up': `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l8 8h-6v12h-4V10H4z"/>
  </svg>`,
  'arrow-down': `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22l-8-8h6V2h4v12h6z"/>
  </svg>`,
  'arrow-left': `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 12l8-8v6h12v4H10v6z"/>
  </svg>`,
  'arrow-right': `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12l-8 8v-6H2v-4h12V4z"/>
  </svg>`
}

// 自动播放相关
let autoPlayTimer: number | null = null
const iconNames = [...assetIcons, ...basicIconNames]
let currentAutoIndex = 0

// 事件处理
const onAnimationStart = (iconName: string) => {
  addEventLog('animationStart', iconName)
}

const onAnimationEnd = (iconName: string) => {
  addEventLog('animationEnd', iconName)
}

const onIconChange = (iconName: string) => {
  addEventLog('change', iconName)
}

const addEventLog = (type: string, data: string) => {
  const time = new Date().toLocaleTimeString()
  eventLog.value.unshift({ time, type, data })
  // 限制日志条数
  if (eventLog.value.length > 20) {
    eventLog.value = eventLog.value.slice(0, 20)
  }
}

const clearEventLog = () => {
  eventLog.value = []
}

// 自动播放控制
const toggleAutoPlay = () => {
  if (isAutoPlaying.value) {
    stopAutoPlay()
  } else {
    startAutoPlay()
  }
}

const startAutoPlay = () => {
  isAutoPlaying.value = true
  autoPlayTimer = setInterval(() => {
    currentAutoIndex = (currentAutoIndex + 1) % iconNames.length
    autoIcon.value = iconNames[currentAutoIndex]
  }, 2000)
}

const stopAutoPlay = () => {
  isAutoPlaying.value = false
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 组件挂载和卸载
onMounted(() => {
  addEventLog('component', 'mounted')
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style lang="scss" scoped>
@use './styles/variables' as vars;

* {
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  padding: 80px 20px;
  text-align: center;
  color: white;
  
  .header-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .hero-section {
    .icon-wrapper {
      font-size: 4rem;
      display: block;
      margin-bottom: 1rem;
      animation: float 3s ease-in-out infinite;
    }
    
    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin: 0 0 1rem 0;
      background: linear-gradient(45deg, #fff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin: 0 0 2rem 0;
    opacity: 0.9;
    }
    
    .feature-badges {
      display: flex;
      justify-content: center;
      gap: 12px;
      
      .badge {
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 80px;
  position: relative;
  z-index: 1;
}

.demo-section {
  margin-bottom: 80px;
  
  .section-header {
    text-align: center;
    margin-bottom: 40px;
    
    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    p {
      font-size: 1.125rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }
  }
}

.demo-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

// 基础用法样式
.icon-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  
  .icon-display {
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #e2e8f0;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .demo-icon {
      width: 80px;
      height: 80px;
      color: #667eea;
      
      :deep(object) {
        width: 100%;
        height: 100%;
        border: none;
        background: transparent;
      }
    }
  }
  
  .current-icon-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #475569;
    text-transform: capitalize;
  }
}

.icon-controls {
  padding: 40px;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 24px 0;
    color: #1e293b;
    text-align: center;
  }
  
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    
    .icon-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 16px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        border-color: #667eea;
      }
      
      &.active {
        background: #667eea;
        border-color: #667eea;
        color: white;
        
        .icon-preview .preview-icon {
          color: white;
        }
      }
      
      .icon-preview {
        width: 40px;
        height: 40px;
        margin-bottom: 8px;
        
        .preview-icon {
          width: 100%;
          height: 100%;
          color: #667eea;
          
          :deep(object) {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
          }
        }
      }
      
      .icon-label {
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
      }
    }
  }
}

// 配置面板样式
.config-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 60px 40px 40px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  
  .icon-display {
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.large {
      .config-icon {
        width: 100px;
        height: 100px;
        color: #8b5cf6;
        
        :deep(object) {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
        }
      }
    }
  }
  
  .current-settings {
    .setting-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-weight: 500;
        color: #64748b;
      }
      
      .value {
        font-weight: 600;
        color: #1e293b;
        font-family: 'Courier New', monospace;
      }
    }
  }
}

.config-panel {
  padding: 40px;
  
  .control-grid {
    display: grid;
    gap: 24px;
    
    .control-group {
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }
      
      .select-input, .range-input {
        width: 100%;
        padding: 12px;
        border: 2px solid #e5e7eb;
  border-radius: 8px;
        font-size: 0.875rem;
        transition: border-color 0.2s ease;
        
        &:focus {
          outline: none;
          border-color: #667eea;
        }
      }
      
      .range-input {
        height: 8px;
        padding: 0;
        background: #e5e7eb;
        
        &::-webkit-slider-thumb {
          width: 20px;
          height: 20px;
          background: #667eea;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      }
    }
  }
}

// 自动播放样式
.autoplay-showcase {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 40px 40px;
  background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%);
  
  .icon-display {
    &.xlarge {
      width: 160px;
      height: 160px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      
      .autoplay-icon {
        width: 120px;
        height: 120px;
        color: #f59e0b;
        
        :deep(object) {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
        }
      }
    }
  }
  
  .autoplay-status {
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    color: #92400e;
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #dc2626;
      animation: pulse 2s infinite;
      
      &.active {
        background: #10b981;
      }
    }
  }
}

.autoplay-controls {
  padding: 40px;
  text-align: center;
  
  .play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 16px 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 auto 16px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }
    
    &.playing {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      
      &:hover {
        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
      }
    }
    
    .btn-icon {
      font-size: 1.125rem;
    }
  }
  
  .play-info {
    color: #92400e;
    font-size: 0.875rem;
    margin: 0;
  }
}

// 事件日志样式
.event-log {
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 32px;
    background: #1f2937;
    color: white;
    font-weight: 600;
    
    .clear-btn {
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease;
      
      &:hover {
        background: #dc2626;
      }
    }
  }
  
  .log-content {
    max-height: 300px;
    overflow-y: auto;
    background: #111827;
    
    .log-item {
      display: grid;
      grid-template-columns: 80px 140px 1fr;
      gap: 16px;
      padding: 12px 32px;
      border-bottom: 1px solid #374151;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      
      &:hover {
        background: #1f2937;
      }
      
      .log-time {
        color: #9ca3af;
      }
      
      .log-type {
        font-weight: 600;
        
        &.type-animationStart {
          color: #10b981;
        }
        
        &.type-animationEnd {
          color: #3b82f6;
        }
        
        &.type-change {
          color: #f59e0b;
        }
        
        &.type-component {
          color: #8b5cf6;
        }
      }
      
      .log-data {
        color: #e5e7eb;
      }
    }
    
    .log-empty {
      padding: 40px;
      text-align: center;
      color: #6b7280;
      font-style: italic;
    }
  }
}

.footer {
  background: rgba(0, 0, 0, 0.8);
  color: rgba(255, 255, 255, 0.8);
  padding: 40px 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  
  .footer-content {
    max-width: 800px;
    margin: 0 auto;
    
    p {
      margin: 8px 0;
      
      a {
        color: #667eea;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

// 动画
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .header {
    padding: 60px 20px;
    
    .hero-title {
      font-size: 2.5rem;
    }
    
    .feature-badges {
      flex-wrap: wrap;
    }
  }
  
  .demo-section .section-header h2 {
    font-size: 2rem;
  }
  
  .config-showcase {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }
  
  .icon-controls .icon-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
  }
}

// 全局注册样式
.global-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 60px 40px 40px;
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  
  .icon-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    &.large {
      .global-icon {
        width: 120px;
        height: 120px;
        color: #0277bd;
        
        :deep(object) {
          width: 100%;
          height: 100%;
          border: none;
          background: transparent;
        }
      }
    }
  }
  
  .current-icon-info {
    text-align: center;
    
    h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #01579b;
      margin: 16px 0 8px;
      text-transform: capitalize;
    }
    
    p {
      color: #0277bd;
      font-size: 0.875rem;
    margin: 0;
      font-style: italic;
    }
  }
}

.global-controls {
  padding: 40px;
  
  .icon-category {
    margin-bottom: 32px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    p {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 16px 0;
    }
    
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 12px;
      
      .icon-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px 12px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          border-color: #0277bd;
        }
        
        &.active {
          background: #0277bd;
          border-color: #0277bd;
          color: white;
          
          .icon-preview .preview-icon {
            color: white;
            
            &.small {
              color: white;
            }
          }
        }
        
        .icon-preview {
          margin-bottom: 6px;
          
          .preview-icon {
            width: 32px;
            height: 32px;
            color: #0277bd;
            
            &.small {
              width: 28px;
              height: 28px;
            }
            
            :deep(object) {
              width: 100%;
              height: 100%;
              border: none;
              background: transparent;
            }
          }
        }
        
        .icon-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
          text-align: center;
          line-height: 1.2;
        }
      }
    }
  }
}
</style> 