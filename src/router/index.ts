import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallback.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/account',
      redirect: '/account/dashboard',
      component: () => import('@/views/account/Account.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Account',
          redirect: '/account/dashboard'
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/account/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/account/products/Products.vue'),
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
      path: '/api',
      name: 'API',
      component: () => import('@/views/API.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/account/dashboard'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
  ]
})

// 路由守卫
router.beforeEach((to, _, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const ssoBaseUrl = import.meta.env.VITE_SSO_LOGIN_URL
  const redirectUri = import.meta.env.VITE_SSO_REDIRECT_URI
  const ssoLoginUrl = `${ssoBaseUrl}?client=merchant&redirect_uri=${encodeURIComponent(redirectUri)}`

  if (requiresAuth && !userStore.userInfo) {
    window.location.href = ssoLoginUrl
    return
  } else {
    next()
  }
})

export default router
