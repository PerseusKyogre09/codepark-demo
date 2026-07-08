import { useState, useEffect } from "react";
import { Tag, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";

interface Release {
  id: string;
  project: string;
  version: string;
  date: string;
  headline: string;
  notes: string[];
  breaking: boolean;
}

export default function UserReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [project, setProject] = useState("");
  const [version, setVersion] = useState("");
  const [headline, setHeadline] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [breaking, setBreaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUserReleases = () => {
    setLoading(true);
    fetch("/api/releases")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReleases(data);
        } else {
          console.error("Invalid releases data:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user releases:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserReleases();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.trim() || !version.trim() || !headline.trim()) {
      toast.error("Project, version and headline are required");
      return;
    }

    setSubmitting(true);
    const notes = notesInput
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    try {
      const res = await fetch("/api/releases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project,
          version,
          headline,
          notes,
          breaking,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save release");
      }

      toast.success("Release notes published!");
      setIsModalOpen(false);
      // Reset form
      setProject("");
      setVersion("");
      setHeadline("");
      setNotesInput("");
      setBreaking(false);
      fetchUserReleases();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish release");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 md:px-8 h-14 flex items-center justify-between">
        <h1
          className="text-base font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          My Releases
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Tag size={13} />
          New release
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            These are your custom project/workspace release logs. Mark your versions and milestones inside the dashboard.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground font-medium">
            Loading your releases...
          </div>
        ) : releases.length === 0 ? (
          <div className="mt-10 p-8 bg-muted/30 border border-border border-dashed rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              No releases logged yet. Track your version updates here!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <Tag size={13} />
              Log First Release
            </button>
          </div>
        ) : (
          <div className="space-y-5">
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

      {/* Write Release Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Log a New Release
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. atlas"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Version
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. v1.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Headline / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stable release with performance enhancements"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Release Notes (one note per line)
                </label>
                <textarea
                  placeholder="e.g. - Fixed memory leak in websocket stream&#10;- Added dark mode support"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="breaking"
                  checked={breaking}
                  onChange={(e) => setBreaking(e.target.checked)}
                  className="rounded border-border bg-background focus:ring-ring"
                />
                <label htmlFor="breaking" className="text-xs font-semibold text-foreground cursor-pointer">
                  This release contains breaking changes
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:bg-muted transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Publish Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
