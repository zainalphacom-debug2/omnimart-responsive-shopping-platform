export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD' | 'SAR';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // relative to USD 1.0
  format: (amount: number) => string;
}

export type ProductBadge = 'Trending' | 'Deal' | 'Best Seller' | 'New' | 'Premium' | 'Eco';

export interface Product {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number; // Base price in USD
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  description: string;
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  compatibility?: string[]; // E.g., for phone accessories (iPhone 16 Pro, Galaxy S24, Pixel 9, USB-C)
  stock: number;
  badge?: ProductBadge;
  isUnder25?: boolean;
  isUnder10?: boolean;
  deliveryEstimateDays: number;
}

export interface CartItem {
  cartItemId: string; // Unique string based on id + selected variations
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedCompatibility?: string;
}

export interface DeliveryAddress {
  id: string;
  isDefault: boolean;
  fullName: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  streetAddress: string;
  suite?: string;
}

export type ShippingMethod = 'standard' | 'express' | 'economy';

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  estimate: string;
  days: number;
  baseFeeUSD: number;
}

export type PaymentMethod = 'test_card' | 'virtual_credit' | 'wallet' | 'cod';

export interface DemoOrder {
  id: string;
  orderNumber: string;
  createdAt: number; // timestamp in ms
  items: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingFeeUSD: number;
  taxUSD: number;
  totalUSD: number;
  currency: Currency;
  appliedCoupon?: string;
  deliveryAddress: DeliveryAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Simulated Paid' | 'Cash on Delivery (Demo)';
  isDemo: boolean;
  simulatedSpeedSecondsPerDay?: number; // default 30s per day
  manualStageOverride?: number; // optional manual advance for instant testing
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  currency: Currency;
  avatar: string;
  virtualCreditsUSD: number; // starts at $500
  isSignedIn: boolean;
  joinedDate: string;
}

export interface Coupon {
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minSpendUSD?: number;
}

export type Theme = 'light' | 'dark';

export type ActiveView = 
  | 'mall' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'order-confirmation' 
  | 'tracking' 
  | 'profile' 
  | 'deals' 
  | 'compare';

export interface AppNotification {
  id: string; // e.g. `notif-${orderId}-${type}`
  orderId: string;
  orderNumber: string;
  type: 'out_for_delivery' | 'delivered';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

