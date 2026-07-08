import type { LucideIcon } from 'lucide-react'
import { Button } from './LegacyButton'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  accentColor?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  accentColor = '#3b82f6'
}: EmptyStateProps) => {
  return (
    <div className="text-center py-20 px-4 rounded-2xl backdrop-blur-sm border border-white/10 bg-white/5">
      <div 
        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center animate-float"
        style={{ background: `${accentColor}22` }}
      >
        <Icon className="w-10 h-10" style={{ color: accentColor }} />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">
        {title}
      </h3>
      <p className="text-white/60 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          size="lg"
          style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
