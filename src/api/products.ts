import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'

export interface Product {
  id: number
  appId: number
  name: string
  description: string
  price: number
  garminImageUrl: string
  garminStoreUrl: string
  trialLasts: number
  createdAt: string
  updatedAt: string
  isDeleted: number
}

export interface ProductPageQuery {
  pageNum: number
  pageSize: number
  orderBy?: string
}

export interface ProductPageData {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: Product[]
}

export const fetchProductPage = (params: ProductPageQuery): Promise<ApiResponse<ProductPageData>> => {
  return instance.post('/products/page', params)
}

// 新增产品
export interface CreateProductDto {
  name: string;
  description: string;
  garminImageUrl?: string;
  garminStoreUrl?: string;
  trialLasts?: number;
  price?: number;
}

export const createProduct = (data: CreateProductDto): Promise<ApiResponse<Product>> => {
  return instance.post('/products', data)
} 