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
