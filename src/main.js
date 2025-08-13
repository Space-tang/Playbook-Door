import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

console.log('🚀 Playbook Door 正在启动...')

try {
  const app = createApp(App)

  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.use(router)
  app.use(ElementPlus)
  
  console.log('✅ Vue 应用配置完成，开始挂载...')
  app.mount('#app')
  console.log('🎉 Playbook Door 启动成功！')
} catch (error) {
  console.error('❌ Playbook Door 启动失败:', error)
  
  // 显示错误信息
  document.getElementById('app').innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #f56c6c;">应用启动失败</h2>
      <p>请打开浏览器开发者工具查看详细错误信息</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.message}</pre>
    </div>
  `
}
