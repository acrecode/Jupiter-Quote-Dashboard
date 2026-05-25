export interface TokenInfo {
  address: string
  id?: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  icon?: string | null
  tags?: string[]
  daily_volume?: number
}
