import axios from '@/config/axios'
import type { ApiResponse, UserInfo } from '@/types/api'

export const getUserInfo = async () => {
  return await axios.get<ApiResponse<UserInfo>>('/users/info')
}
