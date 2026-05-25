export function ImpactSparkline({ values }: { values: number[] }) {
  const width = 260
  const height = 32
  const max = Math.max(...values, 0.01)
  const points = values
    .map((value, index) => {
      const x = values.length <= 1 ? width : (index / (values.length - 1)) * width
      const y = height - (value / max) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')
  const last = points.split(' ').at(-1)?.split(',').map(Number) ?? [0, height]
  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="currentColor" />
    </svg>
  )
}
