import type { HTMLAttributes } from 'react'

interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  from?: string
  to?: string
  animated?: boolean
}

export const GradientText = ({ 
  children, 
  from = '#3b82f6',
  to = '#8b5cf6',
  animated = false,
  className = '',
  style,
  ...props 
}: GradientTextProps) => {
  return (
    <span
      className={`bg-clip-text text-transparent ${animated ? 'animate-shimmer' : ''} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  )
}
