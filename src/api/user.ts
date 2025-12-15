import instance from '@/config/axios'
import type { ApiResponse, UserInfo, MchUserVO, UserMchUpdateDTO } from '@/types/api'

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return instance.get('/users/info')
}

export const getMchUserInfo = (): Promise<ApiResponse<MchUserVO>> => {
  return instance.get('/mch/user/info?populate=*')
}

export const updateMchInfo = (data: UserMchUpdateDTO): Promise<ApiResponse<boolean>> => {
  return instance.post('/mch/user/update', data)
}

export const uploadAvatar = (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'merchant/avatar')
  formData.append('suffix', file.name.split('.').pop() || 'png')
  return instance.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
