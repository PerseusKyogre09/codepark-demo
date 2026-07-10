import { useState } from "react";
import {
    Search,
    Star,
    GitFork,
    Rocket,
    CheckCircle2,
    ArrowRight,
    Shield,
    Sparkles,
    TrendingUp,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const TEMPLATES = [
    {
        id: "blank",
        name: "Blank",
        emoji: "⬜",
        color: "#313833",
        desc: "Empty workspace. Start from scratch with your own setup.",
        tags: ["general"],
    },
    {
        id: "nextjs",
        name: "Next.js",
        emoji: "⬡",
        color: "#3178C6",
        desc: "App Router, TypeScript, Tailwind CSS, and ESLint pre-configured.",
        tags: ["typescript", "react", "node"],
    },
    {
        id: "fastapi",
        name: "FastAPI",
        emoji: "⚡",
        color: "#CE422B",
        desc: "Async Python API with OpenAPI docs and hot-reload.",
        tags: ["python", "api"],
    },
    {
        id: "flask",
        name: "Flask",
        emoji: "🐍",
        color: "#3572A5",
        desc: "Lightweight Python web framework with Jinja2 templates.",
        tags: ["python", "web"],
    },
    {
        id: "react-vite",
        name: "React + Vite",
        emoji: "⚛️",
        color: "#61DAFB",
        desc: "React 18 with Vite, TypeScript, and fast HMR.",
        tags: ["react", "typescript", "frontend"],
    },
    {
        id: "vue3",
        name: "Vue 3",
        emoji: "💚",
        color: "#42B883",
        desc: "Vue 3 with Composition API, Vite, and TypeScript.",
        tags: ["vue", "typescript", "frontend"],
    },
    {
        id: "unity",
        name: "Unity",
        emoji: "🎮",
        color: "#4A4A4A",
        desc: "Game development workspace with Unity Editor integration.",
        tags: ["gamedev", "csharp"],
    },
    {
        id: "rust-cli",
        name: "Rust CLI",
        emoji: "🦀",
        color: "#C0624A",
        desc: "Cargo workspace with clap, CI, and release automation.",
        tags: ["rust", "cli"],
    },
    {
        id: "go-service",
        name: "Go Service",
        emoji: "◎",
        color: "#00ADD8",
        desc: "HTTP microservice with structured logging and health checks.",
        tags: ["go", "backend"],
    },
    {
        id: "python-ml",
        name: "Python ML",
        emoji: "🧪",
        color: "#D4A84B",
        desc: "GPU-ready ML environment with Jupyter, NumPy, and PyTorch.",
        tags: ["python", "ml", "jupyter"],
    },
];

const BLUEPRINTS = [
    {
        id: "np",
        name: "Next.js + Postgres",
        desc: "Full-stack with auth, Prisma ORM, and CI/CD pipeline.",
        runtime: "Node 20",
        runtimeColor: "#3178C6",
        creator: "alexchen",
        verified: true,
        launches: 2400,
        stars: 312,
        forks: 89,
        tags: ["fullstack", "typescript", "postgres"],
        featured: true,
    },
    {
        id: "fp",
        name: "FastAPI + Redis",
        desc: "Python async API with Redis caching and OpenAPI docs.",
        runtime: "Python 3.11",
        runtimeColor: "#CE422B",
        creator: "mirasantos",
        verified: true,
        launches: 1800,
        stars: 201,
        forks: 62,
        tags: ["api", "python", "redis"],
        featured: true,
    },
    {
        id: "ml",
        name: "PyTorch ML",
        desc: "GPU-ready ML environment with Jupyter and common libraries.",
        runtime: "Python + CUDA",
        runtimeColor: "#D4A84B",
        creator: "official",
        verified: true,
        launches: 3200,
        stars: 445,
        forks: 120,
        tags: ["ml", "pytorch", "gpu"],
        featured: false,
    },
    {
        id: "rc",
        name: "Rust CLI",
        desc: "Cargo workspace with CI, linting, and release automation.",
        runtime: "Rust 1.75",
        runtimeColor: "#C0624A",
        creator: "tombekele",
        verified: false,
        launches: 940,
        stars: 88,
        forks: 23,
        tags: ["cli", "rust"],
        featured: false,
    },
    {
        id: "gm",
        name: "Go Microservice",
        desc: "Minimal HTTP service with structured logging and health checks.",
        runtime: "Go 1.22",
        runtimeColor: "#00ADD8",
        creator: "official",
        verified: true,
        launches: 1100,
        stars: 143,
        forks: 41,
        tags: ["go", "microservice"],
        featured: false,
    },
    {
        id: "dj",
        name: "Django + PostgreSQL",
        desc: "Production-ready Django with migrations and admin interface.",
        runtime: "Python 3.11",
        runtimeColor: "#3572A5",
        creator: "official",
        verified: true,
        launches: 1560,
        stars: 178,
        forks: 53,
        tags: ["django", "python", "postgres"],
        featured: false,
    },
    {
        id: "sv",
        name: "SvelteKit",
        desc: "Full-stack Svelte with TypeScript and server-side rendering.",
        runtime: "Node 20",
        runtimeColor: "#FF3E00",
        creator: "community",
        verified: false,
        launches: 680,
        stars: 54,
        forks: 18,
        tags: ["svelte", "fullstack"],
        featured: false,
    },
    {
        id: "el",
        name: "Elixir Phoenix",
        desc: "Real-time app with LiveView, PubSub, and channels.",
        runtime: "Elixir 1.15",
        runtimeColor: "#6E4AFF",
        creator: "community",
        verified: false,
        launches: 420,
        stars: 38,
        forks: 12,
        tags: ["elixir", "phoenix", "realtime"],
        featured: false,
    },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TagChip({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface border border-border text-muted-foreground">
            {label}
        </span>
    );
}

function OfficialBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
            <Shield className="w-2.5 h-2.5" />
            Official
        </span>
    );
}

