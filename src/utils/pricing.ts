import { Currency, Coupon } from '../types';

export const CURRENCY_CONFIGS: Record<Currency, { symbol: string; rate: number; label: string; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)', prefix: true },
  PKR: { symbol: '₨', rate: 278.5, label: 'PKR (₨)', prefix: true },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)', prefix: true },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)', prefix: true },
  AED: { symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)', prefix: true },
  CAD: { symbol: 'C$', rate: 1.36, label: 'CAD ($)', prefix: true },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD ($)', prefix: true },
  SAR: { symbol: 'SAR ', rate: 3.75, label: 'SAR (﷼)', prefix: true },
};

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    description: '10% off your entire order (All items)',
    type: 'percent',
    value: 10,
  },
  {
    code: 'SAVE15',
    description: '15% off orders over $50',
    type: 'percent',
    value: 15,
    minSpendUSD: 50,
  },
  {
    code: 'FREESHIP',
    description: '100% Free Standard/Express Delivery',
    type: 'free_shipping',
    value: 100,
  },
  {
    code: 'BUNDLE20',
    description: '$20 off on orders over $100',
    type: 'fixed',
    value: 20,
    minSpendUSD: 100,
  },
  {
    code: 'OMNI50',
    description: '$50 VIP Mall credit on orders over $200',
    type: 'fixed',
    value: 50,
    minSpendUSD: 200,
  },
];

export function convertUSD(amountInUSD: number, currency: Currency): number {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  return amountInUSD * config.rate;
}

export function formatPrice(amountInUSD: number, currency: Currency = 'USD'): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;
  const converted = amountInUSD * config.rate;

  if (currency === 'PKR') {
    // Format without decimal cents for PKR as standard practice
    return `${config.symbol} ${Math.round(converted).toLocaleString('en-US')}`;
  }

  if (currency === 'AED' || currency === 'SAR') {
    return `${config.symbol} ${converted.toFixed(2)}`;
  }

  return `${config.symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
