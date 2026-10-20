import React, { useState } from 'react';
import { X, Gift, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AVAILABLE_COUPONS } from '../utils/pricing';

export const SpinCouponModal: React.FC = () => {
  const { isSpinWheelOpen, setIsSpinWheelOpen, applyCoupon } = useShop();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonCoupon, setWonCoupon] = useState<typeof AVAILABLE_COUPONS[0] | null>(null);

  if (!isSpinWheelOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonCoupon(null);

    const randomDegrees = 1440 + Math.floor(Math.random() * 360);
    setRotation((prev) => prev + randomDegrees);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = AVAILABLE_COUPONS[Math.floor(Math.random() * AVAILABLE_COUPONS.length)];
      setWonCoupon(chosen);
      applyCoupon(chosen.code);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
        <button
          onClick={() => {
            setIsSpinWheelOpen(false);
            setWonCoupon(null);
          }}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <Gift className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-extrabold text-neutral-900 mb-1">
          Spin & Win Demo Coupon
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Spin for a guaranteed simulated mall discount code for your cart.
        </p>

        {/* Wheel Graphic */}
        <div className="relative w-48 h-48 mx-auto mb-6 flex items-center justify-center">
          {/* Pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-4 h-5 bg-rose-600 clip-triangle shadow-md" />

          {/* Rotating Disc */}
          <div
            className="w-full h-full rounded-full border-4 border-neutral-900 shadow-xl overflow-hidden relative transition-transform duration-[3000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute inset-0 bg-conic from-amber-400 via-rose-500 via-violet-600 to-amber-400 opacity-90" />
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center font-bold text-neutral-900 text-xs shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {wonCoupon ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-4 animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Congratulations! You Won:
            </span>
            <div className="text-xl font-mono font-extrabold text-neutral-900 mb-1">
              {wonCoupon.code}
            </div>
            <p className="text-xs text-emerald-800 font-medium mb-3">
              {wonCoupon.description}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Automatically Applied to Cart!
            </span>
          </div>
        ) : (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isSpinning ? 'Spinning the Wheel...' : 'Spin the Wheel Now'}
          </button>
        )}

        <p className="text-[10px] text-neutral-400 mt-4">
          Non-gambling demo promotion · Free coupons for virtual shopping fun
        </p>
      </div>
    </div>
  );
};
