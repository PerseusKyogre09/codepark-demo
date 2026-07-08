import type { HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animated?: boolean
}

export const Skeleton = ({ 
  variant = 'rectangular',
  width,
  height,
  animated = true,
  className = '',
  style,
  ...props 
}: SkeletonProps) => {
  const baseStyles = 'bg-white/5 backdrop-blur-sm'
  const animationStyles = animated ? 'animate-shimmer' : ''
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  }
  
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'text' ? '1rem' : '200px'),
        ...style
      }}
      {...props}
    />
  )
}

export const SkeletonCard = () => (
  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
    <div className="flex items-start gap-4 mb-4">
      <Skeleton variant="circular" width={56} height={56} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
    <Skeleton variant="rectangular" height={40} />
  </div>
)

export const SkeletonProjectCard = () => (
  <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
    <Skeleton variant="rectangular" width="100%" height={1} className="mb-4" />
    <div className="flex items-start justify-between mb-4">
      <Skeleton variant="rectangular" width={56} height={56} />
      <Skeleton variant="circular" width={32} height={32} />
    </div>
    <Skeleton variant="text" width="70%" className="mb-2" />
    <Skeleton variant="text" width="50%" className="mb-4" />
    <div className="flex gap-2 mb-4">
      <Skeleton variant="rectangular" width={60} height={24} />
      <Skeleton variant="rectangular" width={60} height={24} />
    </div>
    <Skeleton variant="rectangular" height={48} />
  </div>
)
