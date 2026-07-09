import type { ReactNode } from 'react';
import { Info, Lightbulb, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { cn } from '../../ui/utils';

type CalloutType = 'note' | 'tip' | 'warning' | 'caution' | 'important';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const CONFIG: Record<CalloutType, {
  icon: typeof Info;
  label: string;
  classes: string;
  iconClass: string;
}> = {
  note: {
    icon: Info,
    label: 'Note',
    classes: 'bg-info/5 border-info/30 text-foreground',
    iconClass: 'text-info',
  },
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    classes: 'bg-success/5 border-success/30 text-foreground',
    iconClass: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    classes: 'bg-warning/5 border-warning/30 text-foreground',
    iconClass: 'text-warning',
  },
  caution: {
    icon: AlertOctagon,
    label: 'Caution',
    classes: 'bg-error/5 border-error/30 text-foreground',
    iconClass: 'text-error',
  },
  important: {
    icon: Flame,
    label: 'Important',
    classes: 'bg-primary/5 border-primary/30 text-foreground',
    iconClass: 'text-primary',
  },
};

/**
 * Renders a styled callout block.
 *
 * Usage in markdown (via custom component mapping):
 * > **Note:** Your note text here.
 *
 * Or as a blockquote starting with **Type:**
 */
export function Callout({ type = 'note', title, children }: CalloutProps) {
  const { icon: Icon, label, classes, iconClass } = CONFIG[type];
  const displayTitle = title ?? label;

  return (
    <div className={cn('my-5 flex gap-3 rounded-lg border p-4', classes)}>
      <Icon size={16} className={cn('mt-0.5 shrink-0', iconClass)} />
      <div className="flex-1 min-w-0 text-[14px] leading-relaxed">
        <p className="font-semibold mb-1 text-sm">{displayTitle}</p>
        <div className="text-foreground/80">{children}</div>
      </div>
    </div>
  );
}

/**
 * Detects GitHub-style blockquote callouts:
 * > [!NOTE]
 * > Content here.
 */
export function parseBlockquoteCallout(text: string): {
  type: CalloutType;
  content: string;
} | null {
  const match = text.match(/^\[!(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]\s*\n?([\s\S]*)/i);
  if (!match) return null;
  return {
    type: match[1].toLowerCase() as CalloutType,
    content: match[2].trim(),
  };
}
