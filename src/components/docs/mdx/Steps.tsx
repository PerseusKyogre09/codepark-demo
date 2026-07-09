import type { ReactNode } from 'react';

interface Step {
  title: string;
  description?: string;
  children?: ReactNode;
}

interface StepsProps {
  steps: Step[];
}

export function Steps({ steps }: StepsProps) {
  return (
    <ol className="my-5 space-y-0 relative">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4 relative">
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div className="absolute left-[15px] top-9 bottom-0 w-px bg-border" />
          )}
          {/* Step number */}
          <div className="shrink-0 w-8 h-8 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center text-xs font-bold text-primary z-10">
            {i + 1}
          </div>
          {/* Content */}
          <div className="pb-6 flex-1 min-w-0">
            <p className="font-semibold text-foreground text-sm mb-1">{step.title}</p>
            {step.description && (
              <p className="text-sm text-muted-foreground">{step.description}</p>
            )}
            {step.children && (
              <div className="mt-2">{step.children}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
