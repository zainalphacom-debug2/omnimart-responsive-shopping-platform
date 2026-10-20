import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Product,
  CartItem,
  DemoOrder,
  DeliveryAddress,
  UserProfile,
  Currency,
  ActiveView,
  ShippingMethod,
  PaymentMethod,
  Coupon,
  Theme,
  AppNotification,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { AVAILABLE_COUPONS } from '../utils/pricing';
import { computeLiveOrderStatus } from '../utils/deliveryTimeline';

const STORAGE_KEYS = {
  CART: 'omnimart_cart_v2',
  WISHLIST: 'omnimart_wishlist_v2',
  ADDRESSES: 'omnimart_addresses_v2',
  ORDERS: 'omnimart_orders_v2',
  PROFILE: 'omnimart_profile_v2',
  CURRENCY: 'omnimart_currency_v2',
  COUNTRY: 'omnimart_country_v2',
  RECENTLY_VIEWED: 'omnimart_recent_v2',
  THEME: 'omnimart_theme_v2',
  NOTIFICATIONS: 'omnimart_notifications_v2',
};

const DEFAULT_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-pk-1',
    isDefault: true,
    fullName: 'Zain Ahmed',
    phone: '+92 300 1234567',
    country: 'Pakistan',
    state: 'Punjab',
    city: 'Lahore',
    postalCode: '54000',
    streetAddress: 'House 42, Street 7, Block C, Gulberg III',
    suite: 'Apartment 4B',
  },
  {
    id: 'addr-us-1',
    isDefault: false,
    fullName: 'Zain Ahmed (US Office)',
    phone: '+1 (555) 382-9012',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    postalCode: '94105',
    streetAddress: '500 Howard Street',
    suite: 'Suite 1400',
  },
  {
    id: 'addr-ae-1',
    isDefault: false,
    fullName: 'Zain Ahmed (Dubai)',
    phone: '+971 50 987 6543',
    country: 'United Arab Emirates',
    state: 'Dubai',
    city: 'Downtown Dubai',
    postalCode: '00000',
    streetAddress: 'Burj Crown Residences, Sheikh Mohammed bin Rashid Blvd',
    suite: 'Unit 1204',
  },
];

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-demo-01',
  name: 'Zain Ahmed',
  email: 'zain.alphacom@gmail.com',
  phone: '+92 300 1234567',
  country: 'Pakistan',
  currency: 'USD',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  virtualCreditsUSD: 500.00,
  isSignedIn: true,
  joinedDate: 'October 2026',
};

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  orderId?: string;
}

interface ShopContextType {
  // Navigation & Active View with History Sync
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navigateTo: (
    view: ActiveView,
    params?: { orderId?: string; productId?: string },
    replace?: boolean
  ) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSurpriseModalOpen: boolean;
  setIsSurpriseModalOpen: (open: boolean) => void;
  isSpinWheelOpen: boolean;
  setIsSpinWheelOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  editingAddress: DeliveryAddress | null;
  setEditingAddress: (addr: DeliveryAddress | null) => void;

  // Notification Center
  notifications: AppNotification[];
  unreadNotificationCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  requestBrowserNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;

  // Currency & Country
  currency: Currency;
  setCurrency: (c: Currency) => void;
  country: string;
  setCountry: (ctry: string) => void;

  // Products & Discovery
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeSubcategory: string;
  setActiveSubcategory: (subcat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceFilterMax: number;
  setPriceFilterMax: (price: number) => void;
  selectedBadgeFilter: string | null;
  setSelectedBadgeFilter: (badge: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      color?: string;
      size?: string;
      compatibility?: string;
      openDrawer?: boolean;
    }
  ) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotalUSD: number;

  // Direct Buy Now flow
  directBuyItem: CartItem | null;
  initiateBuyNow: (
    product: Product,
    options?: {
      quantity?: number;
      color?: string;
      size?: string;
      compatibility?: string;
    }
  ) => void;
  clearDirectBuyItem: () => void;

