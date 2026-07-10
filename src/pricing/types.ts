export type PricingKind = 'plan' | 'pass' | 'pack';

export type ProductStatus = 'active' | 'beta' | 'preview' | 'deprecated' | 'hidden';
export type ProductVisibility = 'public' | 'private' | 'internal' | 'hidden';

export interface PricePoint {
  currency: string;
  amount: number;
  interval?: 'month' | 'year' | 'one-time';
  display?: string;
  note?: string;
}

export interface CurrencyPrice {
  amount: number | string;
  display?: string;
  note?: string;
}

export interface BillingPriceSet {
  monthly?: Record<string, CurrencyPrice>;
  yearly?: Record<string, CurrencyPrice>;
  oneTime?: Record<string, CurrencyPrice>;
}

export interface PricingFeature {
  id: string;
  label: string;
  category: string;
  description?: string;
  order?: number;
}

export interface PricingFeatureRef {
  id: string;
  label?: string;
  status?: 'included' | 'limited' | 'optional' | 'excluded';
  note?: string;
}

export interface PricingProduct {
  kind: PricingKind;
  id: string;
  slug: string;
  name: string;
  description: string;
  summary?: string;
  order: number;
  status: ProductStatus;
  visibility: ProductVisibility;
  featured?: boolean;
  badge?: string;
  currency: string;
  price: PricePoint[];
  prices?: Record<string, CurrencyPrice>;
  billing?: BillingPriceSet;
  ctaLabel: string;
  features: PricingFeatureRef[];
  comparison?: Record<string, string>;
}

export interface PricingCatalog {
  plans: PricingProduct[];
  passes: PricingProduct[];
  packs: PricingProduct[];
  features: PricingFeature[];
}
