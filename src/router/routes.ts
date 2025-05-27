import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/code' },
  { 
    path: '/code', 
    name: 'CodeInput', 
    component: () => import('@/views/CodeInput.vue') 
  },
  {
    path: '/shop/options',
    name: 'ShopOptions',
    component: () => import('@/views/ShopOptions.vue'),
  },
  {
    path: '/shop/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue')
  },
  {
    path: '/shop/success',
    name: 'Success',
    component: () => import('@/views/Success.vue')
  },
]

export default routes 