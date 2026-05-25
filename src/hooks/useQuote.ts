import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getQuote } from '@/api/jupiter'
import type { PairConfig } from '@/store/pairs'
import { useSettingsStore } from '@/store/settings'

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(handle)
  }, [value, delay])
  return debounced
}

export function useQuote(pair: PairConfig | undefined) {
  const paused = useSettingsStore((state) => state.paused)
  const slippageBps = useSettingsStore((state) => state.slippageBps)
  const cadenceMs = useSettingsStore((state) => state.cadenceMs)
  const amount = useDebounced(pair?.amount ?? '0', 300)

  return useQuery({
    queryKey: ['quote', pair?.inputMint, pair?.outputMint, amount, slippageBps, pair?.onlyDirectRoutes],
    queryFn: () =>
      getQuote({
        inputMint: pair!.inputMint,
        outputMint: pair!.outputMint,
        amount,
        slippageBps,
        onlyDirectRoutes: pair!.onlyDirectRoutes,
      }),
    enabled: Boolean(pair && !paused && Number(amount) > 0),
    refetchInterval: paused ? false : cadenceMs,
    refetchIntervalInBackground: false,
  })
}
