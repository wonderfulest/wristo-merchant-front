import instance from '@/config/axios'
import type { ApiResponse } from '@/types/api'

export const TOKEN_NAME = 'merchant-api-token'
export interface TokenMetadata {
  id: number
  name: string
  lastUsedAt: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TokenSecretData extends TokenMetadata {
  token: string
}

export const createOrRotateToken = async (name: string): Promise<ApiResponse<TokenSecretData>> => {
  return instance.post('/mch/tokens/create-or-update', { name })
}

export const getTokenMetadata = async (): Promise<ApiResponse<TokenMetadata>> => {
  return instance.get('/mch/tokens/get-by-name', { params: { name: TOKEN_NAME } })
}
