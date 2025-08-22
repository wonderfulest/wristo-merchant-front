import type { UserBaseVO } from './user'

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
