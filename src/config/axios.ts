import axios from 'axios'
import { ElMessage } from 'element-plus'
import { BizErrorCode } from '@/constant/errorCode'
import type { ApiResponse } from '@/types/api'
import { useUserStore } from '@/store/user'
import { redirectToSsoLogin } from '@/utils/ssoRedirect'

const instance = axios.create({
  baseURL: '/api', // 走 vite 代理
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const redirectToLogin = (message = '登录已过期，请重新登录') => {
  const userStore = useUserStore()
  userStore.token = ''
  userStore.userInfo = null
  ElMessage.error(message)
  redirectToSsoLogin('merchant', 1000)
}

// 请求拦截器
instance.interceptors.request.use(config => {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res: ApiResponse<any> = response.data
    if (res.code === BizErrorCode.SUCCESS) {
      return response.data // 返回原始 response
    } else if (res.code === 401 || res.code === 403) {
      redirectToLogin(res.msg || '登录已过期，请重新登录')
      return Promise.reject(response.data)
    } else {
      ElMessage.error(response.data.msg || '请求失败')
      return Promise.reject(response.data)
    }
  },
  error => {
    const status = error.response?.status
    if (status === 401 || status === 403) {
      redirectToLogin(error.response?.data?.msg || '登录已过期，请重新登录')
    } else {
      ElMessage.error('网络错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default instance
