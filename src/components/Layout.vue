<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>Playbook Door</h2>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="transparent"
          text-color="#ffffff"
          active-text-color="#409EFF"
        >
          <el-menu-item
            v-for="item in menuList"
            :key="item.id"
            :index="item.path"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <el-icon class="menu-icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="menu-text">{{ item.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-container class="main-container">
        <!-- 头部 -->
        <el-header class="header">
          <div class="header-left">
            <span class="page-title">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <span class="welcome-text">欢迎使用 Playbook Door</span>
          </div>
        </el-header>
        
        <!-- 内容区 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMenuList, getMenuByPath } from '../config/menu'

const route = useRoute()
const router = useRouter()
const menuList = ref(getMenuList())

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前页面标题
const currentPageTitle = computed(() => {
  const currentMenu = getMenuByPath(route.path)
  return currentMenu ? currentMenu.title : '首页'
})

// 处理菜单点击
const handleMenuClick = (item) => {
  if (item.path === '#') {
    ElMessage.info(`${item.title} 功能开发中...`)
  } else {
    router.push(item.path)
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f6fa;
}

.sidebar {
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.logo {
  padding: 24px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.logo h2 {
  color: #ffffff;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
}

.sidebar-menu {
  border: none;
  background: transparent;
  padding-top: 10px;
}

.menu-item {
  margin: 4px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(4px);
}

.menu-item.is-active {
  background: rgba(64, 158, 255, 0.2);
  border-left: 3px solid #409EFF;
  border-radius: 0 8px 8px 0;
}

.menu-icon {
  margin-right: 12px;
  font-size: 16px;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
}

.main-container {
  background-color: #f5f6fa;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #e8eaec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 999;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.welcome-text {
  color: #7f8c8d;
  font-size: 14px;
}

.main-content {
  background-color: #f5f6fa;
  padding: 24px;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 60px !important;
  }
  
  .menu-text {
    display: none;
  }
  
  .logo h2 {
    font-size: 12px;
  }
}
</style>