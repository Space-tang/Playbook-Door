import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

console.log('🚀 Playbook Door 正在启动...')

try {
  const app = createApp(App)
  app.use(router)
  
  console.log('✅ Vue 应用配置完成，开始挂载...')
  app.mount('#app')
  console.log('🎉 Playbook Door 启动成功！')
} catch (error) {
  console.error('❌ Playbook Door 启动失败:', error)
  
  // 显示错误信息
  document.getElementById('app').innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; background: #f56c6c; color: white;">
      <h2>应用启动失败</h2>
      <p>错误信息: ${error.message}</p>
      <p>请检查浏览器控制台获取更多信息</p>
    </div>
  `
}
