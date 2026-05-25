import { motion } from 'motion/react'
import { formatUnits } from '@/lib/format'
import type { TokenInfo } from '@/types/tokens'

export function OutAmount({ amount, token, updatedAt }: { amount?: string; token?: TokenInfo; updatedAt: number }) {
  return (
    <motion.div
      key={updatedAt}
      className="out-amount"
      animate={{ backgroundColor: ['rgba(134,239,172,0.2)', 'rgba(134,239,172,0)'] }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <span>{amount && token ? formatUnits(amount, token.decimals, 6) : '...'}</span>
      <small>{token?.symbol ?? ''}</small>
    </motion.div>
  )
}
