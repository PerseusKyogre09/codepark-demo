import { useState, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
import { Avatar } from "../components/cp/Avatar";

interface Devlog {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  tags: string[];
  read_time: string;
}

export default function DevlogPage() {
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/devlogs/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDevlogs(data);
        } else {
          console.error("Invalid devlogs data:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load official devlogs:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-full bg-background pt-14">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Intro */}
        <div className="mb-10 text-center md:text-left">
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CodePark Devlogs
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Notes and insights from the team building CodePark — engineering breakthroughs, design choices, and system updates.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Loading devlogs...
          </div>
        ) : devlogs.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            No official devlogs found.
          </div>
        ) : (
          <div className="space-y-6">
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
    </div>
  );
}
