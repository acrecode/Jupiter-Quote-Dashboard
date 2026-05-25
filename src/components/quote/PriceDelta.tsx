import { cn } from '@/lib/cn'

export function PriceDelta({ direction }: { direction: number }) {
  return (
    <span className={cn('delta-chip', direction > 0 && 'up', direction < 0 && 'down')}>
      {direction > 0 ? '▲ UP' : direction < 0 ? '▼ DOWN' : 'STABLE'}
    </span>
  )
}
