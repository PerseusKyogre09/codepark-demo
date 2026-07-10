import { useState } from "react";
import { Check, Minus, ChevronDown, Zap, Package, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { pricingCatalog } from "../pricing/loader";
import type { PricingFeature } from "../pricing/types";
import * as Accordion from "@radix-ui/react-accordion";

type Currency = "USD" | "INR" | "EUR" | "GBP" | "JPY";

const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

const planPriceLabel = (plan: any, currency: Currency, isYearly: boolean) => {
  const cycle = isYearly ? "yearly" : "monthly";
  const price = plan.billing?.[cycle]?.[currency] ?? plan.prices?.[currency];
  return price?.display ?? (typeof price?.amount === "string" ? String(price.amount) : "");
};

const planPriceMeta = (plan: any, currency: Currency, isYearly: boolean) => {
  const cycle = isYearly ? "yearly" : "monthly";
  return plan.billing?.[cycle]?.[currency]?.note ?? plan.prices?.[currency]?.note ?? "";
};

const PLANS = pricingCatalog.plans.map((plan) => ({
  id: plan.slug,
  name: plan.name,
  tagline: plan.description,
  highlight: Boolean(plan.featured),
  badge: plan.badge,
  ctaLabel: plan.ctaLabel,
  ctaVariant: plan.featured ? ("primary" as const) : ("outline" as const),
  features: (plan.highlights && plan.highlights.length > 0)
    ? plan.highlights.slice(0, 7)
    : plan.features
        .filter((f) => f.value !== false)
        .map((feature) => feature.label || pricingCatalog.features.find((f) => f.id === feature.id)?.label || feature.id)
        .slice(0, 7),
  priceFor: (currency: Currency, isYearly: boolean) => planPriceLabel(plan, currency, isYearly),
  priceMeta: (currency: Currency, isYearly: boolean) => planPriceMeta(plan, currency, isYearly),
  raw: plan,
}));

type CellValue = string | boolean | null;

interface FeatureRow {
  label: string;
  values: [CellValue, CellValue, CellValue, CellValue];
}

interface TableGroup {
  label: string;
  rows: FeatureRow[];
}

const TABLE: TableGroup[] = Object.entries(
  pricingCatalog.features.reduce<Record<string, PricingFeature[]>>((acc, feature) => {
    const key = feature.category === "Environments" ? "Projects" : feature.category;
    acc[key] = acc[key] || [];
    acc[key].push(feature);
    return acc;
  }, {})
).sort(([a], [b]) => a.localeCompare(b)).map(([label, features]) => ({
  label,
  rows: features.map((feature) => ({
    label: feature.label,
    values: pricingCatalog.plans.map((plan) => {
      const ref = plan.features.find((f) => f.id === feature.id);
      if (!ref || ref.value === false || ref.value === undefined) return null;
      if (typeof ref.value === 'string') return ref.value;
      return true;
    }) as [CellValue, CellValue, CellValue, CellValue],
  })),
}));

const PASSES = pricingCatalog.passes.map((pass) => ({
  name: pass.name,
  desc: pass.description,
  duration: pass.summary ?? pass.description,
  raw: pass,
}));

// Group packs by category, preserving insertion order within each group
const PACK_CATEGORIES: { label: string; packs: typeof pricingCatalog.packs }[] = [];
for (const pack of pricingCatalog.packs) {
  const cat = pack.category || 'Other';
  const existing = PACK_CATEGORIES.find((c) => c.label === cat);
  if (existing) { existing.packs.push(pack); }
  else { PACK_CATEGORIES.push({ label: cat, packs: [pack] }); }
}

const FAQ = [
  { q: "Can I switch plans at any time?", a: "Yes. Upgrades take effect immediately and are prorated. Downgrades apply at the end of your billing cycle, so you keep what you paid for." },
  { q: "What counts as a workspace?", a: "A workspace is one isolated cloud environment running your code. You can open multiple workspaces simultaneously up to your plan limit. Stopped workspaces don't count toward the limit." },
  { q: "Is there a free trial for paid plans?", a: "Pro and Team both include a 14-day trial with no credit card required. Enterprise trials are arranged through our sales team." },
  { q: "How does annual billing work?", a: "Annual plans are billed upfront and save you 20%. You get a full refund within the first 14 days. After that, unused months are non-refundable." },
  { q: "What is ContextBase?", a: "ContextBase is the project intelligence layer built into CodePark. It understands your codebase and surfaces that knowledge inline as you work." },
  { q: "Do Passes and Resource Packs expire?", a: "Session and Sprint Passes expire when the duration ends. Resource Packs are valid for 90 days from purchase and work on top of any plan, including Free." },
  { q: "Is there a student or open-source discount?", a: "Yes. Verified students and OSS maintainers get Pro for free. Apply from your account settings — approval takes 1-2 business days." },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  if (value === null) return <td className={`px-5 py-3.5 text-center ${highlight ? "bg-primary/[0.04]" : ""}`}><Minus size={14} className="text-border mx-auto" /></td>;
  if (value === true) return <td className={`px-5 py-3.5 text-center ${highlight ? "bg-primary/[0.04]" : ""}`}><Check size={14} className="text-primary mx-auto" strokeWidth={2.5} /></td>;
  return <td className={`px-5 py-3.5 text-center text-xs text-muted-foreground tabular-nums ${highlight ? "bg-primary/[0.04]" : ""}`}>{value}</td>;
}

export default function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const curr = CURRENCIES.find((c) => c.code === currency)!;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <section className="pt-20 pb-14 text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-5">Pricing</p>
          <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            Pay for what you use.<br />
            <span className="text-muted-foreground font-normal">Nothing more.</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed mb-10">Every plan includes a 14-day free trial. No credit card required until you're ready.</p>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
              <button onClick={() => setIsYearly(false)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${!isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Monthly</button>
              <button onClick={() => setIsYearly(true)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Yearly <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">−20%</span></button>
            </div>
            <div className="relative">
              <button onClick={() => setShowCurrencyMenu((v) => !v)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-muted transition-colors">
                <span>{curr.symbol}</span><span>{curr.code}</span><ChevronDown size={13} className="text-muted-foreground" />
              </button>
              {showCurrencyMenu && (
                <div className="absolute top-full mt-1.5 right-0 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-20 min-w-[140px]">
                  {CURRENCIES.map((c) => (
                    <button key={c.code} onClick={() => { setCurrency(c.code); setShowCurrencyMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${currency === c.code ? "text-primary" : "text-foreground"}`}>
                      <span className="w-4 text-center font-mono">{c.symbol}</span><span>{c.code}</span><span className="text-muted-foreground text-xs ml-auto">{c.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`relative rounded-xl border p-6 flex flex-col transition-all ${plan.highlight ? "border-primary/40 bg-primary/[0.04] ring-1 ring-primary/20" : "border-border bg-surface"}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider rounded-full">{plan.badge}</span></div>}
                <div className="mb-5"><h2 className="text-base font-semibold text-foreground mb-1" style={{ fontFamily: "var(--font-display)" }}>{plan.name}</h2><p className="text-xs text-muted-foreground leading-relaxed">{plan.tagline}</p></div>
                <div className="mb-6">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{plan.raw.ctaLabel === "Contact Sales" ? "Contact Sales" : plan.priceFor(currency, isYearly)}</span>
                      <span className="text-xs text-muted-foreground">{plan.raw.ctaLabel === "Contact Sales" ? "" : plan.raw.name === "Team" ? "/ seat / mo" : "/ mo"}</span>
                    </div>
                    {isYearly && plan.raw.ctaLabel !== "Contact Sales" && <p className="text-xs text-muted-foreground mt-0.5">{plan.priceMeta(currency, isYearly)}</p>}
                  </div>
                </div>
                <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className={`w-full py-2 rounded-lg text-sm font-medium transition-colors mb-6 ${plan.ctaVariant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-border text-foreground hover:bg-muted"}`}>{plan.ctaLabel}</button>
                <ul className="space-y-2.5 mt-4">{plan.features.map((f) => <li key={f} className="flex items-start gap-2.5 text-xs text-foreground/80"><Check size={13} className="text-primary mt-0.5 shrink-0" strokeWidth={2.5} />{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-20">
          <div className="mb-10 text-center"><h2 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "var(--font-display)" }}>Compare plans in full</h2><p className="text-sm text-muted-foreground">Everything side by side, nothing hidden.</p></div>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[700px] border-collapse">
              <thead><tr className="border-b border-border"><th className="px-5 py-4 text-left text-xs font-medium text-muted-foreground w-56">Feature</th>{PLANS.map((plan) => <th key={plan.id} className={`px-5 py-4 text-center text-xs font-semibold ${plan.highlight ? "text-primary bg-primary/[0.04]" : "text-foreground"}`}>{plan.name}</th>)}</tr></thead>
              {TABLE.map((group) => <tbody key={group.label}><tr className="border-t border-border bg-muted/30"><td colSpan={5} className="px-5 py-2.5"><span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{group.label}</span></td></tr>{group.rows.map((row) => <tr key={row.label} className="border-t border-border/50 hover:bg-muted/20 transition-colors"><td className="px-5 py-3.5 text-xs text-muted-foreground">{row.label}</td>{row.values.map((val, i) => <Cell key={i} value={val} highlight={PLANS[i].highlight} />)}</tr>)}</tbody>)}
            </table>
          </div>
        </section>

        <section className="pb-20">
          <div className="flex items-start justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-primary" /><h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Passes</h2></div>
              <p className="text-sm text-muted-foreground max-w-sm">No subscription needed. Grab a Pass for a specific session, sprint, or event.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PASSES.map((pass) => (
              <div key={pass.name} className="flex flex-col border border-border rounded-xl p-5 bg-surface hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground pr-3 leading-snug" style={{ fontFamily: "var(--font-display)" }}>{pass.name}</h3>
                  <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">{pass.raw.prices?.[currency]?.display ?? `${curr.symbol}${String(pass.raw.prices?.[currency]?.amount ?? 0)}`}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{pass.desc}</p>
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wide leading-tight">{pass.duration}</p>
                  <button
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                    className="shrink-0 px-3 py-1.5 border border-border text-foreground text-xs font-medium rounded-lg hover:bg-muted transition-colors"
                  >
                    {pass.raw.ctaLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2"><Package size={14} className="text-primary" /><h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Resource Packs</h2></div>
              <p className="text-sm text-muted-foreground max-w-sm">Add capacity on top of any plan, including Free. Each pack is a one-time purchase.</p>
            </div>
          </div>
          <div className="space-y-10">
            {PACK_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">{cat.label}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cat.packs.map((pack) => (
                    <div key={pack.id} className="flex flex-col border border-border rounded-xl p-5 bg-surface hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-foreground leading-snug" style={{ fontFamily: "var(--font-display)" }}>{pack.name}</p>
                        <span className="text-sm font-semibold text-primary tabular-nums shrink-0">{pack.prices?.[currency]?.display ?? `${curr.symbol}${String(pack.prices?.[currency]?.amount ?? 0)}`}</span>
                      </div>
                      {pack.resource && (
                        <p className="text-[11px] font-medium text-primary/80 mb-2">{pack.resource}</p>
                      )}
                      <p className="text-xs text-muted-foreground leading-relaxed flex-1">{pack.description}</p>
                      <button
                        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                        className="mt-4 w-full py-1.5 border border-border text-foreground text-xs font-medium rounded-lg hover:bg-muted transition-colors"
                      >
                        {pack.ctaLabel}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-20 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8 justify-center"><HelpCircle size={14} className="text-primary" /><h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Frequently asked questions</h2></div>
          <Accordion.Root type="single" collapsible className="space-y-1">{FAQ.map((item, i) => <Accordion.Item key={i} value={String(i)} className="border border-border rounded-lg overflow-hidden"><Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground text-left hover:bg-muted/40 transition-colors group data-[state=open]:bg-muted/40 [&>svg]:data-[state=open]:rotate-180">{item.q}<ChevronDown size={14} className="text-muted-foreground shrink-0 transition-transform duration-200" /></Accordion.Trigger><Accordion.Content className="px-5 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed data-[state=open]:animate-none">{item.a}</Accordion.Content></Accordion.Item>)}</Accordion.Root>
        </section>

        <section className="pb-24 text-center">
          <div className="border border-border rounded-2xl p-12 lg:p-16 bg-surface max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground mb-3" style={{ fontFamily: "var(--font-display)" }}>Start building with CodePark</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm mx-auto">Free plan available. Upgrade as your project grows. Cancel or downgrade at the end of any billing period.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")} className="px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors">Get started free</button>
              <button onClick={() => navigate("/docs")} className="px-6 py-2.5 border border-border text-foreground font-medium text-sm rounded-lg hover:bg-muted transition-colors">Documentation</button>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-6">Free plan available &nbsp;·&nbsp; No credit card required &nbsp;·&nbsp; 14-day trial on paid plans</p>
          </div>
        </section>

      </div>
    </div>
  );
}
