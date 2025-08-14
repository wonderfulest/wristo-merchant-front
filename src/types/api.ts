export interface ApiResponse<T> {
  code: number
  msg: string
  data?: T
} 

export interface UserInfo {
  id: number
  username: string
  nickname: string | null
  email: string
  phone: string | null
  avatar: string | null
  status: string | null
  createdAt: string
  updatedAt: string
  lastLoginTime: string | null
  lastLoginIp: string | null
  isDeleted: string
  roles: any[]
}

export interface LoginResponseData {
  token: string
  userInfo: UserInfo
}

export interface UserBaseVO {
  id: number
  username: string
  nickname: string | null
  email: string
}

export interface PayoutVO {
  id: number
  userId: number
  totalIncomeToDate: number
  currentBalance: number
  nextPayoutAmount: number
  nextPayDay: string
  currencyCode: string
  paddlePayoutId: string | null
  payoutStatus: string
  payoutStatusDesc: string
  createdAt: string
  updatedAt: string
  version: number
  user: UserBaseVO | null
}

export interface ProductBaseVO {
  appId: number
  name: string
  designId: string
  price: number
  garminImageUrl: string
  garminStoreUrl: string
  heroFile: string | null
}

export interface BundleVO {
  bundleId: number
  userId: number
  bundleName: string
  bundleDesc: string
  price: number
  isActive: number
  createdAt: string
  updatedAt: string
  paddleProductId: string
  paddlePriceId: string
  user: UserBaseVO | null
  products: ProductBaseVO[] | null
}

export interface PurchaseRecordVO {
  id: number
  userId: number
  email: string
  accountToken: string
  partNumber: string
  origin: string
  appId: number
  bundleId: number
  isBundle: boolean
  product: ProductBaseVO | null
  bundle: BundleVO | null
  transactionId: string
  customerId: string
  addressId: string
  countryCode: string
  paymentMethod: string
  fee: number
  tax: number
  total: number
  credit: number
  balance: number
  discount: number
  earnings: number
  subtotal: number
  grandTotal: number
  currencyCode: string
  creditToBalance: number
  status: number
  inPayout: number
  statusDesc: string
  createdAt: string
  updatedAt: string
  version: number
  user: UserBaseVO | null
}

export interface PurchaseRecordPageQueryDTO {
  pageNum: number
  pageSize: number
  email?: string | null
  appId?: number | null
  bundleId?: number | null
  status?: number | null
  paymentMethod?: string | null
  inPayout?: number | null
  userId?: number
}

export interface PageResponse<T> {
  pageNum: number
  pageSize: number
  total: number
  pages: number
  list: T[]
}
