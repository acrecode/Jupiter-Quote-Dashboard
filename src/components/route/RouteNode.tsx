import type { TokenInfo } from '@/types/tokens'
import { shortMint } from '@/lib/format'

export function RouteNode({ x, y, token, mint }: { x: number; y: number; token?: TokenInfo; mint: string }) {
  return (
    <g className="route-node" transform={`translate(${x} ${y})`}>
      <circle r="24" />
      {token?.logoURI ? (
        <image href={token.logoURI} x="-16" y="-16" width="32" height="32" clipPath="circle(16px at 16px 16px)" crossOrigin="anonymous" />
      ) : (
        <text textAnchor="middle" dominantBaseline="central">
          {token?.symbol ?? shortMint(mint).slice(0, 4)}
        </text>
      )}
      <text className="node-label" y="42" textAnchor="middle">
        {token?.symbol ?? shortMint(mint)}
      </text>
    </g>
  )
}
