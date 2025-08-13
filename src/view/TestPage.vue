<template>
  <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white;">
    <h1>🎉 Playbook Door 测试页面</h1>
    <p>如果你能看到这个页面，说明 Vue 应用正在正常工作！</p>
    
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
      <h2>系统信息</h2>
      <p>当前时间: {{ currentTime }}</p>
      <p>页面加载状态: ✅ 成功</p>
      <p>Vue 版本: {{ vueVersion }}</p>
    </div>
    
    <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
      <h2>测试功能</h2>
      <button 
        @click="testClick" 
        style="background: #409EFF; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;"
      >
        点击测试 ({{ clickCount }})
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

console.log('🧪 测试页面正在加载...')

const currentTime = ref('')
const clickCount = ref(0)
const vueVersion = ref('3.x')

const testClick = () => {
  clickCount.value++
  console.log('按钮被点击了:', clickCount.value)
}

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN')
}

onMounted(() => {
  console.log('✅ 测试页面挂载成功')
  updateTime()
  setInterval(updateTime, 1000)
})
</script>