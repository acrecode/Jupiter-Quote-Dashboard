import type { TokenInfo } from '@/types/tokens'

export function formatUnits(amount: string | bigint | undefined, decimals = 0, maxFraction = 6) {
  if (!amount) return '0'
  const value = typeof amount === 'bigint' ? amount : BigInt(amount)
  const scale = 10n ** BigInt(decimals)
  const whole = value / scale
  const fraction = value % scale
  if (decimals === 0 || fraction === 0n) return whole.toLocaleString('en-US')
  const padded = fraction.toString().padStart(decimals, '0').slice(0, maxFraction)
  const trimmed = padded.replace(/0+$/, '')
  return trimmed ? `${whole.toLocaleString('en-US')}.${trimmed}` : whole.toLocaleString('en-US')
}

export function parseUnits(value: string, decimals: number) {
  const normalized = value.replace(/[^\d.]/g, '')
  const [whole = '0', fraction = ''] = normalized.split('.')
  const padded = fraction.slice(0, decimals).padEnd(decimals, '0')
  return `${BigInt(whole || '0') * 10n ** BigInt(decimals) + BigInt(padded || '0')}`
}

export function formatPct(value: string | number, digits = 4) {
  const pct = Number(value) * 100
  if (!Number.isFinite(pct)) return '0.0000%'
  return `${pct.toFixed(pct < 0.01 ? digits : 3)}%`
}

export function formatMs(seconds: number | undefined) {
  if (!seconds) return '0ms'
  return `${Math.max(1, Math.round(seconds * 1000))}ms`
}

export function shortMint(mint: string) {
  return `${mint.slice(0, 4)}…${mint.slice(-4)}`
}

export function tokenSymbol(tokens: Map<string, TokenInfo>, mint: string) {
  return tokens.get(mint)?.symbol ?? shortMint(mint)
}

export function quotePrice(input: TokenInfo | undefined, output: TokenInfo | undefined, inAmount: string, outAmount: string) {
  if (!input || !output || outAmount === '0') return null
  const inputUnits = Number(formatUnits(inAmount, input.decimals, 9).replace(/,/g, ''))
  const outputUnits = Number(formatUnits(outAmount, output.decimals, 9).replace(/,/g, ''))
  if (!inputUnits || !outputUnits) return null
  return { forward: outputUnits / inputUnits, reverse: inputUnits / outputUnits }
}
