import { useState, useEffect } from "react";
import { Clock, ArrowRight, Pen, X } from "lucide-react";
import { Avatar } from "../components/cp/Avatar";
import { toast } from "sonner";

interface Devlog {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
  read_time: string;
}

export default function UserDevlogsPage() {
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUserDevlogs = (showSpinner = true) => {
    if (showSpinner) {
      setLoading(true);
    }
    fetch("/api/devlogs")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDevlogs(data);
        } else {
          console.error("Invalid devlogs data:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user devlogs:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserDevlogs(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim()) {
      toast.error("Title and Excerpt are required");
      return;
    }

    setSubmitting(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch("/api/devlogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          tags,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save devlog");
      }

      toast.success("Devlog published successfully!");
      setIsModalOpen(false);
      // Reset form
      setTitle("");
      setExcerpt("");
      setContent("");
      setTagsInput("");
      fetchUserDevlogs(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish devlog");
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
          My Devlogs
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Pen size={13} />
          Write a devlog
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed">
            These are your custom team/personal devlogs. They are only visible inside your dashboard context.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground font-medium">
            Loading your devlogs...
          </div>
        ) : devlogs.length === 0 ? (
          <div className="mt-10 p-8 bg-muted/30 border border-border border-dashed rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              You haven't written any devlogs yet. Share your engineering insights with your team!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              <Pen size={13} />
              Start writing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {devlogs.map((log) => (
              <article
                key={log.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <Avatar name={log.author} size="md" className="mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {log.title}
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>{log.author}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {log.date}
                      </span>
                      <span>·</span>
                      <span>{log.read_time} read</span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {log.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {log.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-muted border border-border text-[11px] text-muted-foreground font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Write Devlog Modal */}
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
              Write a Devlog
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Optimizing our AST parser"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Short Excerpt
                </label>
                <textarea
                  placeholder="Briefly describe what this devlog covers..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Content
                </label>
                <textarea
                  placeholder="Detail the challenges, engineering solutions, and code snippets..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. backend, parser, performance"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
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
                  {submitting ? "Publishing..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
