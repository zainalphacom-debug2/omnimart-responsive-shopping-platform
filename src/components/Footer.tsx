import React from 'react';
import { ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';

export const Footer: React.FC = () => {
  const { setActiveCategory, setActiveSubcategory, setActiveView } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs border-t border-neutral-800 mt-16">
      {/* Back to top strip */}
      <div className="border-b border-neutral-800">
        <button
          onClick={scrollToTop}
          className="w-full py-3 text-center text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xl font-extrabold tracking-tight text-white">
                OMNIMART
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm mb-4">
              Your World. One Cart. An immersive virtual shopping mall designed for leisurely browsing, discovering curated fashion and phone accessories, and experiencing accelerated simulated delivery tracking.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Free Demo Shopping Environment</span>
            </div>
          </div>

          {/* Department Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Key Departments
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setActiveSubcategory('all');
                      setActiveView('mall');
                      scrollToTop();
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shopping Shortcuts */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Discovery
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveView('deals');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Flash Deals & Coupons
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveSubcategory('all');
                    setActiveView('mall');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trending Now
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('phone-accessories');
                    setActiveSubcategory('all');
                    setActiveView('mall');
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Phone & Tech Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Mall Simulation Transparency */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Simulation Rules
            </h4>
            <ul className="space-y-2 text-[11px] text-neutral-400">
              <li>· 30 Real Seconds = 1 Virtual Day</li>
              <li>· Real Credit Cards Not Accepted</li>
              <li>· No Physical Items Shipped</li>
              <li>· All Reviews Illustrative Demo Data</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} OMNIMART Inc. All virtual rights reserved. Demo shopping sandbox.
          </p>

          <p className="flex items-center gap-1">
            Built for seamless browsing across mobile, tablet, and desktop viewports.
          </p>
        </div>
      </div>
    </footer>
  );
};
