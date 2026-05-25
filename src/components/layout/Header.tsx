import { Pause, Play } from 'lucide-react'
import { LiveIndicator } from './LiveIndicator'
import { useSettingsStore } from '@/store/settings'

interface Props {
  updatedAt: number
  timeTaken?: number
  isFetching: boolean
}

export function Header({ updatedAt, timeTaken, isFetching }: Props) {
  const paused = useSettingsStore((state) => state.paused)
  const togglePaused = useSettingsStore((state) => state.togglePaused)
  const slippageBps = useSettingsStore((state) => state.slippageBps)
  const setSlippageBps = useSettingsStore((state) => state.setSlippageBps)

  return (
    <header className="header">
      <div className="wordmark">JUPITER QUOTE</div>
      <LiveIndicator updatedAt={updatedAt} timeTaken={timeTaken} isFetching={isFetching} />
      <div className="settings-cluster">
        <button className="icon-button" type="button" onClick={togglePaused} title={paused ? 'Resume polling' : 'Pause polling'}>
          {paused ? <Play size={16} /> : <Pause size={16} />}
        </button>
        <label className="slippage">
          <span>SLIP</span>
          <input
            value={(slippageBps / 100).toString()}
            inputMode="decimal"
            onChange={(event) => setSlippageBps(Math.round(Number(event.target.value) * 100))}
            aria-label="Slippage percent"
          />
          <span>%</span>
        </label>
      </div>
    </header>
  )
}
