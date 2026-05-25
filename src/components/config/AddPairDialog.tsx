import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { parseUnits, tokenSymbol } from '@/lib/format'
import { usePairStore } from '@/store/pairs'
import type { TokenInfo } from '@/types/tokens'

interface Props {
  open: boolean
  tokens: TokenInfo[]
  onClose: () => void
}

function TokenSearch({ label, tokens, value, onChange }: { label: string; tokens: TokenInfo[]; value: string; onChange: (mint: string) => void }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const lower = query.toLowerCase()
    return tokens
      .filter((token) => `${token.symbol} ${token.name} ${token.address}`.toLowerCase().includes(lower))
      .slice(0, 20)
  }, [query, tokens])

  return (
    <label className="field">
      <span>{label}</span>
      <input value={query || tokenSymbol(new Map(tokens.map((token) => [token.address, token])), value)} onChange={(event) => setQuery(event.target.value)} />
      {query && (
        <div className="token-menu">
          {filtered.map((token) => (
            <button
              key={token.address}
              type="button"
              onClick={() => {
                onChange(token.address)
                setQuery('')
              }}
            >
              <span>{token.symbol}</span>
              <small>{token.name}</small>
            </button>
          ))}
        </div>
      )}
    </label>
  )
}

export function AddPairDialog({ open, tokens, onClose }: Props) {
  const addPair = usePairStore((state) => state.addPair)
  const [inputMint, setInputMint] = useState(tokens[0]?.address ?? '')
  const [outputMint, setOutputMint] = useState(tokens[1]?.address ?? '')
  const [amount, setAmount] = useState('1')

  if (!open) return null
  const input = tokens.find((token) => token.address === inputMint)

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <form
        className="dialog"
        onSubmit={(event) => {
          event.preventDefault()
          if (!input || !outputMint || inputMint === outputMint) return
          addPair({
            id: `${inputMint.slice(0, 4)}-${outputMint.slice(0, 4)}-${Date.now()}`,
            inputMint,
            outputMint,
            amount: parseUnits(amount, input.decimals),
            onlyDirectRoutes: false,
          })
          onClose()
        }}
      >
        <div className="dialog-title">
          <span>ADD PAIR</span>
          <button className="icon-button" type="button" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>
        <TokenSearch label="INPUT" tokens={tokens} value={inputMint} onChange={setInputMint} />
        <TokenSearch label="OUTPUT" tokens={tokens} value={outputMint} onChange={setOutputMint} />
        <label className="field">
          <span>AMOUNT</span>
          <input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">
          ADD
        </button>
      </form>
    </div>
  )
}
