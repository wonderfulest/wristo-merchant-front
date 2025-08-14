import instance from '@/config/axios'
import type { ApiResponse, PayoutVO } from '@/types/api'

export const getPayoutInfo = async (): Promise<ApiResponse<PayoutVO>> => {
  return instance.get('/mch/payout/now')
}
