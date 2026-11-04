export interface Merch {
  pid: string
  merch_name: string
  merch_description: string
  detailed_description?: string
  size: string
  price: number
  total_available: number
  images: string[]
  category?: boolean
  discount?: {
    enabled: boolean
    percentage: number
    original_price: number
    label: string
    limited_to?: number
  }
}

export interface ApiMerchResponse {
  merchs: Merch[]
}

export interface MerchDetailResponse {
  merch: Merch
}
