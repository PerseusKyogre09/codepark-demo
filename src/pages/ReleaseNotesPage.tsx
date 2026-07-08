import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface Release {
  id: string;
  project: string;
  version: string;
  date: string;
  headline: string;
  notes: string[];
  breaking: boolean;
}

export default function ReleaseNotesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/releases/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReleases(data);
        } else {
          console.error("Invalid releases data:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load official releases:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-full bg-background pt-14">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="mb-10 text-center md:text-left">
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Releases & Updates
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Marking product milestones and updates for CodePark services.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Loading releases...
          </div>
        ) : releases.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            No official releases found.
          </div>
        ) : (
          <div className="space-y-6">
            {releases.map((release, i) => (
              <article
                key={release.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-mono text-sm font-semibold text-foreground"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {release.version}
                      </span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                          Latest
                        </span>
                      )}
                      {release.breaking && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-semibold">
                          <AlertTriangle size={9} />
                          Breaking
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{release.project}</span>
                      {" · "}
                      {release.date}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-sm font-medium text-foreground mb-3 leading-snug">
                    {release.headline}
                  </p>
                  <ul className="space-y-2">
                    {release.notes.map((note) => (
                      <li key={note} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={13} className="text-success mt-0.5 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
