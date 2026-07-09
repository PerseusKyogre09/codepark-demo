import type { ReactNode } from 'react';

interface Feature {
  icon?: ReactNode;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3;
}

export function FeatureGrid({ features, columns = 2 }: FeatureGridProps) {
  return (
    <div
      className={`my-5 grid gap-3 ${
        columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
      }`}
    >
      {features.map((feature, i) => (
        <div
          key={i}
          className="flex gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
        >
          {feature.icon && (
            <div className="shrink-0 text-primary mt-0.5">{feature.icon}</div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              {feature.title}
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
