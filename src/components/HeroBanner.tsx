import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, RefreshCw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductImage } from './ProductImage';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveSubcategory, setActiveView } = useShop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6">
      {/* Main Editorial Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[380px] sm:min-h-[460px] flex items-center shadow-xl">
        {/* Background Image with Contrast Scrim */}
        <div className="absolute inset-0">
          <ProductImage
            src="/src/assets/images/hero_omnimart_mall_1792524587318.jpg"
            alt="OMNIMART Virtual Shopping Mall Atrium"
            className="w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-rose-300 font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Shopping Mall Experience</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-4 text-balance">
            Your World. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-200 to-rose-200">
              One Cart.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8 max-w-lg">
            Spend your leisure time browsing designer clothing, MagSafe phone accessories, and luxury living. Complete simulated orders with live 30-second virtual delivery tracking.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveSubcategory('all');
                window.scrollTo({ top: 560, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Mall Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('deals')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors cursor-pointer"
            >
              View Daily Deals
            </button>
          </div>
        </div>
      </div>

      {/* 3 Interactive Highlight Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Pillar 1: Phone Accessories */}
        <div
          onClick={() => {
            setActiveCategory('phone-accessories');
            setActiveSubcategory('all');
            window.scrollTo({ top: 560, behavior: 'smooth' });
          }}
          className="group relative rounded-2xl overflow-hidden bg-neutral-900 min-h-[170px] flex items-end p-5 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0">
            <ProductImage
              src="/src/assets/images/category_phone_gadgets_1792524586951.jpg"
              alt="Phone Accessories Showcase"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Department
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors">
              Phone Accessories
            </h3>
            <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
              MagSafe kickstand cases, 65W GaN chargers & braided cables
            </p>
          </div>
        </div>

        {/* Pillar 2: Curated Fashion */}
        <div
          onClick={() => {
            setActiveCategory('mens-fashion');
            setActiveSubcategory('all');
            window.scrollTo({ top: 560, behavior: 'smooth' });
          }}
          className="group relative rounded-2xl overflow-hidden bg-neutral-900 min-h-[170px] flex items-end p-5 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0">
            <ProductImage
              src="/src/assets/images/category_fashion_collection_1792524587342.jpg"
              alt="Fashion Collection Showcase"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Department
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
              Men's & Women's Fashion
            </h3>
            <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
              Heavyweight tees, artisanal shalwar kameez, kurtis & abayas
            </p>
          </div>
        </div>

        {/* Pillar 3: Home & Living */}
        <div
          onClick={() => {
            setActiveCategory('home-living');
            setActiveSubcategory('all');
            window.scrollTo({ top: 560, behavior: 'smooth' });
          }}
          className="group relative rounded-2xl overflow-hidden bg-neutral-900 min-h-[170px] flex items-end p-5 cursor-pointer shadow-sm hover:shadow-md transition-all"
        >
          <div className="absolute inset-0">
            <ProductImage
              src="/src/assets/images/category_lifestyle_home_1792524587388.jpg"
              alt="Home & Living Space"
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Department
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-200 transition-colors">
              Home & Architectural Living
            </h3>
            <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
              Oak lounge chairs, ambient lamps & ceramic accessories
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Simulation Badges strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 py-3 px-4 bg-white rounded-2xl border border-neutral-200/70 text-neutral-600 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-neutral-800 leading-tight">Safe Demo Mall</p>
            <p className="text-[10px] text-neutral-400">Zero real money charged</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <p className="font-semibold text-neutral-800 leading-tight">30s / Day Timeline</p>
            <p className="text-[10px] text-neutral-400">Accelerated simulated shipping</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <RefreshCw className="w-4 h-4 text-sky-600 shrink-0" />
          <div>
            <p className="font-semibold text-neutral-800 leading-tight">Free Virtual Balance</p>
            <p className="text-[10px] text-neutral-400">$500 free demo credit</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <p className="font-semibold text-neutral-800 leading-tight">Explore Freely</p>
            <p className="text-[10px] text-neutral-400">One-click simulated checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};
