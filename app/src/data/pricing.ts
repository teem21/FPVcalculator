import type { Tier, TierPrices } from '@/types';

export interface PricingParams {
  rate: number;
  fobK: number;
  xkm: number;
}

export const DEFAULT_PRICING: PricingParams = {
  rate: 6.84,
  fobK: 1.1,
  xkm: 215,
};

export function tierPrice(prices: TierPrices | null, tier: Tier): number | null {
  if (!prices) return null;
  return tier === 0 ? prices.sample : tier === 1 ? prices.k1 : prices.k5;
}

export function fiberPrice(km: number, xkm: number, tier: Tier): number {
  const multipliers = [1.2, 1.0, 0.98];
  return Math.round(xkm * km * multipliers[tier]);
}

export function usdToCny(usd: number, rate: number, fobK: number): number {
  return Math.round(usd * rate / fobK);
}
