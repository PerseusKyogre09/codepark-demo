import { cn } from '../../ui/utils';

type BadgeVariant = 'new' | 'beta' | 'deprecated' | 'experimental' | 'pro' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  new: 'bg-success/15 text-success border-success/30',
  beta: 'bg-info/15 text-info border-info/30',
  deprecated: 'bg-error/15 text-error border-error/30',
  experimental: 'bg-warning/15 text-warning border-warning/30',
  pro: 'bg-primary/15 text-primary border-primary/30',
  default: 'bg-muted text-muted-foreground border-border',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wide',
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
    </span>
  );
}
