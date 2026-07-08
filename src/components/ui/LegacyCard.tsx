import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient' | 'bordered'
  hover?: boolean
  glow?: boolean
  glowColor?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    variant = 'default',
    hover = false,
    glow = false,
    glowColor = '#3b82f6',
    className = '',
    ...props
  }, ref) => {
    const baseStyles = 'rounded-2xl transition-all duration-300'

    const variants = {
      default: 'bg-white/5 backdrop-blur-sm border border-white/10',
      glass: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl',
      gradient: 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10',
      bordered: 'bg-transparent border-2 border-white/20'
    }

    const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-2xl hover:border-white/30 cursor-pointer' : ''
    const glowStyle = glow ? { boxShadow: `0 0 30px ${glowColor}40` } : {}

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
        style={glowStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 pb-6 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => (
    <div ref={ref} className={`px-6 pb-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
)

CardFooter.displayName = 'CardFooter'
