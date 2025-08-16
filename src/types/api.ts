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

// ===== Daily Sales (last 60 days) =====
export interface DailySalesItemVO {
  /** yyyy-MM-dd */
  date: string
  /** 当日订单数 */
  orderCount: number
  /** 当日收益 */
  earnings: number
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

// ===== App Sales Summary =====
export interface AppSalesSummaryVO {
  appId: number
  salesCount: number
  totalAmount: number
  bundleTriggerCount: number
  app: ProductBaseVO | null
}

export interface AppSalesSummaryPageQueryDTO {
  pageNum: number
  pageSize: number
  userId?: number
}

// ===== Funnel (Downloads -> Code Displayed -> Code Entered -> Start Purchase -> Purchases) =====
export interface SalesQueryDTO {
  /** 可不传，后端会从登录上下文填充 */
  userId?: number
  /** 开始日期，yyyy-MM-dd */
  startDate: string
  /** 结束日期，yyyy-MM-dd */
  endDate: string
  /** 可选过滤：appId */
  appId?: number | null
}

export interface AppFunnelVO {
  /** 统计周期键，如 2025-08-01~2025-08-14 */
  periodKey: string
  /** 应用ID */
  appId: number | null
  /** 下载 */
  downloads: number
  /** 弹码 */
  codeDisplayed: number
  /** 输入码 */
  codeEntered: number
  /** 开始购买 */
  startPurchase: number
  /** 应用购买 */
  appPurchases: number
  /** 套餐购买 */
  bundlePurchases: number
  /** 应用信息 */
  app: ProductBaseVO | null
}
