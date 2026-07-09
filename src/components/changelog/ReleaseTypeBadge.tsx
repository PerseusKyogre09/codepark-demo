import type { ReleaseType } from '../../lib/changelog/types';

const TYPE_STYLES: Record<ReleaseType, string> = {
  major: 'bg-red-500/15 text-red-200 border-red-500/25',
  minor: 'bg-blue-500/15 text-blue-200 border-blue-500/25',
  patch: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/25',
  hotfix: 'bg-amber-500/15 text-amber-200 border-amber-500/25',
  beta: 'bg-violet-500/15 text-violet-200 border-violet-500/25',
  alpha: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/25',
  preview: 'bg-cyan-500/15 text-cyan-200 border-cyan-500/25',
  stable: 'bg-foreground/10 text-foreground border-border',
};

export function ReleaseTypeBadge({ type }: { type: ReleaseType }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${TYPE_STYLES[type]}`}>
      {type}
    </span>
  );
}