  // Coupon
  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Addresses
  addresses: DeliveryAddress[];
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  updateAddress: (id: string, addr: Partial<DeliveryAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  defaultAddress: DeliveryAddress | undefined;

  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addVirtualCredits: (amountUSD: number) => void;
  resetDemoData: () => void;

  // Demo Orders
  orders: DemoOrder[];
  createDemoOrder: (params: {
    items: CartItem[];
    deliveryAddress: DeliveryAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
  }) => DemoOrder;
  advanceOrderStage: (orderId: string, targetStage?: number) => void;
  getOrderById: (orderId: string) => DemoOrder | undefined;

  // Recently Viewed
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Receipt Modal
  receiptOrder: DemoOrder | null;
  isReceiptOpen: boolean;
  openReceipt: (order: DemoOrder) => void;
  closeReceipt: () => void;

  // Authentication & Demo Account
  signUpDemoAccount: (name: string, email: string, phone: string, country: string) => void;
  signInDemoAccount: (email: string) => boolean;
  signOutDemoAccount: () => void;

  // Toast Notifications
  toasts: Toast[];
  showToast: (
    message: string,
    type?: 'success' | 'info' | 'error',
    options?: { actionLabel?: string; onAction?: () => void; orderId?: string }
  ) => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Helper to parse URL hash for deep linking and back-button support
function parseHashRoute(): { view: ActiveView; orderId?: string; productId?: string } {
  try {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    if (!rawHash) return { view: 'mall' };

    const [routePart, queryPart] = rawHash.split('?');
    const params = new URLSearchParams(queryPart || '');

    const validViews: ActiveView[] = [
      'mall',
      'product-detail',
      'cart',
      'checkout',
      'order-confirmation',
      'tracking',
      'profile',
      'deals',
      'compare',
    ];

    const view = validViews.includes(routePart as ActiveView) ? (routePart as ActiveView) : 'mall';
    const orderId = params.get('orderId') || undefined;
    const productId = params.get('productId') || params.get('id') || undefined;

    return { view, orderId, productId };
  } catch {
    return { view: 'mall' };
  }
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = typeof window !== 'undefined' ? parseHashRoute() : { view: 'mall' as ActiveView };

  const [activeView, setActiveViewState] = useState<ActiveView>(initialRoute.view);
  const [selectedProductId, setSelectedProductIdState] = useState<string | null>(
    initialRoute.productId || null
  );
  const [selectedOrderId, setSelectedOrderIdState] = useState<string | null>(
    initialRoute.orderId || null
  );

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isSpinWheelOpen, setIsSpinWheelOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceFilterMax, setPriceFilterMax] = useState(2000);
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string | null>(null);

  // Direct checkout
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(null);

  // Persistent States
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    return (saved as Currency) || 'USD';
  });

  const [country, setCountryState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.COUNTRY) || 'Pakistan';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['phone-01', 'men-01', 'women-01'];
    } catch {
      return ['phone-01', 'men-01'];
    }
  });

  const [compareList, setCompareList] = useState<Product[]>([]);

  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });

  const [orders, setOrders] = useState<DemoOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return saved ? JSON.parse(saved) : ['phone-01', 'men-02', 'home-01'];
    } catch {
      return ['phone-01'];
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Toast messages
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'error' = 'success',
    options?: { actionLabel?: string; onAction?: () => void; orderId?: string }
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
        orderId: options?.orderId,
      },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Navigate to with URL hash synchronization
  const navigateTo = (
    view: ActiveView,
    params?: { orderId?: string; productId?: string },
    replace = false
  ) => {
    let hash = `#${view}`;
    const queryParams = new URLSearchParams();
    if (params?.orderId) queryParams.set('orderId', params.orderId);
    if (params?.productId) queryParams.set('productId', params.productId);
    const qStr = queryParams.toString();
    if (qStr) hash += `?${qStr}`;

    try {
      if (replace) {
        window.history.replaceState({ view, ...params }, '', hash);
      } else {
        window.history.pushState({ view, ...params }, '', hash);
      }
    } catch {
      // ignore state push issues in sandboxed frames
    }

    setActiveViewState(view);
    if (params?.orderId !== undefined) {
      setSelectedOrderIdState(params.orderId);
    }
    if (params?.productId !== undefined) {
      setSelectedProductIdState(params.productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setActiveView = (view: ActiveView) => {
    navigateTo(view);
  };

  const setSelectedOrderId = (id: string | null) => {
    setSelectedOrderIdState(id);
    if (id && activeView === 'tracking') {
      navigateTo('tracking', { orderId: id }, true);
    }
  };

  const setSelectedProductId = (id: string | null) => {
    setSelectedProductIdState(id);
    if (id && activeView === 'product-detail') {
      navigateTo('product-detail', { productId: id }, true);
    }
  };

  // Listen to browser Back / Forward (popstate & hashchange)
  useEffect(() => {
    const handlePopState = () => {
      const route = parseHashRoute();
      setActiveViewState(route.view);
      if (route.orderId !== undefined) {
        setSelectedOrderIdState(route.orderId);
      }
      if (route.productId !== undefined) {
        setSelectedProductIdState(route.productId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, c);
  };

  const setCountry = (ctry: string) => {
    setCountryState(ctry);
    localStorage.setItem(STORAGE_KEYS.COUNTRY, ctry);
  };

  // Theme state & dark mode toggle
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Digital Order Receipt Modal state
  const [receiptOrder, setReceiptOrder] = useState<DemoOrder | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const openReceipt = (order: DemoOrder) => {
    setReceiptOrder(order);
    setIsReceiptOpen(true);
  };

  const closeReceipt = () => {
    setIsReceiptOpen(false);
  };

  // Notifications Management
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notification history cleared', 'info');
  };

  const requestBrowserNotificationPermission = async (): Promise<
    NotificationPermission | 'unsupported'
  > => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Browser notifications are not supported in this browser.', 'info');
      return 'unsupported';
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Browser alerts enabled! You will be notified on order updates.', 'success');
        try {
          new Notification('OMNIMART Demo Mall', {
            body: 'Delivery notifications active! 30s represents one simulated day.',
          });
        } catch {
          // ignore
        }
      } else {
        showToast('Browser alert permission was not granted.', 'info');
      }
      return permission;
    } catch {
      return 'denied';
    }
  };

  // Delivery Stage Watcher: Automatic Out-for-Delivery and Delivered Notifications
  // Runs every second, checking each demo order against elapsed time.
  // Uses deterministic notification IDs (`notif-${order.id}-${type}`) so notifications
  // are created exactly once and never duplicated upon page reloads.
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  // Initialize notifiedIds from stored notifications
  useEffect(() => {
    const ids = new Set<string>();
    notifications.forEach((n) => ids.add(n.id));
    notifiedIdsRef.current = ids;
  }, [notifications]);

  useEffect(() => {
    if (orders.length === 0) return;

    const checkDeliveryTransitions = () => {
      const now = Date.now();

      orders.forEach((ord) => {
        const liveStatus = computeLiveOrderStatus(ord, now);

        // 1. Check Out for Delivery (Stage 4)
        if (liveStatus.currentStageIndex >= 4) {
          const notifId = `notif-${ord.id}-out_for_delivery`;
          if (!notifiedIdsRef.current.has(notifId)) {
            notifiedIdsRef.current.add(notifId);

            const newNotif: AppNotification = {
              id: notifId,
              orderId: ord.id,
              orderNumber: ord.orderNumber,
              type: 'out_for_delivery',
              title: `Order #${ord.orderNumber} is Out for Delivery!`,
              message: `Your demo order #${ord.orderNumber} is on the delivery vehicle and en route to ${ord.deliveryAddress.city}.`,
              timestamp: now,
              read: false,
            };

            setNotifications((prev) => [newNotif, ...prev]);

            // Interactive in-app alert toast
            showToast(
              `🚚 Order #${ord.orderNumber} is Out for Delivery!`,
              'info',
              {
                actionLabel: 'Track Order',
                onAction: () => navigateTo('tracking', { orderId: ord.id }),
                orderId: ord.id,
              }
            );

            // Browser Notification (if granted)
            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              try {
                new Notification(`OMNIMART — Order #${ord.orderNumber}`, {
                  body: `Your order is out for delivery to ${ord.deliveryAddress.city}!`,
                });
              } catch {
                // ignore
              }
            }
          }
        }

        // 2. Check Delivered (Stage 5)
        if (liveStatus.currentStageIndex >= 5) {
          const notifId = `notif-${ord.id}-delivered`;
          if (!notifiedIdsRef.current.has(notifId)) {
            notifiedIdsRef.current.add(notifId);

            const newNotif: AppNotification = {
              id: notifId,
              orderId: ord.id,
              orderNumber: ord.orderNumber,
              type: 'delivered',
              title: `Order #${ord.orderNumber} Delivered!`,
              message: `Your simulated parcel has arrived safely at ${ord.deliveryAddress.streetAddress}, ${ord.deliveryAddress.city}.`,
              timestamp: now,
              read: false,
            };

            setNotifications((prev) => [newNotif, ...prev]);

            // Interactive in-app alert toast
            showToast(
              `🎉 Order #${ord.orderNumber} has been Delivered!`,
              'success',
              {
                actionLabel: 'View Order',
                onAction: () => navigateTo('tracking', { orderId: ord.id }),
                orderId: ord.id,
              }
            );

            // Browser Notification (if granted)
            if (
              typeof window !== 'undefined' &&
              'Notification' in window &&
              Notification.permission === 'granted'
            ) {
              try {
                new Notification(`OMNIMART — Order Delivered!`, {
                  body: `Demo order #${ord.orderNumber} has been marked delivered.`,
                });
              } catch {
                // ignore
              }
            }
          }
        }
      });
    };

    // Run check immediately on mount/order update
    checkDeliveryTransitions();

    // Set recurring 1-second interval
    const interval = setInterval(checkDeliveryTransitions, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  // Demo Account Authentication Actions
  const signUpDemoAccount = (name: string, email: string, phone: string, country: string) => {
    setProfile((prev) => ({
      ...prev,
      name,
      email,
      phone,
      country,
      isSignedIn: true,
    }));
    showToast(`Welcome to OMNIMART, ${name}! Demo account created.`, 'success');
  };

  const signInDemoAccount = (email: string) => {
    setProfile((prev) => ({
      ...prev,
      email,
      isSignedIn: true,
    }));
    showToast(`Signed in successfully as ${profile.name}`, 'success');
    return true;
  };

  const signOutDemoAccount = () => {
    setProfile((prev) => ({
      ...prev,
      isSignedIn: false,
    }));
    showToast('Signed out of demo account', 'info');
  };

  // Cart calculations
  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalUSD = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = (
    product: Product,
    options?: {
      quantity?: number;
      color?: string;
      size?: string;
      compatibility?: string;
      openDrawer?: boolean;
    }
  ) => {
    const quantity = options?.quantity || 1;
    const selectedColor =
      options?.color ||
      (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const selectedSize =
      options?.size ||
      (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedCompatibility =
      options?.compatibility ||
      (product.compatibility && product.compatibility.length > 0
        ? product.compatibility[0]
        : undefined);

    const cartItemId = `${product.id}_${selectedColor || 'def'}_${selectedSize || 'def'}_${
      selectedCompatibility || 'def'
    }`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          quantity,
          selectedColor,
          selectedSize,
          selectedCompatibility,
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.title.slice(0, 24)}..." to cart`, 'success');

    if (options?.openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Direct Buy Now flow
  const initiateBuyNow = (
    product: Product,
    options?: {
      quantity?: number;
      color?: string;
      size?: string;
      compatibility?: string;
    }
  ) => {
    const quantity = options?.quantity || 1;
    const selectedColor =
      options?.color ||
      (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const selectedSize =
      options?.size ||
      (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedCompatibility =
      options?.compatibility ||
      (product.compatibility && product.compatibility.length > 0
        ? product.compatibility[0]
        : undefined);

    const directItem: CartItem = {
      cartItemId: `buynow_${product.id}_${Date.now()}`,
      product,
      quantity,
      selectedColor,
      selectedSize,
      selectedCompatibility,
    };

    setDirectBuyItem(directItem);
    navigateTo('checkout');
  };

  const clearDirectBuyItem = () => {
    setDirectBuyItem(null);
  };

  // Coupons
  const applyCoupon = (rawCode: string): boolean => {
    const code = rawCode.trim().toUpperCase();
    setCouponError(null);

    const found = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!found) {
      setCouponError(`Coupon code "${code}" is invalid or expired.`);
      return false;
    }

    const currentSubtotal = directBuyItem
      ? directBuyItem.product.price * directBuyItem.quantity
      : cartSubtotalUSD;

    if (found.minSpendUSD && currentSubtotal < found.minSpendUSD) {
      setCouponError(`"${found.code}" requires a minimum spend of $${found.minSpendUSD.toFixed(2)}.`);
      return false;
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('Comparison limit reached (max 4 products)', 'info');
          return prev;
        }
        showToast(`Added "${product.title.slice(0, 24)}..." to compare list`, 'success');
        return [...prev, product];
      }
    });
  };

  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);
  const clearCompare = () => setCompareList([]);

  // Address management
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const id = `addr-${Date.now()}`;
    const newAddress: DeliveryAddress = { ...addr, id };
    setAddresses((prev) => {
      if (newAddress.isDefault) {
        return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddress];
    });
    showToast('Delivery address saved successfully', 'success');
  };

  const updateAddress = (id: string, updates: Partial<DeliveryAddress>) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updates };
        }
        if (updates.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
    showToast('Address updated successfully', 'success');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast('Default address updated', 'success');
  };

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  // Profile
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profile updated', 'success');
  };

  const addVirtualCredits = (amountUSD: number) => {
    setProfile((prev) => ({
      ...prev,
      virtualCreditsUSD: prev.virtualCreditsUSD + amountUSD,
    }));
    showToast(`Added $${amountUSD.toFixed(2)} virtual store credits!`, 'success');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    setCart([]);
    setOrders([]);
    setWishlist([]);
    setNotifications([]);
    notifiedIdsRef.current.clear();
    setProfile(DEFAULT_PROFILE);
    showToast('All demo mall data reset to defaults', 'info');
  };

  // Demo Order creation
  const createDemoOrder = ({
    items,
    deliveryAddress,
    shippingMethod,
    paymentMethod,
  }: {
    items: CartItem[];
    deliveryAddress: DeliveryAddress;
    shippingMethod: ShippingMethod;
    paymentMethod: PaymentMethod;
  }): DemoOrder => {
    const subtotalUSD = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let shippingFeeUSD = 0;
    if (shippingMethod === 'express') shippingFeeUSD = 12.0;
    if (shippingMethod === 'economy') shippingFeeUSD = 3.99;
    if (shippingMethod === 'standard') shippingFeeUSD = subtotalUSD > 50 ? 0 : 5.99;

    let discountUSD = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discountUSD = (subtotalUSD * appliedCoupon.value) / 100;
      } else if (appliedCoupon.type === 'fixed') {
        discountUSD = Math.min(subtotalUSD, appliedCoupon.value);
      } else if (appliedCoupon.type === 'free_shipping') {
        discountUSD = shippingFeeUSD;
        shippingFeeUSD = 0;
      }
    }

    const taxableAmount = Math.max(0, subtotalUSD - discountUSD);
    const taxUSD = taxableAmount * 0.05; // 5% simulated sales tax
    const totalUSD = Math.max(0, taxableAmount + shippingFeeUSD + taxUSD);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `OMNI-${randomSuffix}`;

    const newOrder: DemoOrder = {
      id: `ord-${Date.now()}-${randomSuffix}`,
      orderNumber,
      createdAt: Date.now(),
      items,
      subtotalUSD,
      discountUSD,
      shippingFeeUSD,
      taxUSD,
      totalUSD,
      currency,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : undefined,
      deliveryAddress,
      shippingMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery (Demo)' : 'Simulated Paid',
      isDemo: true,
      simulatedSpeedSecondsPerDay: 30, // 30 seconds per day as strictly required!
    };

    // If paid via virtual credit, deduct balance
    if (paymentMethod === 'virtual_credit') {
      setProfile((prev) => ({
        ...prev,
        virtualCreditsUSD: Math.max(0, prev.virtualCreditsUSD - totalUSD),
      }));
    }

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart or direct item so pressing Back NEVER resubmits
    if (directBuyItem) {
      setDirectBuyItem(null);
    } else {
      clearCart();
    }
    setAppliedCoupon(null);

    // Route to confirmation page with browser history entry
    navigateTo('order-confirmation', { orderId: newOrder.id });

    showToast(`Order ${orderNumber} created! Tracking timeline started.`, 'success');
    return newOrder;
  };

  const advanceOrderStage = (orderId: string, targetStage?: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const currentOverride =
            typeof ord.manualStageOverride === 'number' ? ord.manualStageOverride : 0;
          const next =
            typeof targetStage === 'number' ? targetStage : Math.min(5, currentOverride + 1);
          return { ...ord, manualStageOverride: next };
        }
        return ord;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) =>
        o.id.toLowerCase() === orderId.toLowerCase() ||
        o.orderNumber.toLowerCase() === orderId.toLowerCase()
    );
  };

  // Recently Viewed
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== product.id);
      return [product.id, ...filtered].slice(0, 8);
    });
  };

  const recentlyViewed = recentlyViewedIds
    .map((id) => INITIAL_PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return (
    <ShopContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateTo,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        isSurpriseModalOpen,
        setIsSurpriseModalOpen,
        isSpinWheelOpen,
        setIsSpinWheelOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        editingAddress,
        setEditingAddress,
        notifications,
        unreadNotificationCount,
        isNotificationOpen,
        setIsNotificationOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        requestBrowserNotificationPermission,
        currency,
        setCurrency,
        country,
        setCountry,
        products: INITIAL_PRODUCTS,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        activeSubcategory,
        setActiveSubcategory,
        sortBy,
        setSortBy,
        priceFilterMax,
        setPriceFilterMax,
        selectedBadgeFilter,
        setSelectedBadgeFilter,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotalUSD,
        directBuyItem,
        initiateBuyNow,
        clearDirectBuyItem,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        defaultAddress,
        profile,
        updateProfile,
        addVirtualCredits,
        resetDemoData,
        orders,
        createDemoOrder,
        advanceOrderStage,
        getOrderById,
        recentlyViewed,
        addToRecentlyViewed,
        theme,
        toggleTheme,
        receiptOrder,
        isReceiptOpen,
        openReceipt,
        closeReceipt,
        signUpDemoAccount,
        signInDemoAccount,
        signOutDemoAccount,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
