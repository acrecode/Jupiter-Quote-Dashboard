import { AnimatePresence } from 'motion/react'
import { RouteEdge } from './RouteEdge'
import { RouteNode } from './RouteNode'
import type { JupiterQuote } from '@/types/jupiter'
import type { TokenInfo } from '@/types/tokens'

export function RouteGraph({ quote, tokens, isLoading }: { quote?: JupiterQuote; tokens: Map<string, TokenInfo>; isLoading: boolean }) {
  const mints = quote
    ? Array.from(new Set([quote.inputMint, ...quote.routePlan.flatMap((step) => [step.swapInfo.inputMint, step.swapInfo.outputMint]), quote.outputMint]))
    : []
  const width = 780
  const height = 230
  const y = 104
  const gap = mints.length > 1 ? (width - 96) / (mints.length - 1) : 0
  const xForMint = (mint: string) => 48 + Math.max(0, mints.indexOf(mint)) * gap
  const signature = quote?.routePlan.map((step) => `${step.swapInfo.ammKey}-${step.swapInfo.inputMint}-${step.swapInfo.outputMint}`).join('|')

  return (
    <section className="panel route-panel" id="route-graph">
      <div className="panel-heading">
        <span>ROUTE</span>
        <strong>{quote ? `${quote.routePlan.length} HOP${quote.routePlan.length === 1 ? '' : 'S'}` : '...'}</strong>
      </div>
      {isLoading && !quote ? (
        <div className="skeleton graph" />
      ) : quote ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="route-svg" role="img" aria-label="Jupiter route graph">
          <AnimatePresence mode="popLayout">
            {quote.routePlan.map((step, index) => (
              <RouteEdge
                key={`${signature}-${index}`}
                step={step}
                index={index}
                x1={xForMint(step.swapInfo.inputMint)}
                x2={xForMint(step.swapInfo.outputMint)}
                y={y}
                tokens={tokens}
              />
            ))}
          </AnimatePresence>
          {mints.map((mint) => (
            <RouteNode key={mint} x={xForMint(mint)} y={y} mint={mint} token={tokens.get(mint)} />
          ))}
        </svg>
      ) : (
        <div className="state-line">NO ROUTE</div>
      )}
    </section>
  )
}
