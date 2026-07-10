import type { PricePoint, PricingCatalog, PricingFeature, PricingFeatureRef, PricingProduct, CurrencyPrice, BillingPriceSet } from './types';

const productModules = import.meta.glob('/src/pricing/**/*.{json,yaml,yml}', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeCurrencyPrice(value: unknown): CurrencyPrice | null {
  if (!isRecord(value)) return null;
  return {
    amount: typeof value.amount === 'number' || typeof value.amount === 'string' ? value.amount : 0,
    display: toString(value.display),
    note: toString(value.note),
  };
}

function normalizeFeature(filePath: string, value: unknown): PricingFeature | null {
  if (!isRecord(value)) return null;
  return {
    id: toString(value.id, filePath),
    label: toString(value.label, toString(value.id, filePath)),
    category: toString(value.category, 'General'),
    description: toString(value.description),
    order: typeof value.order === 'number' ? value.order : undefined,
  };
}

function normalizeProduct(kind: PricingProduct['kind'], filePath: string, value: unknown): PricingProduct | null {
  if (!isRecord(value)) return null;

  const price = Array.isArray(value.price)
    ? value.price.filter(isRecord).map((item) => ({
        currency: toString(item.currency, 'USD'),
        amount: toNumber(item.amount, 0),
        interval: item.interval as PricePoint['interval'] | undefined,
        display: toString(item.display),
        note: toString(item.note),
      }))
    : [];

  const prices = isRecord(value.prices)
    ? Object.fromEntries(
        Object.entries(value.prices)
          .map(([currency, entry]) => {
            const normalized = normalizeCurrencyPrice(entry);
            return normalized ? [currency, normalized] : null;
          })
          .filter((entry): entry is [string, CurrencyPrice] => entry !== null),
      )
    : undefined;

  const billing = isRecord(value.billing)
    ? {
        monthly: isRecord(value.billing.monthly)
          ? Object.fromEntries(
              Object.entries(value.billing.monthly)
                .map(([currency, entry]) => {
                  const normalized = normalizeCurrencyPrice(entry);
                  return normalized ? [currency, normalized] : null;
                })
                .filter((entry): entry is [string, CurrencyPrice] => entry !== null),
            )
          : undefined,
        yearly: isRecord(value.billing.yearly)
          ? Object.fromEntries(
              Object.entries(value.billing.yearly)
                .map(([currency, entry]) => {
                  const normalized = normalizeCurrencyPrice(entry);
                  return normalized ? [currency, normalized] : null;
                })
                .filter((entry): entry is [string, CurrencyPrice] => entry !== null),
            )
          : undefined,
        oneTime: isRecord(value.billing.oneTime)
          ? Object.fromEntries(
              Object.entries(value.billing.oneTime)
                .map(([currency, entry]) => {
                  const normalized = normalizeCurrencyPrice(entry);
                  return normalized ? [currency, normalized] : null;
                })
                .filter((entry): entry is [string, CurrencyPrice] => entry !== null),
            )
          : undefined,
      } satisfies BillingPriceSet
    : undefined;

  const features = Array.isArray(value.features)
    ? value.features.filter(isRecord).map((item) => {
        // Resolve `value`: explicit boolean/string > derive from status > undefined
        let resolvedValue: boolean | string | undefined;
        if (typeof item.value === 'boolean') {
          resolvedValue = item.value;
        } else if (typeof item.value === 'string' && item.value.length > 0) {
          resolvedValue = item.value;
        } else if (item.status === 'included') {
          resolvedValue = true;
        } else if (item.status === 'excluded') {
          resolvedValue = false;
        }
        return {
          id: toString(item.id, ''),
          label: toString(item.label),
          value: resolvedValue,
          status: item.status as PricingFeatureRef['status'] | undefined,
          note: toString(item.note),
        };
      }).filter((item) => item.id.length > 0)
    : [];

    return {
      kind,
    id: toString(value.id, filePath),
    slug: toString(value.slug, filePath.replace(/^\/src\/pricing\//, '').replace(/\.(json|ya?ml)$/, '')),
    name: toString(value.name, toString(value.id, filePath)),
    description: toString(value.description, ''),
    summary: toString(value.summary),
    category: toString(value.category),
    resource: toString(value.resource),
    order: toNumber(value.order, 999),
    status: (toString(value.status, 'active') as PricingProduct['status']),
    visibility: (toString(value.visibility, 'public') as PricingProduct['visibility']),
    featured: Boolean(value.featured),
    badge: toString(value.badge),
    currency: toString(value.currency, price[0]?.currency ?? 'USD'),
    price,
    prices,
    billing,
    ctaLabel: toString(value.ctaLabel, 'Learn more'),
    highlights: Array.isArray(value.highlights)
      ? value.highlights.filter((h): h is string => typeof h === 'string')
      : undefined,
    features,
    comparison: isRecord(value.comparison)
      ? Object.fromEntries(Object.entries(value.comparison).map(([key, entry]) => [key, String(entry)]))
      : undefined,
    };
  }

function sortProducts<T extends { order?: number; id?: string; label?: string; name?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    const nameA = a.name ?? a.label ?? a.id ?? '';
    const nameB = b.name ?? b.label ?? b.id ?? '';
    return nameA.localeCompare(nameB);
  });
}

export function loadPricingCatalog(): PricingCatalog {
  const plans: PricingProduct[] = [];
  const passes: PricingProduct[] = [];
  const packs: PricingProduct[] = [];
  const features: PricingFeature[] = [];

  for (const [filePath, value] of Object.entries(productModules)) {
    if (filePath.includes('/features/') || filePath.includes('/catalog/')) {
      // catalog/features.json is an array; /features/*.json are individual objects
      const raw = Array.isArray(value) ? value : [value];
      for (const item of raw) {
        const feature = normalizeFeature(filePath, item);
        if (feature) features.push(feature);
      }
      continue;
    }

    if (filePath.includes('/plans/')) {
      const item = normalizeProduct('plan', filePath, value);
      if (item && item.visibility === 'public' && item.status !== 'hidden') plans.push(item);
      continue;
    }

    if (filePath.includes('/passes/')) {
      const item = normalizeProduct('pass', filePath, value);
      if (item && item.visibility === 'public' && item.status !== 'hidden') passes.push(item);
      continue;
    }

    if (filePath.includes('/packs/')) {
      // Pack files may be a single product or an array of variants
      const raw = Array.isArray(value) ? value : [value];
      for (const item of raw) {
        const product = normalizeProduct('pack', filePath, item);
        if (product && product.visibility === 'public' && product.status !== 'hidden') packs.push(product);
      }
    }
  }

  return {
    plans: sortProducts(plans),
    passes: sortProducts(passes),
    packs: sortProducts(packs),
    features: sortProducts(features),
  };
}

export const pricingCatalog = loadPricingCatalog();
