import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search, ChevronRight, ChevronDown, ExternalLink } from "lucide-react";
const DOC_SECTIONS = [
  {
    title: "Getting Started",
    items: ["Introduction", "Quick Start", "Installation", "Core Concepts"],
  },
  {
    title: "Environments",
    items: ["Creating an Environment", "Templates", "Configuration", "Persistence"],
  },
  {
    title: "Collaboration",
    items: ["Pair Programming", "Session Management", "Presence", "Line Comments"],
  },
  {
    title: "ContextBase",
    items: ["Overview", "Indexing Your Project", "Querying", "Privacy"],
  },
  {
    title: "Integrations",
    items: ["GitHub", "GitLab", "Slack", "Webhooks"],
  },
];

const ARTICLE = {
  title: "Pair Programming",
  breadcrumb: ["Collaboration", "Pair Programming"],
  content: [
    {
      type: "intro",
      text: "CodePark's pair programming lets you and a teammate share the same environment in real time — same editor, same terminal, same context. No screen-sharing software, no lag, no \"can you push that branch\" interruptions.",
    },
    {
      type: "h2",
      text: "Starting a session",
    },
    {
      type: "p",
      text: "From any project, open the Collaboration panel in the sidebar. Click Invite — you'll get a link you can share directly, or a short session code your teammate can enter from their dashboard.",
    },
    {
      type: "code",
      lang: "bash",
      text: "# Or use the CLI\ncodepark session start --project atlas\n# → Session ready: cp://sess/aX9mK2",
    },
    {
      type: "h2",
      text: "What your teammate sees",
    },
    {
      type: "p",
      text: "When they join, they see your environment exactly as you left it. Their cursor appears in the editor — a soft colored pill with their name. You'll see theirs too. Cursors fade to small dots after a moment of stillness, so they don't distract from reading.",
    },
    {
      type: "h2",
      text: "Shared terminal",
    },
    {
      type: "p",
      text: "By default, terminal sessions are individual. To share a terminal — useful for watching a build together, or walking through a deployment — right-click on the terminal tab and choose Share with session.",
    },
    {
      type: "note",
      text: "Both participants need write permission on the project to type into a shared terminal. Read-only collaborators can watch but not interact.",
    },
    {
      type: "h2",
      text: "Line comments",
    },
    {
      type: "p",
      text: "Hover over any line number and click the comment icon that appears in the gutter. Your comment threads are attached to that line range and stay as long as the session is open. Resolved threads are archived in the session log.",
    },
  ],
};

export default function DocsPage() {
  const [openSection, setOpenSection] = useState<string>("Collaboration");
  const [activeItem, setActiveItem] = useState("Pair Programming");
  const [query, setQuery] = useState("");
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-full bg-background flex">

      {/* Mobile section picker — replaces sidebar on small screens */}
      <div className={`md:hidden sticky z-10 bg-background/90 backdrop-blur-sm border-b border-border px-4 py-2.5 w-full ${
        isDashboard ? "top-0" : "top-14"
      }`}>
        <select
          value={activeItem}
          onChange={(e) => setActiveItem(e.target.value)}
          className="w-full bg-background border border-border rounded-md text-sm text-foreground py-2 px-3 outline-none focus:ring-2 focus:ring-ring"
          aria-label="Navigate documentation"
        >
          {DOC_SECTIONS.map((section) => (
            <optgroup key={section.title} label={section.title}>
              {section.items.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Docs sidebar — hidden on mobile */}
      <aside className={`hidden md:block w-56 shrink-0 border-r border-border bg-surface sticky overflow-y-auto ${
        isDashboard ? "top-0 h-screen" : "top-14 h-[calc(100vh-3.5rem)]"
      }`}>
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search docs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-background border border-border rounded-md text-xs text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <nav className="p-3">
          {DOC_SECTIONS.map((section) => {
            const open = openSection === section.title;
            return (
              <div key={section.title} className="mb-1">
                <button
                  onClick={() => setOpenSection(open ? "" : section.title)}
                  className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-foreground hover:bg-muted rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {section.title}
                  {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                {open && (
                  <ul className="ml-2 mt-0.5 space-y-0.5">
                    {section.items.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => setActiveItem(item)}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            activeItem === item
                              ? "text-primary font-medium bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Article */}
      <main className="flex-1 min-w-0 max-w-2xl mx-auto px-4 md:px-10 py-6 md:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <span>Docs</span>
          {ARTICLE.breadcrumb.map((crumb) => (
            <span key={crumb} className="flex items-center gap-1">
              <ChevronRight size={11} />
              <span className={crumb === ARTICLE.breadcrumb.at(-1) ? "text-foreground" : ""}>{crumb}</span>
            </span>
          ))}
        </nav>

        <h1
          className="text-3xl font-semibold text-foreground mb-8 leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {ARTICLE.title}
        </h1>

        <div className="prose-cp space-y-5">
          {ARTICLE.content.map((block, i) => {
            if (block.type === "intro") {
              return (
                <p key={i} className="text-base text-foreground/90 leading-relaxed border-l-2 border-primary pl-4 text-[15px]">
                  {block.text}
                </p>
              );
            }
            if (block.type === "h2") {
              return (
                <h2
                  key={i}
                  className="text-xl font-semibold text-foreground mt-10 mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {block.text}
                </h2>
              );
            }
            if (block.type === "p") {
              return (
                <p key={i} className="text-[15px] text-foreground/80 leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "code") {
              return (
                <div key={i} className="bg-muted border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <span className="text-xs text-muted-foreground font-mono">{block.lang}</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Copy</button>
                  </div>
                  <pre className="px-4 py-3 text-xs overflow-x-auto" style={{ fontFamily: "var(--font-mono)" }}>
                    <code className="text-foreground">{block.text}</code>
                  </pre>
                </div>
              );
            }
            if (block.type === "note") {
              return (
                <div key={i} className="flex gap-3 p-4 bg-info/5 border border-info/20 rounded-lg">
                  <span className="text-info text-sm shrink-0 mt-0.5">ℹ</span>
                  <p className="text-sm text-foreground/80 leading-relaxed">{block.text}</p>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Next steps */}
        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Next steps</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Session Management", "Presence"].map((next) => (
              <button
                key={next}
                onClick={() => setActiveItem(next)}
                className="flex items-center justify-between text-left p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-muted transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{next}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Collaboration</p>
                </div>
                <ExternalLink size={13} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
