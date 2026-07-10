import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Crown, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { pricingCatalog } from '../pricing/loader';
import type { PricingFeature, PricingProduct, CurrencyPrice } from '../pricing/types';

type CurrencyCode = 'INR' | 'USD';
type BillingCycle = 'monthly' | 'yearly';

const DEFAULT_CURRENCY: CurrencyCode = 'INR';

function currencySymbol(currency: CurrencyCode) {
  return currency === 'INR' ? '₹' : '$';
}

function formatPrice(value: CurrencyPrice | undefined, currency: CurrencyCode, fallback = 'Contact Sales') {
  if (!value) return fallback;
  if (typeof value.amount === 'string') return String(value.amount);
  if (value.display) return value.display;
  return `${currencySymbol(currency)}${value.amount}`;
}

function getProductPrice(product: PricingProduct, currency: CurrencyCode, billing: BillingCycle) {
  const billingSet = product.billing?.[billing];
  const price = billingSet?.[currency] ?? product.prices?.[currency];
  return formatPrice(price, currency, product.ctaLabel === 'Contact Sales' ? 'Contact Sales' : 'Custom');
}

function getProductNote(product: PricingProduct, currency: CurrencyCode, billing: BillingCycle) {
  const billingSet = product.billing?.[billing];
  const price = billingSet?.[currency] ?? product.prices?.[currency];
  return price?.note ?? '';
}

function groupByCategory(features: PricingFeature[]) {
  return features.reduce<Record<string, PricingFeature[]>>((acc, feature) => {
    acc[feature.category] = acc[feature.category] || [];
    acc[feature.category].push(feature);
    return acc;
  }, {});
}

function groupProductsByCategory(products: PricingProduct[]) {
  return products.reduce<Record<string, PricingProduct[]>>((acc, product) => {
    const category = product.name.replace(/\s+Pack$/i, '');
    acc[category] = acc[category] || [];
    acc[category].push(product);
    return acc;
  }, {});
}

