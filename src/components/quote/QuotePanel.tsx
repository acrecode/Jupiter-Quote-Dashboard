import { Camera } from 'lucide-react'
import { OutAmount } from './OutAmount'
import { PriceDelta } from './PriceDelta'
import { MetaRow } from './MetaRow'
import { formatUnits, quotePrice } from '@/lib/format'
import type { JupiterQuote } from '@/types/jupiter'
import type { TokenInfo } from '@/types/tokens'

interface Props {
  quote?: JupiterQuote
  input?: TokenInfo
  output?: TokenInfo
  updatedAt: number
  delta: number
  isLoading: boolean
  isError: boolean
  onSnapshot: () => void
}

export function QuotePanel({ quote, input, output, updatedAt, delta, isLoading, isError, onSnapshot }: Props) {
  const price = quote && input && output ? quotePrice(input, output, quote.inAmount, quote.outAmount) : null

  return (
    <section className="panel quote-panel">
      <div className="panel-heading">
        <span>BEST OUT</span>
        <button className="icon-button" type="button" onClick={onSnapshot} title="Export PNG">
          <Camera size={16} />
        </button>
      </div>
      {isError ? <div className="state-line">QUOTE ERROR</div> : null}
      {isLoading && !quote ? <div className="skeleton tall" /> : <OutAmount amount={quote?.outAmount} token={output} updatedAt={updatedAt} />}
      <div className="quote-subrow">
        <div>
          <div>{price && input && output ? `1 ${input.symbol} = ${price.forward.toFixed(6)} ${output.symbol}` : '...'}</div>
          <div>{price && input && output ? `1 ${output.symbol} = ${price.reverse.toFixed(9)} ${input.symbol}` : '...'}</div>
        </div>
        <PriceDelta direction={delta} />
      </div>
      <div className="quote-input">
        IN {quote && input ? `${formatUnits(quote.inAmount, input.decimals, 6)} ${input.symbol}` : '...'}
      </div>
      <MetaRow quote={quote} updatedAt={updatedAt} />
    </section>
  )
}
