import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const SOL = 'So11111111111111111111111111111111111111112'
export const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
export const JUP = 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN'

export interface PairConfig {
  id: string
  inputMint: string
  outputMint: string
  amount: string
  onlyDirectRoutes: boolean
}

interface PairStore {
  pairs: PairConfig[]
  activePairId: string
  setActivePair: (id: string) => void
  addPair: (pair: PairConfig) => void
  removePair: (id: string) => void
  updatePair: (id: string, patch: Partial<PairConfig>) => void
  swapPair: (id: string) => void
}

const defaults: PairConfig[] = [
  { id: 'sol-usdc', inputMint: SOL, outputMint: USDC, amount: '1000000000', onlyDirectRoutes: false },
  { id: 'usdc-sol', inputMint: USDC, outputMint: SOL, amount: '100000000', onlyDirectRoutes: false },
  { id: 'sol-jup', inputMint: SOL, outputMint: JUP, amount: '1000000000', onlyDirectRoutes: false },
]

export const usePairStore = create<PairStore>()(
  persist(
    (set) => ({
      pairs: defaults,
      activePairId: defaults[0].id,
      setActivePair: (id) => set({ activePairId: id }),
      addPair: (pair) => set((state) => ({ pairs: [...state.pairs.slice(0, 3), pair], activePairId: pair.id })),
      removePair: (id) =>
        set((state) => {
          const pairs = state.pairs.filter((pair) => pair.id !== id)
          return { pairs, activePairId: pairs[0]?.id ?? '' }
        }),
      updatePair: (id, patch) => set((state) => ({ pairs: state.pairs.map((pair) => (pair.id === id ? { ...pair, ...patch } : pair)) })),
      swapPair: (id) =>
        set((state) => ({
          pairs: state.pairs.map((pair) =>
            pair.id === id ? { ...pair, inputMint: pair.outputMint, outputMint: pair.inputMint } : pair,
          ),
        })),
    }),
    { name: 'jupiter-dashboard-pairs' },
  ),
)
