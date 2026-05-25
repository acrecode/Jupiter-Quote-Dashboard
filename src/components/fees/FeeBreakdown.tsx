import { formatUnits, tokenSymbol } from '@/lib/format'
import type { JupiterQuote } from '@/types/jupiter'
import type { TokenInfo } from '@/types/tokens'

export function FeeBreakdown({ quote, tokens }: { quote?: JupiterQuote; tokens: Map<string, TokenInfo> }) {
  const totalFees = quote?.routePlan.reduce((sum, step) => sum + BigInt(step.swapInfo.feeAmount ?? '0'), 0n) ?? 0n
  return (
    <section className="panel fee-panel">
      <div className="panel-heading">
        <span>FEES</span>
        <strong>{quote?.routePlan.length ?? 0} HOPS</strong>
      </div>
      <table>
        <thead>
          <tr>
            <th>DEX</th>
            <th>HOP</th>
            <th>FEE</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {quote?.routePlan.map((step, index) => {
            const feeMint = step.swapInfo.feeMint ?? step.swapInfo.outputMint
            const token = tokens.get(feeMint)
            const fee = step.swapInfo.feeAmount ?? '0'
            const feePct = Number(step.swapInfo.inAmount) ? (Number(fee) / Number(step.swapInfo.inAmount)) * 100 : 0
            return (
              <tr key={`${step.swapInfo.ammKey}-${index}`}>
                <td>{step.swapInfo.label ?? 'Unknown'}</td>
                <td>{index + 1}</td>
                <td>{token ? `${formatUnits(fee, token.decimals, 6)} ${token.symbol}` : `${fee} ${tokenSymbol(tokens, feeMint)}`}</td>
                <td>{feePct.toFixed(4)}%</td>
              </tr>
            )
          })}
          <tr className="aggregate">
            <td>Aggregate</td>
            <td>{quote?.routePlan.length ?? 0}</td>
            <td>{totalFees.toString()}</td>
            <td>--</td>
          </tr>
          {quote?.platformFee && quote.platformFee.feeBps > 0 ? (
            <tr className="muted-row">
              <td>Platform</td>
              <td>--</td>
              <td>{quote.platformFee.amount}</td>
              <td>{(quote.platformFee.feeBps / 100).toFixed(2)}%</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  )
}
