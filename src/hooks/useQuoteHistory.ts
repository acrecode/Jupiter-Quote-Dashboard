import { useEffect, useRef, useState } from 'react'
import type { JupiterQuote } from '@/types/jupiter'

export function useQuoteHistory(quote: JupiterQuote | undefined, updatedAt: number) {
  const previousOut = useRef<string>()
  const [outDelta, setOutDelta] = useState(0)
  const [impact, setImpact] = useState<number[]>([])

  useEffect(() => {
    if (!quote || !updatedAt) return
    const current = BigInt(quote.outAmount)
    const previous = previousOut.current ? BigInt(previousOut.current) : current
    setOutDelta(current > previous ? 1 : current < previous ? -1 : 0)
    previousOut.current = quote.outAmount
    setImpact((items) => [...items.slice(-59), Number(quote.priceImpactPct) * 100])
  }, [quote, updatedAt])

  return { outDelta, impact }
}
