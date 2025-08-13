import {
  House,
  DataBoard,
  User,
  Setting
} from '@element-plus/icons-vue'

// 菜单配置
export const menuConfig = [
  {
    id: 'home',
    title: '首页',
    icon: House,
    path: '/'
  },
  {
    id: 'dashboard',
    title: '仪表板',
    icon: DataBoard,
    path: '#'
  },
  {
    id: 'user',
    title: '用户管理',
    icon: User,
    path: '#'
  },
  {
    id: 'settings',
    title: '系统设置',
    icon: Setting,
    path: '#'
  }
]

// 获取菜单数据
export const getMenuList = () => {
  return menuConfig
}

// 根据路径获取菜单项
export const getMenuByPath = (path) => {
  return menuConfig.find(item => item.path === path)
}