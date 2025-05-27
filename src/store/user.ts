import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, register as registerApi } from '@/api/auth'
import { type UserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await loginApi(credentials)
      token.value = response.token
      userInfo.value = response.userInfo
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify(response.userInfo))
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: { username: string; password: string; email: string }) => {
    try {
      const response = await registerApi(userData)
      if (response.code === 0) {
        return response
      }
      throw new Error(response.msg || '注册失败')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    login,
    register,
    logout
  }
}) 