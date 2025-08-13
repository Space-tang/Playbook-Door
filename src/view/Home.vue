<template>
    <div class="home-container">
        <!-- 头部导航 -->
        <header class="header">
            <div class="header-content">
                <div class="logo">
                    <h1>Playbook Door</h1>
                    <p>动态目录展示平台</p>
                </div>
                <div class="header-actions">
                    <el-button @click="refreshData" :loading="loading">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        刷新
                    </el-button>
                    <el-button type="primary" @click="openGithubRepo">
                        <el-icon>
                            <Link />
                        </el-icon>
                        GitHub 仓库
                    </el-button>
                </div>
            </div>
        </header>

        <!-- 主要内容区 -->
        <main class="main-content">
            <div class="content-wrapper">
                <!-- 搜索和筛选 -->
                <div class="search-section">
                    <div class="search-bar">
                        <el-input v-model="searchKeyword" placeholder="搜索目录..." size="large" clearable>
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="filter-tabs">
                        <el-button-group>
                            <el-button v-for="category in categories" :key="category.key"
                                :type="activeCategory === category.key ? 'primary' : ''"
                                @click="setActiveCategory(category.key)">
                                {{ category.label }}
                                <el-badge :value="category.count" class="category-badge" />
                            </el-button>
                        </el-button-group>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="stats-section">
                    <div class="stat-item">
                        <span class="stat-number">{{ filteredDirectories.length }}</span>
                        <span class="stat-label">个目录</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{{ lastUpdateTime }}</span>
                        <span class="stat-label">最后更新</span>
                    </div>
                </div>

                <!-- 目录卡片网格 -->
                <div class="directories-grid">
                    <div v-for="directory in filteredDirectories" :key="directory.name" class="directory-card"
                        @click="openDirectory(directory)">
                        <div class="card-header">
                            <div class="card-icon">
                                <el-icon :size="24" :color="directory.color">
                                    <component :is="directory.icon" />
                                </el-icon>
                            </div>
                        </div>

                        <div class="card-content">
                            <h3 class="card-title">{{ directory.name }}</h3>
                            <p class="card-description">{{ directory.description }}</p>

                            <div class="card-meta">
                                <div class="meta-item">
                                    <el-icon>
                                        <Calendar />
                                    </el-icon>
                                    <span>{{ formatDate(directory.createdAt) }}</span>
                                </div>
                                <div class="meta-item">
                                    <el-icon>
                                        <Files />
                                    </el-icon>
                                    <span>{{ directory.fileCount }} 个文件</span>
                                </div>
                            </div>

                            <div class="card-tags">
                                <el-tag v-for="tag in directory.tags" :key="tag" size="small" class="directory-tag">
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div class="update-info">
                                <span class="update-time">{{ formatRelativeTime(directory.updatedAt) }}</span>
                            </div>
                            <div class="card-status">
                                <el-tag :type="directory.status === 'active' ? 'success' : 'info'" size="small">
                                    {{ directory.status === 'active' ? '活跃' : '静态' }}
                                </el-tag>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 空状态 -->
                <div v-if="filteredDirectories.length === 0" class="empty-state">
                    <el-empty description="暂无目录数据">
                        <el-button type="primary" @click="refreshData">刷新数据</el-button>
                    </el-empty>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
    Search,
    Refresh,
    Link,
    Calendar,
    Files
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const activeCategory = ref('all')
const lastUpdateTime = ref('')

// 目录数据（从 GitHub API 或生成的 JSON 文件获取）
const directories = ref([])

// 分类处理工具函数
const normalizeCategory = (category) => {
    // 处理空值、null、undefined，统一转换为 "未定义"
    if (!category || category.trim() === '') {
        return '未定义'
    }
    return category.trim()
}

const generateDynamicCategories = (directories) => {
    // 1. 提取所有分类
    const categorySet = new Set()
    directories.forEach(dir => {
        const category = normalizeCategory(dir.category)
        categorySet.add(category)
    })

    // 2. 生成分类对象
    const dynamicCategories = Array.from(categorySet).map(category => ({
        key: category,
        label: category,
        count: directories.filter(d => normalizeCategory(d.category) === category).length
    }))

    // 3. 排序：字母顺序，未定义放最后
    dynamicCategories.sort((a, b) => {
        if (a.key === '未定义') return 1
        if (b.key === '未定义') return -1
        return a.key.localeCompare(b.key, 'zh-CN')
    })

    // 4. 添加"全部"选项
    return [
        { key: 'all', label: '全部', count: directories.length },
        ...dynamicCategories
    ]
}

