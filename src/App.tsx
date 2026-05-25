import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { toPng } from 'html-to-image'
import { AddPairDialog } from '@/components/config/AddPairDialog'
import { PairTabs } from '@/components/config/PairTabs'
import { FeeBreakdown } from '@/components/fees/FeeBreakdown'
import { ImpactGauge } from '@/components/impact/ImpactGauge'
import { Shell } from '@/components/layout/Shell'
import { QuotePanel } from '@/components/quote/QuotePanel'
import { RouteGraph } from '@/components/route/RouteGraph'
import { fetchTokens, buildTokenMap } from '@/api/tokens'
import { getQuote } from '@/api/jupiter'
import { useQuoteHistory } from '@/hooks/useQuoteHistory'
import { usePairStore } from '@/store/pairs'
import { useSettingsStore } from '@/store/settings'
import type { JupiterQuote } from '@/types/jupiter'

function ShortcutOverlay() {
  const open = useSettingsStore((state) => state.shortcutOpen)
  const setOpen = useSettingsStore((state) => state.setShortcutOpen)
  if (!open) return null
  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
      <div className="shortcuts">
        <div>P · pause</div>
        <div>S · swap active pair</div>
        <div>1-9 · jump tabs</div>
        <div>? · shortcuts</div>
      </div>
    </div>
  )
}

function ActiveDashboard() {
  const captureRef = useRef<HTMLDivElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const pairs = usePairStore((state) => state.pairs)
  const activePairId = usePairStore((state) => state.activePairId)
  const setActivePair = usePairStore((state) => state.setActivePair)
  const swapPair = usePairStore((state) => state.swapPair)
  const updatePair = usePairStore((state) => state.updatePair)
  const togglePaused = useSettingsStore((state) => state.togglePaused)
  const paused = useSettingsStore((state) => state.paused)
  const slippageBps = useSettingsStore((state) => state.slippageBps)
  const cadenceMs = useSettingsStore((state) => state.cadenceMs)
  const setShortcutOpen = useSettingsStore((state) => state.setShortcutOpen)
  const activePair = pairs.find((pair) => pair.id === activePairId) ?? pairs[0]
  const tokenQuery = useQuery({ queryKey: ['tokens'], queryFn: fetchTokens, staleTime: 60 * 60 * 1000 })
  const tokens = useMemo(() => buildTokenMap(tokenQuery.data ?? []), [tokenQuery.data])
  const quoteQueries = useQueries({
    queries: pairs.slice(0, 4).map((pair) => ({
      queryKey: ['quote', pair.inputMint, pair.outputMint, pair.amount, slippageBps, pair.onlyDirectRoutes],
      queryFn: () =>
        getQuote({
          inputMint: pair.inputMint,
          outputMint: pair.outputMint,
          amount: pair.amount,
          slippageBps,
          onlyDirectRoutes: pair.onlyDirectRoutes,
        }),
      enabled: !paused && Number(pair.amount) > 0,
      refetchInterval: paused ? false : cadenceMs,
      refetchIntervalInBackground: false,
    })),
  })
  const activeIndex = Math.max(0, pairs.findIndex((pair) => pair.id === activePair?.id))
  const quoteQuery = quoteQueries[activeIndex]
  const { outDelta, impact } = useQuoteHistory(quoteQuery.data, quoteQuery.dataUpdatedAt)
  const quoteMap = useMemo<Record<string, JupiterQuote | undefined>>(
    () => Object.fromEntries(pairs.map((pair, index) => [pair.id, quoteQueries[index]?.data])),
    [pairs, quoteQueries],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      if (event.key === 'p') togglePaused()
      if (event.key === 's' && activePair) swapPair(activePair.id)
      if (event.key === '?') setShortcutOpen(true)
      const index = Number(event.key) - 1
      if (Number.isInteger(index) && pairs[index]) setActivePair(pairs[index].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activePair, pairs, setActivePair, setShortcutOpen, swapPair, togglePaused])

  const snapshot = async () => {
    if (!captureRef.current) return
    const dataUrl = await toPng(captureRef.current, { width: 1200, height: 630, pixelRatio: 1, backgroundColor: '#0a0a0b' })
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = 'jupiter-quote.png'
    link.click()
  }

  if (!activePair) {
    return (
      <Shell updatedAt={0} isFetching={false} tabs={<PairTabs tokens={tokens} quotes={{}} onAdd={() => setDialogOpen(true)} />}>
        <main className="empty-main">
          <button className="primary-button" type="button" onClick={() => setDialogOpen(true)}>
            ADD PAIR
          </button>
        </main>
        <AddPairDialog open={dialogOpen} tokens={tokenQuery.data ?? []} onClose={() => setDialogOpen(false)} />
      </Shell>
    )
  }

  const input = tokens.get(activePair.inputMint)
  const output = tokens.get(activePair.outputMint)

  return (
    <Shell
      updatedAt={quoteQuery.dataUpdatedAt}
      timeTaken={quoteQuery.data?.timeTaken}
      isFetching={quoteQuery.isFetching}
      tabs={<PairTabs tokens={tokens} quotes={quoteMap} onAdd={() => setDialogOpen(true)} />}
    >
      <main className="main-grid">
        <div className="left-stack" ref={captureRef}>
          <QuotePanel
            quote={quoteQuery.data}
            input={input}
            output={output}
            updatedAt={quoteQuery.dataUpdatedAt}
            delta={outDelta}
            isLoading={quoteQuery.isLoading}
            isError={quoteQuery.isError}
            onSnapshot={snapshot}
          />
          <div className="pair-controls">
            <label>
              <span>RAW AMOUNT</span>
              <input value={activePair.amount} inputMode="numeric" onChange={(event) => updatePair(activePair.id, { amount: event.target.value })} />
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={activePair.onlyDirectRoutes}
                onChange={(event) => updatePair(activePair.id, { onlyDirectRoutes: event.target.checked })}
              />
              <span>DIRECT ONLY</span>
            </label>
          </div>
          <RouteGraph quote={quoteQuery.data} tokens={tokens} isLoading={quoteQuery.isLoading} />
        </div>
        <div className="right-stack">
          <ImpactGauge quote={quoteQuery.data} history={impact} />
          <FeeBreakdown quote={quoteQuery.data} tokens={tokens} />
        </div>
      </main>
      <AddPairDialog open={dialogOpen} tokens={tokenQuery.data ?? []} onClose={() => setDialogOpen(false)} />
      <ShortcutOverlay />
    </Shell>
  )
}

export default function App() {
  return <ActiveDashboard />
}
