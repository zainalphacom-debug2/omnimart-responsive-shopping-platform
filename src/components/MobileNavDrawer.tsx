import React from 'react';
import {
  X,
  Shirt,
  Sparkles,
  Smartphone,
  Tv,
  Home,
  Baby,
  Gamepad2,
  Dumbbell,
  Gift,
  Zap,
  Globe,
  Wallet,
  Truck,
  Bell,
  Sun,
  Moon,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/pricing';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenSpin: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProfile,
  onOpenSpin,
}) => {
  const {
    activeCategory,
    setActiveCategory,
    setActiveSubcategory,
    setActiveView,
    navigateTo,
    profile,
    currency,
    orders,
    wishlist,
    compareList,
    unreadNotificationCount,
    setIsNotificationOpen,
    theme,
    toggleTheme,
  } = useShop();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-white dark:bg-neutral-900 shadow-2xl flex flex-col justify-between text-neutral-900 dark:text-neutral-100">
          {/* Header */}
          <div>
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold tracking-tight">
                  OMNIMART
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile banner inside drawer */}
            <div
              onClick={() => {
                onOpenProfile();
                onClose();
              }}
              className="p-4 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-3 cursor-pointer"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">
                  {profile.isSignedIn ? profile.name : 'Sign In / Register'}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                  {profile.isSignedIn
                    ? `${formatPrice(profile.virtualCreditsUSD, currency)} Demo Balance`
                    : 'Tap to manage demo account'}
                </p>
              </div>
            </div>

            {/* Track My Order Banner */}
            <div className="p-3 bg-rose-50/70 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Truck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-rose-900 dark:text-rose-200 leading-tight">
                    Track My Order
                  </p>
                  <p className="text-[10px] text-rose-700 dark:text-rose-300 truncate">
                    {orders.length > 0
                      ? `${orders.length} active simulated order(s)`
                      : 'Live 30s status tracking'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigateTo('tracking');
                  onClose();
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer shrink-0"
              >
                Track Live
              </button>
            </div>

            {/* Delivery Notifications Shortcut */}
            <button
              onClick={() => {
                setIsNotificationOpen(true);
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                <span>Delivery Alerts</span>
              </div>
              {unreadNotificationCount > 0 ? (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadNotificationCount} New
                </span>
              ) : (
                <span className="text-[10px] text-neutral-400">0 updates</span>
              )}
            </button>

            {/* Wishlist & Compare Quick Links */}
            <div className="grid grid-cols-2 divide-x divide-neutral-100 dark:divide-neutral-800 border-b border-neutral-100 dark:border-neutral-800 text-xs font-medium">
              <button
                onClick={() => {
                  onOpenProfile();
                  onClose();
                }}
                className="p-2.5 flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => {
                  navigateTo('compare');
                  onClose();
                }}
                className="p-2.5 flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-violet-500" />
                <span>Compare ({compareList.length})</span>
              </button>
            </div>

            {/* Department Navigation Links */}
            <div className="p-3 overflow-y-auto max-h-[calc(100vh-340px)] space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 py-1 block">
                Departments
              </span>

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveSubcategory('all');
                  navigateTo('mall');
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                All Departments
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubcategory('all');
                    navigateTo('mall');
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2.5 ${
                    activeCategory === cat.id
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {cat.id === 'mens-fashion' && <Shirt className="w-3.5 h-3.5" />}
                  {cat.id === 'womens-fashion' && <Sparkles className="w-3.5 h-3.5" />}
                  {cat.id === 'phone-accessories' && <Smartphone className="w-3.5 h-3.5" />}
                  {cat.id === 'electronics' && <Tv className="w-3.5 h-3.5" />}
                  {cat.id === 'home-living' && <Home className="w-3.5 h-3.5" />}
                  {cat.id === 'kids-fashion' && <Baby className="w-3.5 h-3.5" />}
                  {cat.id === 'gaming-entertainment' && <Gamepad2 className="w-3.5 h-3.5" />}
                  {cat.id === 'sports-fitness' && <Dumbbell className="w-3.5 h-3.5" />}
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  onClick={() => {
                    navigateTo('deals');
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-rose-600" />
                  <span>Flash Deals & Coupons</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSpin();
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Spin for Demo Coupon</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer info & Theme Toggle */}
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-neutral-600 dark:text-neutral-300">OMNIMART Demo Mall</p>
                <p>100% Free Virtual Exploration</p>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
