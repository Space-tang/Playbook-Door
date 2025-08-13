import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
const Home = () => import('../view/HomeSimple.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Playbook Door`
  }
  next()
})

export default router