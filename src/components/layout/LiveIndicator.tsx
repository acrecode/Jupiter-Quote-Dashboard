import { motion } from 'motion/react'
import { formatMs } from '@/lib/format'

interface Props {
  updatedAt: number
  timeTaken?: number
  isFetching: boolean
}

export function LiveIndicator({ updatedAt, timeTaken, isFetching }: Props) {
  const age = updatedAt ? 0 : null
  return (
    <div className="live-indicator">
      <motion.span
        key={updatedAt}
        className="live-dot"
        animate={{ opacity: [0.45, 1, 0.55], scale: [1, 1.8, 1] }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
      <span>{isFetching ? 'syncing' : 'live'}</span>
      <span>{age === null ? 'waiting' : `${age}s ago`}</span>
      <span>{formatMs(timeTaken)}</span>
    </div>
  )
}
