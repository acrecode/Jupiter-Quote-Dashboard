import { Plus } from 'lucide-react'
import { formatUnits, tokenSymbol } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { JupiterQuote } from '@/types/jupiter'
import type { TokenInfo } from '@/types/tokens'
import { usePairStore } from '@/store/pairs'

interface Props {
  tokens: Map<string, TokenInfo>
  quotes: Record<string, JupiterQuote | undefined>
  onAdd: () => void
}

export function PairTabs({ tokens, quotes, onAdd }: Props) {
  const pairs = usePairStore((state) => state.pairs)
  const activePairId = usePairStore((state) => state.activePairId)
  const setActivePair = usePairStore((state) => state.setActivePair)

  return (
    <div className="pair-tabs">
      {pairs.map((pair) => {
        const output = tokens.get(pair.outputMint)
        const quote = quotes[pair.id]
        return (
          <button
            key={pair.id}
            className={cn('pair-tab', activePairId === pair.id && 'active')}
            type="button"
            onClick={() => setActivePair(pair.id)}
          >
            <span>
              {tokenSymbol(tokens, pair.inputMint)} {'->'} {tokenSymbol(tokens, pair.outputMint)}
            </span>
            <small>{quote && output ? formatUnits(quote.outAmount, output.decimals, 4) : '...'}</small>
          </button>
        )
      })}
      <button className="pair-add" type="button" onClick={onAdd} title="Add pair" disabled={pairs.length >= 4}>
        <Plus size={16} />
      </button>
    </div>
  )
}
