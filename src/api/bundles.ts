import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'

export interface Bundle {
  bundleId: number
  bundleName: string
  bundleDesc: string
  price: number
  isActive: number
  createdAt: string
  updatedAt: string
  products: any[]
}

// 获取所有套餐列表
export const fetchBundles = (isActive: number | null): Promise<ApiResponse<Bundle[]>> => {
  return instance.get(`/mch/bundles/all?isActive=${isActive ?? ''}`)
}

// 新增套餐
export interface CreateBundleDto {
  bundleName: string
  bundleDesc: string
  price: number
  appIds: number[]
}
export const createBundle = (data: CreateBundleDto): Promise<ApiResponse<Bundle>> => {
  return instance.post('/mch/bundles/create', data)
}

export interface UpdateBundleDto {
  bundleName: string
  bundleDesc: string
  price: number
  appIds: number[]
}

export const updateBundle = (data: UpdateBundleDto, bundleId: number): Promise<ApiResponse<Bundle>> => {
  return instance.post(`/mch/bundles/update/${bundleId}`, data)
}

export const getBundle = (bundleId: number): Promise<ApiResponse<Bundle>> => {
  return instance.get(`/mch/bundles/${bundleId}`)
}

export const updateBundleActive = (bundleId: number, isActive: number): Promise<ApiResponse<Bundle>> => {
  return instance.post(`/mch/bundles/${bundleId}/activate/${isActive}`)
}