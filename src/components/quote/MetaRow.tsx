import { formatMs } from '@/lib/format'
import type { JupiterQuote } from '@/types/jupiter'

export function MetaRow({ quote, updatedAt }: { quote?: JupiterQuote; updatedAt: number }) {
  const age = updatedAt ? 0 : 0
  return (
    <div className="meta-row">
      <span>slot {quote?.contextSlot ?? '...'}</span>
      <span>{formatMs(quote?.timeTaken)}</span>
      <span>{age}s ago</span>
    </div>
  )
}
