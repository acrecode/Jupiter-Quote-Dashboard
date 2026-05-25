export type SwapMode = 'ExactIn' | 'ExactOut'

export interface PlatformFee {
  amount: string
  feeBps: number
}

export interface SwapInfo {
  ammKey: string
  label?: string
  inputMint: string
  outputMint: string
  inAmount: string
  outAmount: string
  feeAmount?: string
  feeMint?: string
  updateContextSlot?: string
}

export interface RoutePlanStep {
  swapInfo: SwapInfo
  percent: number
  bps?: number | null
}

export interface JupiterQuote {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: SwapMode
  slippageBps: number
  platformFee: PlatformFee | null
  priceImpactPct: string
  routePlan: RoutePlanStep[]
  contextSlot: number
  timeTaken: number
  swapUsdValue?: string
  mostReliableAmmsQuoteReport?: unknown
  longtailMarketQuoteReport?: unknown
  useIncurredSlippageForQuoting?: boolean
  useRewards?: boolean
  otherRoutePlans?: unknown[]
  loadedLongtailToken?: boolean
  instructionVersion?: string
}

export interface QuoteParams {
  inputMint: string
  outputMint: string
  amount: string
  slippageBps: number
  onlyDirectRoutes?: boolean
}
