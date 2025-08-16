import instance from '@/config/axios'
import type {
  ApiResponse,
  PurchaseRecordPageQueryDTO,
  PageResponse,
  PurchaseRecordVO,
  AppSalesSummaryPageQueryDTO,
  AppSalesSummaryVO,
  AppFunnelQueryDTO,
  AppFunnelVO
} from '@/types/api'

export const getPurchaseRecordPageList = async (dto: PurchaseRecordPageQueryDTO): Promise<ApiResponse<PageResponse<PurchaseRecordVO>>> => {
  return instance.post('/mch/purchases/page?populate=product,bundle', dto)
}

export const getAppSalesSummaryPage = async (
  dto: AppSalesSummaryPageQueryDTO
): Promise<ApiResponse<PageResponse<AppSalesSummaryVO>>> => {
  return instance.post('/mch/purchases/app/summary/page?populate=product', dto)
}

export const getFunnel = async (dto: AppFunnelQueryDTO): Promise<ApiResponse<AppFunnelVO>> => {
  return instance.post('/mch/purchases/funnel', dto)
}
