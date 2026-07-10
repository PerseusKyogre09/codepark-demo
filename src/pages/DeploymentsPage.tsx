import { useState } from "react";
import {
    Rocket, CheckCircle2, GitFork, Star, Globe, Shield,
    BarChart2, Pencil, Archive, Plus, ChevronDown, Clock,
    EyeOff, Layers, TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    AreaChart, Area, ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEEK_DATA = [
    [12, 19, 15, 28, 22, 31, 27],
    [40, 55, 48, 70, 65, 82, 74],
    [0, 0, 0, 0, 0, 0, 0],
];

const MY_DEPLOYMENTS = [
    {
        id: "fp",
        name: "FastAPI Starter",
        version: "v1.2.0",
        status: "live" as const,
        visibility: "public" as const,
        runtime: "Python 3.11",
        runtimeColor: "#CE422B",
        emoji: "⚡",
        desc: "Python async API with Redis caching and OpenAPI docs.",
        publishedAt: "5 hours ago",
        lastUpdated: "5 hours ago",
        launches: 127,
        forks: 18,
        starsToday: 4,
        health: 99.8,
        activeInstances: 4,
        verified: true,
        weekData: WEEK_DATA[0],
    },
    {
        id: "np",
        name: "Next.js + Postgres",
        version: "v2.1.0",
        status: "live" as const,
        visibility: "public" as const,
        runtime: "Node 20",
        runtimeColor: "#3178C6",
        emoji: "⬡",
        desc: "Full-stack starter with auth, Prisma ORM, and CI/CD pipeline.",
        publishedAt: "2 weeks ago",
        lastUpdated: "3 days ago",
        launches: 512,
        forks: 84,
        starsToday: 11,
        health: 100,
        activeInstances: 12,
        verified: true,
        weekData: WEEK_DATA[1],
    },
    {
        id: "rc",
        name: "Rust CLI Starter",
        version: "v0.3.0-draft",
        status: "draft" as const,
        visibility: "private" as const,
        runtime: "Rust 1.75",
        runtimeColor: "#C0624A",
        emoji: "🦀",
        desc: "Work in progress — Cargo workspace with CI and release automation.",
        publishedAt: "—",
        lastUpdated: "Yesterday",
        launches: 0,
        forks: 0,
        starsToday: 0,
        health: null,
        activeInstances: 0,
        verified: false,
        weekData: WEEK_DATA[2],
    },
];

type Filter = "all" | "live" | "draft" | "private";
type Dep = typeof MY_DEPLOYMENTS[0];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Dep["status"] }) {
    if (status === "live") {
        return (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Live
            </span>
        );
    }
    return (
        <span className="text-[10px] font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full">
            Draft
        </span>
    );
}

function VisibilityBadge({ visibility }: { visibility: Dep["visibility"] }) {
    if (visibility === "public") {
        return (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Globe size={9} /> Public
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <EyeOff size={9} /> Private
        </span>
    );
}

// ─── Sparkline tooltip ────────────────────────────────────────────────────────

function SparkTooltip({ active, payload }: { active?: boolean; payload?: { value: number }[] }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-surface-elevated border border-border rounded-lg px-2 py-1">
            <p className="text-[10px] text-foreground font-medium">{payload[0].value} launches</p>
        </div>
    );
}

// ─── Deployment card ──────────────────────────────────────────────────────────

