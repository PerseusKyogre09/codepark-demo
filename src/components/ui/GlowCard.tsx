import { forwardRef, useState } from 'react'
import type { HTMLAttributes } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

export interface GlowCardProps extends HTMLAttributes<HTMLDivElement> {
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
  backgroundImage?: string
}

export const GlowCard = forwardRef<HTMLDivElement, GlowCardProps>(
  ({
    children,
    glowColor = '#3b82f6',
    intensity = 'medium',
    animated = true,
    className = '',
    ...props
  }, ref) => {
    const { themeColors } = useTheme()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }

    const intensityValues = {
      low: 0.3,
      medium: 0.5,
      high: 0.8
    }

    return (
      <div
        ref={ref}
        className={`relative rounded-2xl overflow-hidden ${className}`}
        onMouseMove={animated ? handleMouseMove : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Glow effect */}
        {animated && isHovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              width: '300px',
              height: '300px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${glowColor}${Math.floor(intensityValues[intensity] * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              opacity: isHovered ? 1 : 0
            }}
          />
        )}

        {/* Static glow for non-animated */}
        {!animated && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowColor}${Math.floor(intensityValues[intensity] * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              filter: 'blur(40px)'
            }}
          />
        )}

        {/* Content */}
        {/* Content */}
        <div
          className="relative z-10 backdrop-blur-sm border rounded-2xl p-4 md:p-6 h-full transition-colors"
          style={{
            background: props.backgroundImage ? 'rgba(0,0,0,0.2)' : themeColors.cardBg,
            borderColor: themeColors.border,
            backdropFilter: props.backgroundImage ? 'blur(4px)' : 'none'
          }}
        >
          {children}
        </div>

        {/* Background Image */}
        {props.backgroundImage && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
              style={{
                backgroundImage: `url(${props.backgroundImage})`,
                opacity: 0.5,
                filter: 'grayscale(10%) contrast(110%)'
              }}
            />
            {/* Gradient Overlay for better text readability */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
            />
          </div>
        )}
      </div>
    )
  }
)

GlowCard.displayName = 'GlowCard'
