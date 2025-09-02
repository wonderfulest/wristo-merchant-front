import instance from '@/config/axios'
import type { ApiResponse, UserInfo, MchUserVO, UserMchUpdateDTO } from '@/types/api'

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return instance.get('/users/info')
}

export const updateUserInfo = (data: Partial<UserInfo>): Promise<ApiResponse<UserInfo>> => {
  return instance.post('/users/update/my-info', data)
}

export const getMchUserInfo = (): Promise<ApiResponse<MchUserVO>> => {
  return instance.get('/v1/mch/user/info')
}

export const updateMchInfo = (data: UserMchUpdateDTO): Promise<ApiResponse<boolean>> => {
  return instance.post('/v1/mch/user/update/mch-info', data)
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