function DeploymentCard({ dep }: { dep: Dep }) {
    const [showMenu, setShowMenu] = useState(false);

    const sparkData = dep.weekData.map((v, i) => ({
        day: ["M", "T", "W", "T", "F", "S", "S"][i],
        launches: v,
    }));

    return (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all">
            {/* Top color strip */}
            <div className="h-1" style={{ backgroundColor: dep.runtimeColor + "80" }} />

            <div className="p-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-start gap-4">
                        <div
                            className="size-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                            style={{ backgroundColor: dep.runtimeColor + "12" }}
                        >
                            {dep.emoji}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                <h3
                                    className="text-base font-semibold text-foreground"
                                    style={{ fontFamily: "var(--font-display)" }}
                                >
                                    {dep.name}
                                </h3>
                                {dep.verified && <CheckCircle2 size={13} className="text-primary" />}
                                <span className="text-xs font-mono text-muted-foreground">{dep.version}</span>
                                <StatusBadge status={dep.status} />
                                <VisibilityBadge visibility={dep.visibility} />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{dep.desc}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {/* TODO: Connect real APIs for analytics and management actions */}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-muted hover:border-primary/30 transition-all">
                            <BarChart2 size={11} />
                            Analytics
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-xl hover:bg-muted transition-colors">
                            <Pencil size={11} />
                            Edit
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            >
                                <ChevronDown size={13} />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1.5 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-10 w-36">
                                    <button className="w-full text-left px-4 py-2.5 text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                                        <Globe size={11} className="text-muted-foreground" />
                                        Make public
                                    </button>
                                    <button className="w-full text-left px-4 py-2.5 text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                                        <Archive size={11} className="text-muted-foreground" />
                                        Archive
                                    </button>
                                    <div className="border-t border-border" />
                                    <button className="w-full text-left px-4 py-2.5 text-xs text-error hover:bg-muted transition-colors">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats + sparkline */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end pt-5 border-t border-border">
                    {/* Stats */}
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Launches</p>
                        <p
                            className="text-2xl font-semibold text-foreground leading-none"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {dep.launches.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Forks</p>
                        <p
                            className="text-2xl font-semibold text-foreground leading-none"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {dep.forks}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Health</p>
                        <p
                            className={`text-2xl font-semibold leading-none ${dep.health === null ? "text-muted-foreground" : dep.health >= 99 ? "text-success" : "text-warning"}`}
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {dep.health === null ? "—" : `${dep.health}%`}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Active instances</p>
                        <p
                            className="text-2xl font-semibold text-foreground leading-none"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {dep.activeInstances}
                        </p>
                    </div>

                    {/* Sparkline */}
                    <div>
                        <p className="text-[10px] text-muted-foreground mb-2">7-day launches</p>
                        {dep.launches > 0 ? (
                            <ResponsiveContainer width="100%" height={40}>
                                <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                                    <defs>
                                        <linearGradient id={`grad-${dep.id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2E8B57" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#2E8B57" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip content={<SparkTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="launches"
                                        stroke="#2E8B57"
                                        strokeWidth={1.5}
                                        fill={`url(#grad-${dep.id})`}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-10 flex items-center">
                                <span className="text-xs text-muted-foreground/50">Not published</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer meta */}
                <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                        <Clock size={9} />
                        Published {dep.publishedAt}
                    </span>
                    <span>·</span>
                    <span>Updated {dep.lastUpdated}</span>
                    <span>·</span>
                    <span className="font-mono">{dep.runtime}</span>
                    {dep.starsToday > 0 && (
                        <>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-warning">
                                <Star size={9} />
                                {dep.starsToday} stars today
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Empty state for "no deployments" ────────────────────────────────────────

function EmptyState() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Rocket size={22} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>
                No deployments yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
                Publish a Blueprint from your workspace. Others can then launch it instantly from the Marketplace.
            </p>
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
                <Layers size={14} />
                Open Workspace to Publish
            </button>
        </div>
    );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function DeploymentsPage() {
    const [filter, setFilter] = useState<Filter>("all");

    const filtered = MY_DEPLOYMENTS.filter((d) => {
        if (filter === "live") return d.status === "live";
        if (filter === "draft") return d.status === "draft";
        if (filter === "private") return d.visibility === "private";
        return true;
    });

    const totalLaunches = MY_DEPLOYMENTS.reduce((acc, d) => acc + d.launches, 0);
    const totalForks = MY_DEPLOYMENTS.reduce((acc, d) => acc + d.forks, 0);
    const liveCount = MY_DEPLOYMENTS.filter((d) => d.status === "live").length;

    const FILTERS: { key: Filter; label: string }[] = [
        { key: "all", label: `All (${MY_DEPLOYMENTS.length})` },
        { key: "live", label: `Live (${liveCount})` },
        { key: "draft", label: "Draft" },
        { key: "private", label: "Private" },
    ];

    return (
        <div className="min-h-full bg-background">
            {/* ── Header ── */}
            <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-6 md:px-8 h-14 flex items-center justify-between">
                <h1
                    className="text-base font-semibold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    Deployments
                </h1>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
                    <Plus size={13} />
                    Publish Blueprint
                </button>
            </header>

            <div className="max-w-5xl mx-auto px-6 md:px-8 py-8">

                {/* ── Summary stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Published", value: liveCount, icon: Rocket, color: "#4CAF7D" },
                        { label: "Total launches", value: totalLaunches.toLocaleString(), icon: TrendingUp, color: "#5B9BD4" },
                        { label: "Total forks", value: totalForks, icon: GitFork, color: "#D4A84B" },
                        { label: "Stars today", value: "15", icon: Star, color: "#D4A84B" },
                    ].map((m) => {
                        const Icon = m.icon;
                        return (
                            <div key={m.label} className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
                                <div
                                    className="size-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${m.color}15` }}
                                >
                                    <Icon size={15} style={{ color: m.color }} />
                                </div>
                                <div>
                                    <p
                                        className="text-xl font-semibold text-foreground leading-none"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        {m.value}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Filters ── */}
                <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit mb-6">
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.key
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* ── Deployment list ── */}
                {filtered.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        {filtered.map((dep) => (
                            <DeploymentCard key={dep.id} dep={dep} />
                        ))}
                    </div>
                )}

                {/* ── Info callout ── */}
                <div className="mt-10 pt-8 border-t border-border">
                    <div className="flex items-start gap-3 bg-surface border border-border rounded-2xl p-5">
                        <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Shield size={14} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-foreground mb-1">
                                Secrets are never exposed in Blueprints
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                When you publish a Blueprint, your environment variables and secrets are stripped out. Users who launch your Blueprint provide their own credentials before starting their workspace.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
