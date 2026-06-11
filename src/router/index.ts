import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/user'
import { getRouteLocaleParam, SUPPORTED_LOCALES, useLocaleStore } from '@/store/locale'

const langPattern = SUPPORTED_LOCALES.join('|')
const baseAccountChildren: RouteRecordRaw[] = [
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

const localizedAccountChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: 'AccountLocalized',
    redirect: (to) => {
      const lang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang
      return `/${encodeURIComponent(String(lang))}/account/dashboard`
    }
  },
  {
    path: 'dashboard',
    name: 'DashboardLocalized',
    component: () => import('@/views/account/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'products',
    name: 'ProductsLocalized',
    component: () => import('@/views/account/products/Products.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'history',
    name: 'HistoryLocalized',
    component: () => import('@/views/account/History.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'discounts',
    name: 'DiscountsLocalized',
    component: () => import('@/views/account/Discounts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: 'profile',
    name: 'ProfileLocalized',
    component: () => import('@/views/account/Profile.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: `/:lang(${langPattern})/auth/callback`,
      name: 'AuthCallbackLocalized',
      component: () => import('@/views/AuthCallback.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallback.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: `/:lang(${langPattern})/account`,
      redirect: (to) => {
        const lang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang
        return `/${encodeURIComponent(String(lang))}/account/dashboard`
      },
      component: () => import('@/views/account/Account.vue'),
      meta: { requiresAuth: true },
      children: localizedAccountChildren
    },
    {
      path: '/account',
      redirect: '/account/dashboard',
      component: () => import('@/views/account/Account.vue'),
      meta: { requiresAuth: true },
      children: baseAccountChildren
    },
    {
      path: `/:lang(${langPattern})/api`,
      name: 'APILocalized',
      component: () => import('@/views/API.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/api',
      name: 'API',
      component: () => import('@/views/API.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: `/:lang(${langPattern})`,
      redirect: (to) => {
        const lang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang
        return `/${encodeURIComponent(String(lang))}/account/dashboard`
      }
    },
    {
      path: '/',
      redirect: '/account/dashboard'
    },
    {
      path: `/:lang(${langPattern})/:pathMatch(.*)*`,
      redirect: (to) => {
        const lang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang
        return `/${encodeURIComponent(String(lang))}`
      }
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
  const localeStore = useLocaleStore()
  const routeLang = Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang
  const normalizedRouteLang = getRouteLocaleParam(routeLang)
  if (normalizedRouteLang && normalizedRouteLang !== localeStore.currentLocale) {
    localeStore.setLocale(normalizedRouteLang)
  }
  localeStore.syncDocumentLang()

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const ssoBaseUrl = import.meta.env.VITE_WRISTO_SSO_LOGIN_URL
  const redirectUri = import.meta.env.VITE_WRISTO_SSO_REDIRECT_URI
  const ssoLoginUrl = `${ssoBaseUrl}?client=merchant&redirect_uri=${encodeURIComponent(redirectUri)}`

  if (requiresAuth && !userStore.userInfo) {
    window.location.href = ssoLoginUrl
    return
  } else {
    next()
  }
})

export default router
