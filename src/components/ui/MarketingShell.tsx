import type { ReactNode } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { AnimatedBackground } from './AnimatedBackground'
import DarkVeil, { type DarkVeilProps } from '../DarkVeil'

interface MarketingShellProps {
  children: ReactNode
  maxWidth?: string
  showDarkVeil?: boolean
  darkVeilProps?: DarkVeilProps
}

export function MarketingShell({ children, maxWidth = 'max-w-6xl', showDarkVeil = false, darkVeilProps }: MarketingShellProps) {
  const { settings, themeColors } = useTheme()
  const veilProps: DarkVeilProps = {
    hueShift: 0,
    noiseIntensity: 0,
    scanlineIntensity: 0,
    speed: 0,
    scanlineFrequency: 0,
    warpAmount: 0.95,
    resolutionScale: 1.5,
    ...darkVeilProps,
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: showDarkVeil ? `${themeColors.bg}ee` : themeColors.bg,
        color: themeColors.text,
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: settings.animations ? 'all 0.3s ease' : 'none',
      }}
    >
      {showDarkVeil ? (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
          <DarkVeil {...veilProps} />
        </div>
      ) : (
        <AnimatedBackground variant="gradient" color={settings.accentColor} intensity={0.18} />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 32%), ' +
            'radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04), transparent 28%), ' +
            'radial-gradient(circle at 50% 85%, rgba(0,0,0,0.12), transparent 35%)',
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
        <div className={`${maxWidth} mx-auto`}>{children}</div>
      </div>
    </div>
  )
}

export default MarketingShell
