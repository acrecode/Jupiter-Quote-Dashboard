import type { TokenInfo } from '@/types/tokens'
import { JUP, SOL, USDC } from '@/store/pairs'

export const fallbackTokens: TokenInfo[] = [
  {
    address: SOL,
    symbol: 'SOL',
    name: 'Wrapped SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    tags: ['verified'],
  },
  {
    address: USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    tags: ['verified'],
  },
  {
    address: JUP,
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    logoURI: 'https://static.jup.ag/jup/icon.png',
    tags: ['verified'],
  },
]

function normalize(token: TokenInfo): TokenInfo {
  return {
    ...token,
    address: token.address ?? token.id ?? '',
    logoURI: token.logoURI ?? token.icon ?? undefined,
  }
}

export async function fetchTokens(): Promise<TokenInfo[]> {
  try {
    const response = await fetch('https://tokens.jup.ag/tokens?tags=verified')
    if (!response.ok) throw new Error(String(response.status))
    const tokens = (await response.json()) as TokenInfo[]
    return [...fallbackTokens, ...tokens.map(normalize)].filter((token, index, list) => list.findIndex((item) => item.address === token.address) === index)
  } catch {
    return fallbackTokens
  }
}

export function buildTokenMap(tokens: TokenInfo[]) {
  return new Map(tokens.map((token) => [token.address, token]))
}
