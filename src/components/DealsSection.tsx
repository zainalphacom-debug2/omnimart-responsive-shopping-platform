import React from 'react';
import { Zap, Tag, Check, Copy, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AVAILABLE_COUPONS } from '../utils/pricing';
import { ProductCard } from './ProductCard';

export const DealsSection: React.FC = () => {
  const {
    products,
    applyCoupon,
    appliedCoupon,
    setActiveView,
    showToast,
  } = useShop();

  // Filter products with badges or discounts
  const dealProducts = products.filter(
    (p) => p.badge === 'Deal' || (p.originalPrice && p.originalPrice > p.price)
  );

  const handleCopyAndApply = (code: string) => {
    applyCoupon(code);
    navigator.clipboard?.writeText(code);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Deals Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 fill-rose-600" />
            <span>Exclusive Virtual Mall Discounts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Today's Promotional Deals & Codes
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl">
            Apply test coupons directly to your cart or explore clearance and promotional pricing.
          </p>
        </div>

        <button
          onClick={() => setActiveView('mall')}
          className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
        >
          Back to Full Mall
        </button>
      </div>

      {/* Available Coupon Codes Grid */}
      <div className="mb-12">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
          Active Demo Promo Codes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_COUPONS.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <div
                key={coupon.code}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-extrabold text-sm px-2.5 py-1 bg-neutral-900 text-white rounded-lg">
                      {coupon.code}
                    </span>
                    {isApplied && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Applied
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 font-medium leading-relaxed mb-4">
                    {coupon.description}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyAndApply(coupon.code)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{isApplied ? 'Coupon Active' : 'Apply to Cart'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Deals Product Grid */}
      <div>
        <h3 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>Discounted Mall Highlights ({dealProducts.length})</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
