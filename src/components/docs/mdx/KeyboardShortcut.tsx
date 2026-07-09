import { cn } from '../../ui/utils';

interface KeyboardShortcutProps {
  /** e.g. "Ctrl+Shift+P" or ["Ctrl", "Shift", "P"] */
  keys: string | string[];
  description?: string;
}

export function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  const keyList = Array.isArray(keys)
    ? keys
    : keys.split('+').map(k => k.trim());

  return (
    <span className={cn('inline-flex items-center gap-1', description && 'gap-2')}>
      <span className="inline-flex items-center gap-0.5">
        {keyList.map((key, i) => (
          <kbd
            key={i}
            className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded border border-border bg-muted text-[11px] font-mono font-medium text-foreground shadow-[0_1px_0_0] shadow-border"
          >
            {key}
          </kbd>
        ))}
      </span>
      {description && (
        <span className="text-sm text-muted-foreground">{description}</span>
      )}
    </span>
  );
}