export default function ProPage() {
  const { themeColors, settings } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [currency, setCurrency] = useState<CurrencyCode>(DEFAULT_CURRENCY);
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [openCategories, setOpenCategories] = useState<string[]>(['Projects', 'AI']);

  const plans = pricingCatalog.plans;
  const passes = pricingCatalog.passes;
  const packs = pricingCatalog.packs;
  const featureGroups = useMemo(() => groupByCategory(pricingCatalog.features), []);

  const yearlySavingsLabel = billing === 'yearly' ? 'Save up to 17% with yearly billing' : 'Switch to yearly to save more';

  const planComparisons = useMemo(() => {
    return plans.map((plan) => ({
      plan,
      displayPrice: plan.ctaLabel === 'Contact Sales'
        ? 'Contact Sales'
        : getProductPrice(plan, currency, billing),
      note: getProductNote(plan, currency, billing),
    }));
  }, [billing, currency, plans]);

  const pricingFaqs = useMemo(() => [
    {
      q: 'How does currency selection work?',
      a: 'Choose INR or USD once and the page updates every displayed price immediately. Each product carries its own regional pricing in the pricing files.',
    },
    {
      q: 'Does USD use exchange-rate conversion?',
      a: 'No. USD and INR are stored independently so pricing can follow regional strategy rather than live currency conversion.',
    },
    {
      q: 'Can yearly pricing differ from monthly pricing?',
      a: 'Yes. Subscription plans can define separate monthly and yearly values for each supported currency.',
    },
    {
      q: 'How are feature comparisons built?',
      a: 'The comparison table reads from the shared feature catalog and the feature references inside each plan file.',
    },
    {
      q: 'How do I add a new product?',
      a: 'Create a new JSON file in the appropriate pricing folder and add the metadata. The page discovers it automatically.',
    },
  ], []);

  const handleLogin = () => {
    if (isAuthenticated) return navigate('/dashboard');
    navigate('/auth');
  };

  return (
    <div
      style={{
        background: themeColors.terminalBg,
        backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 25%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 26%, transparent 27%, transparent 74%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 75%, rgba(${settings.uiTheme === 'dark' ? '63, 255, 139' : '16, 185, 129'}, 0.05) 76%, transparent 77%, transparent)`,
        backgroundSize: '32px 32px',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
      className="pt-24 md:pt-28 pb-20 md:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="mx-auto max-w-4xl text-center pt-10 md:pt-16 pb-12 md:pb-14">
          <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '0.875rem' }}>
            $ pricing
          </p>
          <h1 style={{ color: themeColors.terminalPrimary, fontFamily: 'Space Mono, monospace', fontSize: 'clamp(2.4rem, 4vw, 4rem)', fontWeight: 700, marginTop: '0.5rem', marginBottom: '1rem' }}>
            Choose the right setup for how you build
          </h1>
          <p style={{ color: themeColors.terminalSecondary, fontFamily: 'Space Mono, monospace', fontSize: '1rem', maxWidth: '48rem', margin: '0 auto' }}>
            Plans, passes, and resource packs are all powered by the pricing catalog. Switch currency or billing mode, and the page updates instantly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex rounded-full border border-border bg-card/70 p-1">
              {(['monthly', 'yearly'] as BillingCycle[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setBilling(mode)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${billing === mode ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {mode === 'monthly' ? 'Monthly' : 'Yearly'}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-full border border-border bg-card/70 p-1">
              {(['INR', 'USD'] as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${currency === code ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {code === 'INR' ? 'INR (₹)' : 'USD ($)'}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {yearlySavingsLabel}
          </p>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles size={12} />
            Subscription plans
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 items-stretch">
            {planComparisons.map(({ plan, displayPrice, note }) => {
              const isFeatured = plan.featured;
              const priceLabel = plan.ctaLabel === 'Contact Sales' ? 'Contact Sales' : displayPrice;
              const period = billing === 'yearly' && plan.billing?.yearly ? ' / year' : billing === 'monthly' && plan.billing?.monthly ? ' / month' : '';
              const audience = plan.summary ?? plan.description;

              return (
                <article
                  key={plan.slug}
                  className={`flex h-full flex-col rounded-2xl border p-5 md:p-6 transition-all duration-300 ${isFeatured ? 'border-primary/40 bg-primary/5' : 'border-border bg-card/60 hover:border-border/90 hover:bg-muted/30'}`}
                >
                  {isFeatured && (
                    <div className="mb-4 inline-flex rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      Recommended
                    </div>
                  )}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{audience}</p>
                    </div>
                    {plan.badge && (
                      <span className="rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-foreground">{priceLabel}</span>
                      {plan.ctaLabel !== 'Contact Sales' && (
                        <span className="text-sm text-muted-foreground">{period}</span>
                      )}
                    </div>
                    {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
                  </div>

                  <ul className="mb-5 flex-1 space-y-2">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                        <span>{feature.label ?? feature.id}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={handleLogin}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isFeatured ? 'border-foreground/80 bg-primary text-primary-foreground hover:bg-primary/95' : 'border-border bg-background text-foreground hover:bg-muted/60'}`}
                  >
                    {plan.ctaLabel}
                    <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Zap size={12} />
            Feature comparison
          </div>
          <div className="rounded-2xl border border-border bg-card/50">
            {Object.entries(featureGroups)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, features]) => {
                const open = openCategories.includes(category);
                return (
                  <div key={category} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setOpenCategories((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category])}
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-foreground">{category}</span>
                      <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="overflow-hidden border-t border-border/70 px-5 py-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          {features.map((feature) => (
                            <div key={feature.id} className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/40 p-3">
                              <Check size={14} className="mt-0.5 shrink-0 text-primary" />
                              <div>
                                <p className="text-sm text-foreground">{feature.label}</p>
                                {feature.description && <p className="mt-1 text-xs text-muted-foreground">{feature.description}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Crown size={12} />
            Passes
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 items-stretch">
            {passes.map((pass) => (
              <article key={pass.slug} className="flex h-full flex-col rounded-2xl border border-border bg-card/60 p-5 md:p-6">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">Temporary access</p>
                <h2 className="text-xl font-semibold text-foreground">{pass.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{pass.summary ?? pass.description}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-foreground">{getProductPrice(pass, currency, 'monthly')}</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{pass.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pass.features.map((feature) => (
                    <span key={feature.id} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      {feature.label ?? feature.id}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles size={12} />
            Resource packs
          </div>
          <div className="grid gap-5 md:grid-cols-2 items-stretch">
            {Object.entries(groupProductsByCategory(packs))
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([category, items]) => (
                <div key={category} className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {items.map((pack) => (
                      <div key={pack.slug} className="rounded-xl border border-border/60 bg-background/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{pack.name}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{pack.description}</p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">{getProductPrice(pack, currency, 'monthly')}</span>
                        </div>
                        <button
                          onClick={handleLogin}
                          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90"
                        >
                          {pack.ctaLabel}
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles size={12} />
              FAQ
            </div>
            <div className="space-y-3">
              {pricingFaqs.map((faq, index) => (
                <details key={faq.q} className="rounded-2xl border border-border bg-card/60 p-5" open={index === 0}>
                  <summary className="cursor-pointer list-none text-sm font-medium text-foreground">{faq.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="rounded-[28px] border border-border bg-card/60 px-6 py-10 text-center md:px-10">
            <h2 className="text-3xl font-semibold text-foreground" style={{ fontFamily: 'Space Mono, monospace' }}>
              Ready to build in CodePark?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
              Start with a plan, add temporary passes when you need them, and expand with resource packs as your workflow grows.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-2 rounded-[10px] border-[2px] border-foreground/80 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Start Coding Instantly'}
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="inline-flex items-center gap-2 rounded-[10px] border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Read docs
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
