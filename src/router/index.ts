import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/account/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/account/Products.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'history',
          name: 'History',
          component: () => import('@/views/account/History.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'discounts',
          name: 'Discounts',
          component: () => import('@/views/account/Discounts.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('@/views/account/Profile.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/',
      redirect: '/account/dashboard'
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('from', from.path)
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !userStore.token) {
    next('/login')
  } else if (!requiresAuth && userStore.token) {
    next('/account/dashboard')
  } else {
    next()
  }
})

export default router