function SoonBadge() {
    return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-surface border border-border text-muted-foreground uppercase tracking-wider">
            Soon
        </span>
    );
}

// ─── Template Card ────────────────────────────────────────────────────────────

function TemplateCard({
    template,
    onUse,
}: {
    template: (typeof TEMPLATES)[0];
    onUse: () => void;
}) {
    return (
        <div className="group flex flex-col gap-4 p-5 rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-surface-elevated transition-all cursor-default">
            <div className="flex items-start justify-between gap-3">
                <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: template.color + "22", border: `1px solid ${template.color}33` }}
                >
                    {template.emoji}
                </div>
                <OfficialBadge />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
                <h3
                    className="text-sm font-semibold text-white leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    {template.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{template.desc}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {template.tags.map((t) => (
                    <TagChip key={t} label={t} />
                ))}
            </div>

            <button
                onClick={onUse}
                className="mt-auto w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-surface-elevated border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
                Use in New Project
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

// ─── Blueprint Featured Card ──────────────────────────────────────────────────

function BlueprintFeaturedCard({ bp }: { bp: (typeof BLUEPRINTS)[0] }) {
    return (
        <div className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-surface-elevated transition-all overflow-hidden">
            {/* Thumbnail */}
            <div
                className="h-28 w-full relative flex items-end p-4"
                style={{
                    background: `linear-gradient(135deg, ${bp.runtimeColor}33 0%, ${bp.runtimeColor}11 60%, transparent 100%)`,
                    borderBottom: `1px solid ${bp.runtimeColor}22`,
                }}
            >
                <div
                    className="absolute top-4 right-4 text-[10px] font-mono font-semibold px-2 py-1 rounded-md border"
                    style={{
                        color: bp.runtimeColor,
                        backgroundColor: bp.runtimeColor + "18",
                        borderColor: bp.runtimeColor + "33",
                    }}
                >
                    {bp.runtime}
                </div>
                <span
                    className="text-2xl font-bold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: bp.runtimeColor }}
                >
                    {bp.name}
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-3 p-5 flex-1">
                <div className="flex items-center gap-2">
                    {bp.verified && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                    <p className="text-xs text-muted-foreground leading-relaxed">{bp.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {bp.tags.map((t) => (
                        <TagChip key={t} label={t} />
                    ))}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Rocket className="w-3 h-3" />
                        {fmtNum(bp.launches)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {fmtNum(bp.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {fmtNum(bp.forks)}
                    </span>
                    <span className="ml-auto text-[10px]">@{bp.creator}</span>
                </div>

                <div className="flex gap-2 mt-auto pt-1">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all">
                        <Rocket className="w-3.5 h-3.5" />
                        Launch Blueprint
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                        <GitFork className="w-3.5 h-3.5" />
                        Fork Workspace
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Blueprint Standard Card ──────────────────────────────────────────────────

function BlueprintCard({ bp }: { bp: (typeof BLUEPRINTS)[0] }) {
    return (
        <div className="group flex flex-col rounded-2xl bg-surface border border-border hover:border-primary/30 hover:bg-surface-elevated transition-all overflow-hidden">
            {/* Color strip */}
            <div className="h-1.5 w-full" style={{ backgroundColor: bp.runtimeColor + "99" }} />

            <div className="flex flex-col gap-3 p-4 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                        {bp.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        <h3
                            className="text-sm font-semibold text-white leading-tight truncate"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {bp.name}
                        </h3>
                    </div>
                    <span
                        className="text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded border"
                        style={{
                            color: bp.runtimeColor,
                            backgroundColor: bp.runtimeColor + "15",
                            borderColor: bp.runtimeColor + "30",
                        }}
                    >
                        {bp.runtime}
                    </span>
                </div>

                {/* Desc */}
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{bp.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {bp.tags.map((t) => (
                        <TagChip key={t} label={t} />
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Rocket className="w-3 h-3" />
                        {fmtNum(bp.launches)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {fmtNum(bp.stars)}
                    </span>
                    <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {fmtNum(bp.forks)}
                    </span>
                </div>

                <div className="text-[11px] text-muted-foreground font-medium">@{bp.creator}</div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-1">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all">
                        <Rocket className="w-3 h-3" />
                        Launch
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-surface border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                        <GitFork className="w-3 h-3" />
                        Fork
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Workspace Templates Section ──────────────────────────────────────────────

function TemplatesSection({
    query,
    navigate,
}: {
    query: string;
    navigate: (screen: string) => void;
}) {
    const filtered = TEMPLATES.filter(
        (t) =>
            !query ||
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.tags.some((tag) => tag.includes(query.toLowerCase()))
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Info banner */}
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-border">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-semibold text-white">What are Workspace Templates?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Workspace Templates are starter environments selected when creating a new project.
                        Browse below to preview options, then head to{" "}
                        <button
                            onClick={() => navigate("/projects/create")}
                            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                        >
                            New Project
                        </button>{" "}
                        to use one.
                    </p>
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                    <Search className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No templates match &ldquo;{query}&rdquo;</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((t) => (
                        <TemplateCard
                            key={t.id}
                            template={t}
                            onUse={() => navigate("/projects/create")}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Blueprints Section ───────────────────────────────────────────────────────

type BpSection = "featured" | "trending" | "official" | "community";

const BP_SECTION_TABS: { key: BpSection; label: string; icon: React.ReactNode }[] = [
    { key: "featured", label: "Featured", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { key: "trending", label: "Trending", icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { key: "official", label: "Official", icon: <Shield className="w-3.5 h-3.5" /> },
    { key: "community", label: "Community", icon: <Zap className="w-3.5 h-3.5" /> },
];

function filterBySection(bps: typeof BLUEPRINTS, section: BpSection) {
    if (section === "featured") return bps;
    if (section === "trending") return [...bps].sort((a, b) => b.launches - a.launches);
    if (section === "official") return bps.filter((b) => b.creator === "official");
    if (section === "community") return bps.filter((b) => !b.verified || b.creator === "community");
    return bps;
}

function BlueprintsSection({ query }: { query: string }) {
    const [section, setSection] = useState<BpSection>("featured");

    const bySection = filterBySection(BLUEPRINTS, section);
    const filtered = bySection.filter(
        (bp) =>
            !query ||
            bp.name.toLowerCase().includes(query.toLowerCase()) ||
            bp.tags.some((t) => t.includes(query.toLowerCase()))
    );

    const featured = filtered.filter((b) => b.featured);
    const standard = filtered.filter((b) => !b.featured);

    return (
        <div className="flex flex-col gap-6">
            {/* Sub-section tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface border border-border w-fit">
                {BP_SECTION_TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setSection(tab.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${section === tab.key
                            ? "bg-surface-elevated border border-border text-white shadow-sm"
                            : "text-muted-foreground hover:text-white"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                    <Search className="w-8 h-8 opacity-30" />
                    <p className="text-sm">No blueprints match &ldquo;{query}&rdquo;</p>
                </div>
            ) : (
                <>
                    {/* Featured row */}
                    {featured.length > 0 && section === "featured" && (
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                Featured
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {featured.map((bp) => (
                                    <BlueprintFeaturedCard key={bp.id} bp={bp} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Standard grid */}
                    {standard.length > 0 && (
                        <div className="flex flex-col gap-3">
                            {section === "featured" && featured.length > 0 && (
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                    More Blueprints
                                </p>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {(section === "featured" ? standard : filtered).map((bp) => (
                                    <BlueprintCard key={bp.id} bp={bp} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ─── Category tabs ────────────────────────────────────────────────────────────

type Category = "templates" | "blueprints";

const CATEGORY_TABS: {
    key: Category | "themes" | "extensions" | "agents" | "iconpacks";
    label: string;
    disabled?: boolean;
}[] = [
        { key: "templates", label: "Workspace Templates" },
        { key: "blueprints", label: "Blueprints" },
        { key: "themes", label: "Themes", disabled: true },
        { key: "extensions", label: "Extensions", disabled: true },
        { key: "iconpacks", label: "Icon Packs", disabled: true },
    ];

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MarketplacePage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState<Category>("blueprints");
    const [query, setQuery] = useState("");

    return (
        <div className="min-h-full bg-background">
            {/* Sticky header */}
            <div className="sticky top-0 z-20 bg-background border-b border-border">
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                    <h1
                        className="text-lg font-semibold text-white flex-shrink-0"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Marketplace
                    </h1>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface border border-border text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                        />
                    </div>
                </div>

                {/* Category tabs */}
                <div className="flex items-center gap-1 px-6 pb-0 overflow-x-auto no-scrollbar">
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = !tab.disabled && tab.key === category;
                        return (
                            <button
                                key={tab.key}
                                disabled={tab.disabled}
                                onClick={() => {
                                    if (!tab.disabled && (tab.key === "templates" || tab.key === "blueprints")) {
                                        setCategory(tab.key);
                                        setQuery("");
                                    }
                                }}
                                className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${isActive
                                    ? "border-primary text-primary"
                                    : tab.disabled
                                        ? "border-transparent text-muted-foreground/40 cursor-not-allowed"
                                        : "border-transparent text-muted-foreground hover:text-white"
                                    }`}
                            >
                                {tab.label}
                                {tab.disabled && <SoonBadge />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
                {category === "templates" ? (
                    <TemplatesSection query={query} navigate={navigate} />
                ) : (
                    <BlueprintsSection query={query} />
                )}
            </div>
        </div>
    );
}
