import axios from '@/config/axios'
import type { UserInfo as UserInfoType } from './user'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  email: string
}

export interface LoginResponseData {
  token: string
  userInfo: UserInfoType
}

export const login = async (credentials: LoginCredentials) => {
  return await axios.post<LoginResponseData>('/auth/login/email', credentials)
}

export const register = async (userData: RegisterData) => {
  return await axios.post<string>('/auth/register', userData)
}
