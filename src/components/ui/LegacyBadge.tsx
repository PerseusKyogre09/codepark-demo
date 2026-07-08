import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    children, 
    variant = 'default', 
    size = 'md',
    dot = false,
    pulse = false,
    className = '',
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200'
    
    const variants = {
      default: 'bg-white/10 text-white border border-white/20',
      success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      gradient: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
    }
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base'
    }
    
    const dotColors = {
      default: 'bg-white',
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      danger: 'bg-red-400',
      info: 'bg-blue-400',
      gradient: 'bg-purple-400'
    }
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {dot && (
          <span className={`w-2 h-2 rounded-full ${dotColors[variant]} ${pulse ? 'animate-pulse' : ''}`} />
        )}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