// 动态分类配置
const categories = computed(() => {
    return generateDynamicCategories(directories.value)
})

// 过滤后的目录列表
const filteredDirectories = computed(() => {
    let result = directories.value

    // 按分类过滤 - 使用动态分类
    if (activeCategory.value !== 'all') {
        result = result.filter(d => {
            const normalizedCategory = normalizeCategory(d.category)
            return normalizedCategory === activeCategory.value
        })
    }

    // 按搜索关键词过滤
    if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(d =>
            d.name.toLowerCase().includes(keyword) ||
            d.description.toLowerCase().includes(keyword) ||
            d.tags.some(tag => tag.toLowerCase().includes(keyword))
        )
    }

    return result
})

// 方法
const refreshData = async () => {
    loading.value = true
    try {
        await fetchDirectoriesFromGitHub()
        ElMessage.success('数据刷新成功')
        lastUpdateTime.value = formatDate(new Date())
    } catch (error) {
        ElMessage.error('数据刷新失败')
    } finally {
        loading.value = false
    }
}

const fetchDirectoriesFromGitHub = async () => {
    try {
        // 首先尝试从本地 JSON 文件获取数据
        const response = await fetch('./directories.json')
        if (response.ok) {
            const data = await response.json()
            // 处理目录数据，确保每个项目都有有效的分类
            const processedDirectories = (data.directories || []).map(dir => ({
                ...dir,
                category: dir.category || '未定义' // 为缺少 category 字段的目录项设置默认值
            }))
            directories.value = processedDirectories
            lastUpdateTime.value = formatDate(new Date(data.lastUpdate))
            console.log('成功获取目录数据:', data)
        } else {
            // 如果没有 JSON 文件，设置空数据
            directories.value = []
            lastUpdateTime.value = formatDate(new Date())
        }
    } catch (error) {
        console.error('获取目录数据失败:', error)
        ElMessage.error('获取目录数据失败，请稍后重试')
        // 设置空数据状态
        directories.value = []
    }
}



const setActiveCategory = (category) => {
    activeCategory.value = category
}

const openDirectory = (directory) => {
    // 直接跳转到 GitHub 目录
    const githubUrl = `https://github.com/Space-tang/Playbook-Door/tree/main/${directory.name}`
    window.open(githubUrl, '_blank')
}

const openGithubRepo = () => {
    window.open('https://github.com/Space-tang/Playbook-Door', '_blank')
}



const formatDate = (date) => {
    return new Date(date).toLocaleDateString('zh-CN')
}

const formatRelativeTime = (date) => {
    const now = new Date()
    const target = new Date(date)
    const diff = now - target
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天更新'
    if (days === 1) return '昨天更新'
    if (days < 7) return `${days}天前更新`
    if (days < 30) return `${Math.floor(days / 7)}周前更新`
    return `${Math.floor(days / 30)}个月前更新`
}

// 生命周期
onMounted(() => {
    refreshData()
})
</script>

<style scoped>
.home-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo h1 {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 4px 0;
}

.logo p {
    font-size: 14px;
    color: #7f8c8d;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.main-content {
    padding: 40px 24px;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.search-section {
    margin-bottom: 32px;
}

.search-bar {
    margin-bottom: 20px;
}

.search-bar .el-input {
    max-width: 400px;
}

.filter-tabs {
    display: flex;
    gap: 8px;
}

.category-badge {
    margin-left: 8px;
}

.stats-section {
    display: flex;
    gap: 32px;
    margin-bottom: 32px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #2c3e50;
}

.stat-label {
    font-size: 14px;
    color: #7f8c8d;
    margin-top: 4px;
}

.directories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
}

.directory-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.directory-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;
}

.card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(64, 158, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}



.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 8px 0;
    line-height: 1.4;
}

.card-description {
    font-size: 14px;
    color: #7f8c8d;
    line-height: 1.6;
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #95a5a6;
}

.card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.directory-tag {
    font-size: 12px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #f8f9fa;
}

.update-time {
    font-size: 12px;
    color: #bdc3c7;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }

    .directories-grid {
        grid-template-columns: 1fr;
    }

    .stats-section {
        flex-direction: column;
        gap: 16px;
    }

    .filter-tabs .el-button-group {
        flex-wrap: wrap;
    }
}
</style>