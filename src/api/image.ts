import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'
import type { ImageVO } from '@/types/image'

export const uploadImage = (file: File, aspectCode?: string): Promise<ApiResponse<ImageVO>> => {
  const form = new FormData()
  form.append('file', file)
  if (aspectCode) {
    form.append('aspect', aspectCode)
  }
  return instance.post('/admin/image/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const uploadVideo = (file: File, aspectCode?: string): Promise<ApiResponse<ImageVO>> => {
  const form = new FormData()
  form.append('file', file)
  if (aspectCode) {
    form.append('aspect', aspectCode)
  }
  return instance.post('/admin/image/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
