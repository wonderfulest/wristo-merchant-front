import type { UserBaseVO } from './user'
import type { ProductBase } from './product'

export interface Bundle {
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
  products: ProductBase[] | null
}
