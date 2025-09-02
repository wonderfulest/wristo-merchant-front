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

export interface MchUserVO extends UserInfo {
  payoutMethod: string | null
  payoutAccount: string | null
}

export interface UserMchUpdateDTO {
  username?: string
  nickname?: string
  avatar?: string
  status?: number
  payoutMethod?: string
  payoutAccount?: string
}
