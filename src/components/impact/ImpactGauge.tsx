import { ImpactSparkline } from './ImpactSparkline'
import { cn } from '@/lib/cn'
import { formatPct } from '@/lib/format'
import type { JupiterQuote } from '@/types/jupiter'

export function ImpactGauge({ quote, history }: { quote?: JupiterQuote; history: number[] }) {
  const pct = Number(quote?.priceImpactPct ?? 0) * 100
  const level = pct < 0.1 ? 'low' : pct < 1 ? 'warn' : 'high'
  return (
    <section className="panel">
      <div className="panel-heading">
        <span>PRICE IMPACT</span>
        <strong>{formatPct(quote?.priceImpactPct ?? 0)}</strong>
      </div>
      <div className="impact-row">
        <div className="impact-track">
          <div className={cn('impact-fill', level)} style={{ width: `${Math.min(100, pct * 20)}%` }} />
        </div>
      </div>
      <ImpactSparkline values={history.length ? history : [0]} />
    </section>
  )
}
