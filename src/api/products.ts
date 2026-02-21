import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'

// 对应后端 com.wukong.face.modules.products.vo.ProductVO
export interface Product {
  // 基本信息
  id?: number
  appId: number
  designId?: string
  name: string
  description: string

  // 价格与图片
  price: number
  rawImageUrl?: string
  garminImageUrl: string
  garminStoreUrl: string
  bannerImageUrl?: string

  // Garmin 相关
  garminAppUuid?: string

  // 试用与统计
  trialLasts: number
  download?: number
  purchase?: number

  // 关联用户
  user?: {
    id?: number
    username?: string
    nickname?: string
    avatar?: string
  } | null

  // 状态
  status?: number
  isActive?: number
  isDeleted?: number

  createdAt?: string
  updatedAt?: string
  lastGoLive?: string

  // 分类
  categories?: Array<{
    id: number
    name: string
  }>

  // 其它复杂字段按需扩展，这里先用宽松类型以兼容后端结构
  productImages?: any[]
  payment?: any
  packageLog?: any
  release?: any
  prgRelease?: any
  packagingLog?: any
  prgPackagingLog?: any
  bundles?: any[]
  devices?: any[]
}

export interface ProductPageQuery {
  pageNum: number
  pageSize: number
  orderBy?: string
  name?: string
  isActive?: number
  userId?: number
  designUid?: string
  categoryId?: number
}
export interface ProductPageData {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: Product[]
}

export const fetchProductPage = (params: ProductPageQuery): Promise<ApiResponse<ProductPageData>> => {
  return instance.post('/mch/products/page?populate=*', params)
}

export const fetchAllProducts = (): Promise<ApiResponse<Product[]>> => {
  return instance.get('/mch/products/all-by-user')
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
  return instance.post('/mch/products/create', data)
}

// 查询单个产品
export const getProduct = (appId: number): Promise<ApiResponse<Product>> => {
  return instance.get(`/mch/products/${appId}`)
}

// 更新产品
export const updateProduct = (appId: number, data: Partial<Product>): Promise<ApiResponse<Product>> => {
  return instance.post(`/mch/products/update/${appId}`, data)
}

// 上传产品图片
export const uploadProductImage = (file: File, folder = 'hero', suffix = 'png') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  formData.append('suffix', suffix);
  return instance.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
} 