import React from 'react';
import {
  Flame,
  Zap,
  Gift,
  HelpCircle,
  Shirt,
  Sparkles,
  Smartphone,
  Tv,
  Home,
  Baby,
  Dumbbell,
  Compass,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/categories';

interface CategoryBarProps {
  onOpenSurprise: () => void;
  onOpenSpin: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  onOpenSurprise,
  onOpenSpin,
}) => {
  const {
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    activeView,
    setActiveView,
    selectedBadgeFilter,
    setSelectedBadgeFilter,
  } = useShop();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="bg-white border-b border-neutral-200">
      {/* Primary Category Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2.5 text-xs font-medium text-neutral-600">
          <div className="flex items-center gap-1.5 shrink-0">
            {/* All Products */}
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveSubcategory('all');
                setSelectedBadgeFilter(null);
                if (activeView !== 'mall') setActiveView('mall');
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all' && !selectedBadgeFilter && activeView === 'mall'
                  ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                  : 'hover:bg-neutral-100 text-neutral-700'
              }`}
            >
              All Departments
            </button>

            {/* Main Categories */}
            {CATEGORIES.slice(0, 8).map((cat) => {
              const isSelected = activeCategory === cat.id && activeView === 'mall';
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveSubcategory('all');
                    setSelectedBadgeFilter(null);
                    if (activeView !== 'mall') setActiveView('mall');
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {cat.id === 'mens-fashion' && <Shirt className="w-3.5 h-3.5" />}
                  {cat.id === 'womens-fashion' && <Sparkles className="w-3.5 h-3.5" />}
                  {cat.id === 'phone-accessories' && <Smartphone className="w-3.5 h-3.5" />}
                  {cat.id === 'electronics' && <Tv className="w-3.5 h-3.5" />}
                  {cat.id === 'home-living' && <Home className="w-3.5 h-3.5" />}
                  {cat.id === 'kids-fashion' && <Baby className="w-3.5 h-3.5" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-neutral-200">
            {/* Deals */}
            <button
              onClick={() => {
                if (activeView === 'deals') {
                  setActiveView('mall');
                } else {
                  setActiveView('deals');
                }
              }}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 text-rose-600 font-semibold whitespace-nowrap ${
                activeView === 'deals' ? 'bg-rose-100' : 'hover:bg-rose-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-rose-600" />
              <span>Flash Deals</span>
            </button>

            {/* Spin to Win Coupon */}
            <button
              onClick={onOpenSpin}
              className="px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Spin for Coupon</span>
            </button>

            {/* Surprise Me discovery */}
            <button
              onClick={onOpenSurprise}
              className="px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-800 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Row (shows when a category is selected) */}
      {currentCategoryObj && (
        <div className="bg-neutral-50/80 border-t border-neutral-200/60 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
              <span className="text-neutral-400 font-medium shrink-0 mr-1">Subcategory:</span>
              {currentCategoryObj.subcategories.map((subcat) => {
                const isSubSelected =
                  (subcat === 'All Men' ||
                    subcat === 'All Women' ||
                    subcat === 'All Accessories' ||
                    subcat === 'All Electronics' ||
                    subcat === 'All Home' ||
                    subcat === 'All Kids')
                    ? activeSubcategory === 'all'
                    : activeSubcategory === subcat;

                return (
                  <button
                    key={subcat}
                    onClick={() => {
                      if (
                        subcat === 'All Men' ||
                        subcat === 'All Women' ||
                        subcat === 'All Accessories' ||
                        subcat === 'All Electronics' ||
                        subcat === 'All Home' ||
                        subcat === 'All Kids'
                      ) {
                        setActiveSubcategory('all');
                      } else {
                        setActiveSubcategory(subcat);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      isSubSelected
                        ? 'bg-neutral-800 text-white font-medium shadow-xs'
                        : 'bg-white text-neutral-600 border border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    {subcat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
