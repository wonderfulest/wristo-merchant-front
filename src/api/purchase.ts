import instance from '@/config/axios'
import type { ApiResponse, PurchaseRecordPageQueryDTO, PageResponse, PurchaseRecordVO } from '@/types/api'

export const getPurchaseRecordPageList = async (dto: PurchaseRecordPageQueryDTO): Promise<ApiResponse<PageResponse<PurchaseRecordVO>>> => {
  return instance.post('/mch/purchases/page?populate=product,bundle', dto)
}
