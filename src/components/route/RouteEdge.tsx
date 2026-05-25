import { motion } from 'motion/react'
import type { RoutePlanStep } from '@/types/jupiter'
import type { TokenInfo } from '@/types/tokens'
import { formatUnits, tokenSymbol } from '@/lib/format'

interface Props {
  step: RoutePlanStep
  index: number
  x1: number
  x2: number
  y: number
  tokens: Map<string, TokenInfo>
}

export function RouteEdge({ step, index, x1, x2, y, tokens }: Props) {
  const mid = (x1 + x2) / 2
  const d = `M ${x1 + 24} ${y} C ${x1 + 90} ${y - 30}, ${x2 - 90} ${y + 30}, ${x2 - 24} ${y}`
  const feeMint = step.swapInfo.feeMint ?? step.swapInfo.outputMint
  const feeToken = tokens.get(feeMint)
  const fee = step.swapInfo.feeAmount
  const feeLabel = fee ? (feeToken ? `${formatUnits(fee, feeToken.decimals, 6)} ${feeToken.symbol}` : `${fee} ${tokenSymbol(tokens, feeMint)}`) : 'fee n/a'

  return (
    <motion.g
      className="route-edge"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.path
        d={d}
        initial={{ pathLength: 0, filter: 'drop-shadow(0 0 0 rgba(134,239,172,0))' }}
        animate={{ pathLength: 1, filter: ['drop-shadow(0 0 10px rgba(134,239,172,0.8))', 'drop-shadow(0 0 0 rgba(134,239,172,0))'] }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
      />
      <foreignObject x={mid - 72} y={y - 48} width="144" height="54">
        <div className="edge-label">
          <strong>{step.swapInfo.label ?? 'Unknown'}</strong>
          <span>{step.percent !== 100 ? `${step.percent}% split` : 'best path'}</span>
        </div>
      </foreignObject>
      <text className="fee-label" x={mid} y={y + 42} textAnchor="middle">
        {feeLabel}
      </text>
    </motion.g>
  )
}
