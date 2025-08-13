<template>
  <div class="home-container">
    <div class="header">
      <h1>Playbook Door</h1>
      <p>动态目录展示平台</p>
    </div>
    
    <div class="content">
      <div class="stats">
        <p>总目录数: {{ directories.length }}</p>
        <p>最后更新: {{ lastUpdateTime }}</p>
      </div>
      
      <div class="directories-grid">
        <div 
          v-for="directory in directories" 
          :key="directory.name"
          class="directory-card"
        >
          <h3>{{ directory.name }}</h3>
          <p>{{ directory.description }}</p>
          <div class="tags">
            <span 
              v-for="tag in directory.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="directories.length === 0" class="empty-state">
        <h3>暂无目录数据</h3>
        <p>请添加项目目录到仓库中</p>
        <button @click="refreshData">刷新数据</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

console.log('🏠 Home 组件正在加载...')

// 响应式数据
const directories = ref([])
const lastUpdateTime = ref('')

// 加载数据
const refreshData = async () => {
  console.log('🔄 开始加载数据...')
  try {
    const response = await fetch('./directories.json')
    if (response.ok) {
      const data = await response.json()
      directories.value = data.directories || []
      lastUpdateTime.value = new Date(data.lastUpdate).toLocaleString('zh-CN')
      console.log('✅ 数据加载成功:', data)
    } else {
      console.warn('⚠️ 无法加载 directories.json，使用示例数据')
      // 使用示例数据
      directories.value = [
        {
          name: 'example-project',
          description: '这是一个示例项目，展示 Playbook Door 的功能',
          tags: ['示例', '演示'],
          category: 'other'
        }
      ]
      lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    }
  } catch (error) {
    console.error('❌ 加载数据失败:', error)
    directories.value = []
  }
}

// 组件挂载时加载数据
onMounted(() => {
  console.log('📦 Home 组件已挂载')
  refreshData()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.stats p {
  margin: 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.directories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.directory-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.directory-card:hover {
  transform: translateY(-4px);
}

.directory-card h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.directory-card p {
  margin: 0 0 16px 0;
  color: #7f8c8d;
  line-height: 1.5;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 60px 20px;
  border-radius: 12px;
  color: #666;
}

.empty-state h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.empty-state p {
  margin: 0 0 24px 0;
}

.empty-state button {
  background: #409EFF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.empty-state button:hover {
  background: #337ecc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .directories-grid {
    grid-template-columns: 1fr;
  }
}
</style>""