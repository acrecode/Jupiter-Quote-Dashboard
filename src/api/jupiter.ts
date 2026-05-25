import { createJupiterApiClient } from '@jup-ag/api'
import type { JupiterQuote, QuoteParams } from '@/types/jupiter'

const client = createJupiterApiClient()

export async function getQuote(params: QuoteParams): Promise<JupiterQuote> {
  const quote = await client.quoteGet({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: Number(params.amount),
    slippageBps: params.slippageBps,
    onlyDirectRoutes: params.onlyDirectRoutes,
  })
  return quote as unknown as JupiterQuote
}
