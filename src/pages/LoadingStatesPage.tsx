import * as React from "react";

function Skeleton({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`bg-muted rounded animate-pulse ${className}`}
      aria-hidden="true"
      {...props}
    />
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="size-2.5 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <Skeleton className="h-3 w-full mb-1.5" />
      <Skeleton className="h-3 w-3/4 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg">
      <Skeleton className="size-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2.5 w-16 mt-1" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start gap-5 mb-5">
        <Skeleton className="size-14 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <Skeleton className="h-3 w-24 mb-3" />
        <div className="flex gap-2 flex-wrap">
          {[60, 80, 40, 70, 55, 65].map((w) => (
            <Skeleton key={w} className="h-6 rounded-md" style={{ width: w }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Greeting */}
      <Skeleton className="h-5 w-48" />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5">
            <Skeleton className="h-3 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-3 w-48 mb-6" />
      <Skeleton className="h-8 w-64 mb-6" />
      <Skeleton className="h-20 w-full rounded-lg mb-5" />
      {[100, 80, 95, 70, 100, 75, 90].map((w, i) => (
        <Skeleton key={i} className="h-3" style={{ width: `${w}%` }} />
      ))}
    </div>
  );
}

export default function LoadingStatesPage() {
  const SECTIONS = [
    { title: "Project card", component: <div className="grid grid-cols-2 gap-3"><ProjectCardSkeleton /><ProjectCardSkeleton /></div> },
    { title: "Notifications", component: <div className="bg-card border border-border rounded-lg py-2"><NotificationSkeleton /><NotificationSkeleton /><NotificationSkeleton /></div> },
    { title: "Profile", component: <ProfileSkeleton /> },
    { title: "Dashboard", component: <DashboardSkeleton /> },
    { title: "Documentation article", component: <DocsPageSkeleton /> },
  ];

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Loading States
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Skeletons use subtle animation to signal activity without being disruptive. No aggressive spinners.
        </p>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                {section.title}
              </p>
              {section.component}
            </div>
          ))}
        </div>

        {/* Loading text examples */}
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Loading copy
          </p>
          <div className="space-y-2">
            {[
              "Preparing your workspace…",
              "Loading your projects…",
              "Connecting to session…",
              "Indexing your codebase…",
              "Fetching recent activity…",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg border border-border">
                <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
