import type { LucideIcon } from 'lucide-react'
import { GlowCard } from './GlowCard'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  gradient: string
  animated?: boolean
}

import { useTheme } from '../../contexts/ThemeContext'

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color,
  gradient,
  animated = true
}: FeatureCardProps) => {
  const { themeColors } = useTheme()
  return (
    <GlowCard
      glowColor={color}
      intensity="medium"
      animated={animated}
      className="group cursor-pointer h-full"
    >
      <div className="flex flex-col h-full">
        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-2" style={{ color: themeColors.text }}>
          {title}
        </h3>
        <p className="text-xs md:text-sm leading-relaxed flex-grow" style={{ color: themeColors.textSecondary }}>
          {description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color }}>
          Learn more
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </GlowCard>
  )
}
