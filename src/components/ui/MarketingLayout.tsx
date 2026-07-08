import type { ReactNode } from 'react'
import { MarketingShell } from './MarketingShell'
import type { DarkVeilProps } from '../DarkVeil'

interface MarketingLayoutProps {
  children: ReactNode
  maxWidth?: string
  showDarkVeil?: boolean
  darkVeilProps?: DarkVeilProps
}

export function MarketingLayout({ children, maxWidth, showDarkVeil, darkVeilProps }: MarketingLayoutProps) {
  return (
    <MarketingShell maxWidth={maxWidth} showDarkVeil={showDarkVeil} darkVeilProps={darkVeilProps}>
      <main className="mt-8 space-y-12">{children}</main>
      {/* Footer is now globally handled in App.tsx */}
    </MarketingShell>
  )
}

export default MarketingLayout
