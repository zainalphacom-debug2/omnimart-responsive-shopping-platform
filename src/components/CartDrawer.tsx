import React, { useState } from 'react';
import {
  X,
  Trash2,
  Heart,
  ArrowRight,
  ShoppingBag,
  Tag,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotalUSD,
    cartTotalCount,
    currency,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    toggleWishlist,
    setActiveView,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isCartDrawerOpen) return null;

  // Shipping threshold ($50 for free standard shipping)
  const freeShippingThresholdUSD = 50;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotalUSD / freeShippingThresholdUSD) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThresholdUSD - cartSubtotalUSD);

  // Discount calculation
  let discountUSD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountUSD = (cartSubtotalUSD * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discountUSD = Math.min(cartSubtotalUSD, appliedCoupon.value);
    }
  }

  const simulatedTaxUSD = Math.max(0, (cartSubtotalUSD - discountUSD) * 0.05);
  const simulatedShippingFeeUSD = cartSubtotalUSD >= freeShippingThresholdUSD || (appliedCoupon && appliedCoupon.type === 'free_shipping') ? 0 : 5.99;
  const totalUSD = Math.max(0, cartSubtotalUSD - discountUSD + simulatedShippingFeeUSD + simulatedTaxUSD);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900">
                Shopping Cart ({cartTotalCount})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="text-xs text-neutral-500 hover:text-rose-600 transition-colors p-1"
                  title="Clear Cart"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-700">
                  {amountNeededForFreeShipping === 0 ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Free Standard Delivery Unlocked!
                    </span>
                  ) : (
                    <span>
                      Add <strong>{formatPrice(amountNeededForFreeShipping, currency)}</strong> for Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium tabular-nums">
                  {progressToFreeShipping}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-800 mb-1">Your Cart is Empty</h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs">
                  Discover curated men's and women's fashion, titanium phone cases, and ambient home living.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="py-4 first:pt-0 last:pb-0 flex gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 leading-snug line-clamp-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                        {item.selectedColor && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700 font-semibold">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedCompatibility && (
                          <span className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                            {item.selectedCompatibility}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-semibold text-neutral-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(
                              item.cartItemId,
                              Math.min(item.product.stock, item.quantity + 1)
                            )
                          }
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price total */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-neutral-900 tabular-nums">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Totals, Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50/50">
              {/* Coupon Form */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        Coupon <strong>{appliedCoupon.code}</strong> applied!
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-500 hover:text-rose-600 font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (e.g. WELCOME10)"
                        className="w-full bg-white text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 mb-4 pb-3 border-b border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-800 tabular-nums">
                    {formatPrice(cartSubtotalUSD, currency)}
                  </span>
                </div>
                {discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold tabular-nums">
                      -{formatPrice(discountUSD, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Simulated Delivery</span>
                  <span className="font-semibold text-neutral-800 tabular-nums">
                    {simulatedShippingFeeUSD === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      formatPrice(simulatedShippingFeeUSD, currency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Demo Tax (5%)</span>
                  <span className="font-semibold text-neutral-800 tabular-nums">
                    {formatPrice(simulatedTaxUSD, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-1 border-t border-neutral-200">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">{formatPrice(totalUSD, currency)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-neutral-400 mt-2">
                Simulated Sandbox Checkout · No Real Payment Required
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-xl">
            <h4 className="text-sm font-bold text-neutral-900 mb-2">Clear Shopping Cart?</h4>
            <p className="text-xs text-neutral-500 mb-4">
              Are you sure you want to remove all items from your current cart?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2 px-3 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setShowClearConfirm(false);
                }}
                className="py-2 px-3 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
