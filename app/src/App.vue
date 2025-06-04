<template>
  <div id="app">
    <!-- 页面头部 -->
    <header class="header">
      <h1>🎨 SVG Morpheus Vue 示例</h1>
      <p>基于 SVG-Morpheus-ts 的 Vue3 组件库</p>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <!-- 基础用法示例 -->
      <section class="example-section">
        <h2>基础用法</h2>
        <div class="demo-container">
          <div class="icon-display">
            <SvgMorpheus 
              :value="currentIcon" 
              :svg-map="basicIcons"
              :duration="600"
              easing="quad-in-out"
              rotation="none"
              class="demo-icon"
              @animation-start="onAnimationStart"
              @animation-end="onAnimationEnd"
              @change="onIconChange"
            />
          </div>
          <div class="controls">
            <h3>选择图标：</h3>
            <div class="icon-buttons">
              <button 
                v-for="iconName in Object.keys(basicIcons)"
                :key="iconName"
                :class="{ active: currentIcon === iconName }"
                @click="currentIcon = iconName"
              >
                {{ iconName }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 动画选项示例 -->
      <section class="example-section">
        <h2>动画选项</h2>
        <div class="demo-container">
          <div class="icon-display">
            <SvgMorpheus 
              :value="animatedIcon" 
              :svg-map="arrowIcons"
              :duration="animationDuration"
              :easing="animationEasing"
              :rotation="animationRotation"
              class="demo-icon large"
            />
          </div>
          <div class="controls">
            <div class="control-group">
              <label>图标：</label>
              <select v-model="animatedIcon">
                <option v-for="iconName in Object.keys(arrowIcons)" :key="iconName" :value="iconName">
                  {{ iconName }}
                </option>
              </select>
            </div>
            <div class="control-group">
              <label>持续时间：{{ animationDuration }}ms</label>
              <input 
                v-model.number="animationDuration" 
                type="range" 
                min="100" 
                max="2000" 
                step="100"
              />
            </div>
            <div class="control-group">
              <label>缓动函数：</label>
              <select v-model="animationEasing">
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
              <label>旋转方向：</label>
              <select v-model="animationRotation">
                <option value="none">无旋转</option>
                <option value="clock">顺时针</option>
                <option value="counterclock">逆时针</option>
                <option value="random">随机</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- 自动切换示例 -->
      <section class="example-section">
        <h2>自动切换</h2>
        <div class="demo-container">
          <div class="icon-display">
            <SvgMorpheus 
              :value="autoIcon" 
              :svg-map="basicIcons"
              :duration="800"
              easing="elastic-in-out"
              rotation="clock"
              class="demo-icon large"
            />
          </div>
          <div class="controls">
            <button @click="toggleAutoPlay">
              {{ isAutoPlaying ? '停止自动播放' : '开始自动播放' }}
            </button>
            <p v-if="isAutoPlaying">每 2 秒自动切换图标</p>
          </div>
        </div>
      </section>

      <!-- 事件日志 -->
      <section class="example-section">
        <h2>事件日志</h2>
        <div class="event-log">
          <div v-for="(event, index) in eventLog" :key="index" class="event-item">
            <span class="event-time">{{ event.time }}</span>
            <span class="event-type">{{ event.type }}</span>
            <span class="event-data">{{ event.data }}</span>
          </div>
          <button @click="clearEventLog" class="clear-button">清空日志</button>
        </div>
      </section>
    </main>

    <!-- 页面底部 -->
    <footer class="footer">
      <p>&copy; 2024 SVG Morpheus Vue. 基于 Vue 3 + TypeScript + SCSS 构建。</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SvgMorpheus, iconSets } from '@svg-morpheus-vue/lib'

// 响应式数据
const currentIcon = ref('circle')
const animatedIcon = ref('arrow-up')
const autoIcon = ref('circle')
const animationDuration = ref(600)
const animationEasing = ref('quad-in-out')
const animationRotation = ref<'none' | 'clock' | 'counterclock' | 'random'>('none')
const isAutoPlaying = ref(false)
const eventLog = ref<Array<{ time: string; type: string; data: string }>>([])

// 图标集合
const basicIcons = iconSets.basic
const arrowIcons = iconSets.arrows

// 自动播放相关
let autoPlayTimer: number | null = null
const iconNames = Object.keys(basicIcons)
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
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 60px 20px;

  h1 {
    margin: 0 0 16px 0;
    font-size: 3rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    opacity: 0.9;
  }
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
}

.example-section {
  margin-bottom: 60px;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;

  h2 {
    margin: 0 0 20px 0;
    font-size: 2rem;
    color: #333;
    border-bottom: 3px solid #667eea;
    padding-bottom: 10px;
  }
}

.demo-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 24px;
  align-items: start;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.icon-display {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e1e8ed;
  
  .demo-icon {
    width: 48px;
    height: 48px;
    color: #42b983;
    
    &.large {
      width: 64px;
      height: 64px;
    }
  }
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icon-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  button {
    padding: 8px 16px;
    border: 1px solid #42b983;
    background: white;
    color: #42b983;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #42b983;
      color: white;
    }
    
    &.active {
      background: #42b983;
      color: white;
    }
  }
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 500;
    color: #1d2129;
  }
  
  select, input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  input[type="range"] {
    padding: 0;
  }
}

.event-log {
  background: #1e1e1e;
  color: #e1e8ed;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
  
  .event-item {
    display: grid;
    grid-template-columns: 80px 120px 1fr;
    gap: 12px;
    padding: 4px 0;
    border-bottom: 1px solid #333;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .event-time {
    color: #666;
  }
  
  .event-type {
    color: #42b983;
    font-weight: bold;
  }
  
  .event-data {
    color: #e1e8ed;
  }
  
  .clear-button {
    margin-top: 12px;
    padding: 6px 12px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    
    &:hover {
      background: #369970;
    }
  }
}

.footer {
  background: #f5f5f5;
  text-align: center;
  padding: 30px 20px;
  border-top: 1px solid #e0e0e0;

  p {
    margin: 0;
    color: #666;
  }
}

:global(.custom-morpheus) {
  border: 2px dashed #667eea;
}
</style> 