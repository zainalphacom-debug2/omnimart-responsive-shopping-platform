import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  SlidersHorizontal,
  ChevronDown,
  Globe,
  Wallet,
  Sparkles,
  Zap,
  X,
  Menu,
  Bell,
  Truck,
  Sun,
  Moon,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CURRENCY_CONFIGS, formatPrice } from '../utils/pricing';
import { Currency } from '../types';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenProfile: () => void;
}

const COUNTRIES = [
  'Pakistan',
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Germany',
  'Saudi Arabia',
];

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav, onOpenProfile }) => {
  const {
    activeView,
    setActiveView,
    cartTotalCount,
    setIsCartDrawerOpen,
    wishlist,
    compareList,
    currency,
    setCurrency,
    country,
    setCountry,
    searchQuery,
    setSearchQuery,
    profile,
    products,
    setSelectedProductId,
    addVirtualCredits,
    showToast,
    navigateTo,
    unreadNotificationCount,
    setIsNotificationOpen,
    theme,
    toggleTheme,
  } = useShop();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCurrencyDropdownOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered suggestions for autocomplete
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* 1. Top Announcement Bar */}
      <div className="bg-neutral-900 text-neutral-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-medium text-white tracking-wide">OMNIMART DEMO MALL</span>
            <span className="hidden sm:inline text-neutral-400">·</span>
            <span className="hidden sm:inline text-neutral-300">
              100% Free Virtual Shopping Simulation — No Real Charges
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <span className="text-amber-400 font-medium">Use Code: WELCOME10 (10% Off)</span>
            <button
              onClick={() => {
                addVirtualCredits(100);
              }}
              className="hidden md:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer transition-colors"
              title="Add $100 free demo shopping credits"
            >
              <Wallet className="w-3 h-3" />
              <span>+ $100 Free Demo Credit</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {/* Mobile Menu Button + Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenMobileNav}
              className="lg:hidden p-2 -ml-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => {
                setActiveView('mall');
                setSelectedProductId(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col text-left group cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 group-hover:text-rose-600 transition-colors">
                  OMNIMART
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              </div>
              <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-semibold hidden sm:inline">
                Your World. One Cart.
              </span>
            </button>
          </div>

          {/* Search Bar with live autocomplete */}
          <div
            ref={searchContainerRef}
            className="flex-1 max-w-2xl relative hidden md:block"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search 1,000+ demo products, brands, or phone models..."
                className="w-full bg-neutral-100 hover:bg-neutral-50 focus:bg-white text-sm text-neutral-900 placeholder-neutral-500 pl-10 pr-10 py-2.5 rounded-full border border-transparent focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50">
                <div className="p-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  Search Results ({searchSuggestions.length})
                </div>
                {searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          setActiveView('product-detail');
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 object-cover rounded-lg bg-neutral-100 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {prod.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {prod.subcategory} · {prod.brand}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                          {formatPrice(prod.price, currency)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-neutral-500">
                    No demo products found for "{searchQuery}". Try searching for "shirt", "case", "headphones", or "charger".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Desktop "Track My Order" Button */}
            <button
              onClick={() => navigateTo('tracking')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-800 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-full transition-colors cursor-pointer"
              title="Track live 30s delivery simulation"
            >
              <Truck className="w-3.5 h-3.5 text-rose-600" />
              <span>Track My Order</span>
            </button>

            {/* Mobile "Track Order" Pill */}
            <button
              onClick={() => navigateTo('tracking')}
              className="sm:hidden flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer"
              title="Track Order"
            >
              <Truck className="w-3 h-3" />
              <span>Track</span>
            </button>

            {/* Delivery Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-1.5 sm:p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Delivery Notifications & Tracking Alerts"
              aria-label="Delivery Notifications"
            >
              <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Currency & Country Selector (hidden on small phones, available in menu drawer) */}
            <div className="relative hidden lg:block" ref={currencyDropdownRef}>
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
                title="Change Country & Currency"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-semibold">{currency}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-neutral-100 p-3 z-50">
                  <div className="mb-3">
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Delivery Destination
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Display Currency
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(Object.keys(CURRENCY_CONFIGS) as Currency[]).map((cCode) => (
                        <button
                          key={cCode}
                          onClick={() => {
                            setCurrency(cCode);
                            setIsCurrencyDropdownOpen(false);
                            showToast(`Currency changed to ${cCode}`, 'info');
                          }}
                          className={`text-left text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                            currency === cCode
                              ? 'bg-neutral-900 text-white'
                              : 'text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          {CURRENCY_CONFIGS[cCode].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compare items shortcut (if 1+ items selected) */}
            {compareList.length > 0 && (
              <button
                onClick={() => setActiveView('compare')}
                className="relative hidden md:block p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                title={`Compare ${compareList.length} products`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* Wishlist Shortcut */}
            <button
              onClick={() => {
                onOpenProfile();
              }}
              className="relative hidden md:block p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex p-1.5 sm:p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* User Profile / Account Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Account & Orders"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-neutral-300 bg-neutral-100 shrink-0">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-800 leading-tight">
                  {profile.isSignedIn ? profile.name : 'Sign In / Register'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold tabular-nums">
                  {profile.isSignedIn
                    ? `${formatPrice(profile.virtualCreditsUSD, currency)} Demo`
                    : 'Free Demo Access'}
                </span>
              </div>
            </button>

            {/* Cart Button with live count */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
              aria-label={`Shopping Cart with ${cartTotalCount} items`}
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {cartTotalCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or devices..."
              className="w-full bg-neutral-100 text-xs text-neutral-900 placeholder-neutral-500 pl-9 pr-8 py-2 rounded-full border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
