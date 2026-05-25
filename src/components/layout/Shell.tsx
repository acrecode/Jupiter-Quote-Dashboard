import type { ReactNode } from 'react'
import { Header } from './Header'

interface Props {
  updatedAt: number
  timeTaken?: number
  isFetching: boolean
  tabs: ReactNode
  children: ReactNode
}

export function Shell({ updatedAt, timeTaken, isFetching, tabs, children }: Props) {
  return (
    <div className="shell">
      <Header updatedAt={updatedAt} timeTaken={timeTaken} isFetching={isFetching} />
      {tabs}
      {children}
      <footer>endpoint https://lite-api.jup.ag/swap/v1/quote · cadence 1000ms · free lite tier</footer>
    </div>
  )
}
