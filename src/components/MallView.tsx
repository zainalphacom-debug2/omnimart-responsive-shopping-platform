import React, { useMemo } from 'react';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  X,
  Sparkles,
  Zap,
  Tag,
  Coins,
  Crown,
  Flame,
  Award,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/categories';
import { formatPrice } from '../utils/pricing';

export const MallView: React.FC = () => {
  const {
    products,
    activeCategory,
    activeSubcategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceFilterMax,
    setPriceFilterMax,
    selectedBadgeFilter,
    setSelectedBadgeFilter,
    currency,
    orders,
    navigateTo,
  } = useShop();

  const currentCategoryObj = CATEGORIES.find((c) => c.id === activeCategory);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesSubcat = p.subcategory.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCompat = p.compatibility?.some((c) => c.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCategory && !matchesSubcat && !matchesBrand && !matchesCompat) {
          return false;
        }
      }

      // 2. Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // 3. Subcategory filter
      if (activeSubcategory !== 'all' && p.subcategory !== activeSubcategory) {
        return false;
      }

      // 4. Special collection badge filter
      if (selectedBadgeFilter === 'deals') {
        if (!p.badge || (p.badge !== 'Deal' && !(p.originalPrice && p.originalPrice > p.price))) {
          return false;
        }
      } else if (selectedBadgeFilter === 'under25') {
        if (p.price > 25) return false;
      } else if (selectedBadgeFilter === 'under10') {
        if (p.price > 10) return false;
      } else if (selectedBadgeFilter === 'trending') {
        if (p.badge !== 'Trending') return false;
      } else if (selectedBadgeFilter === 'bestsellers') {
        if (p.badge !== 'Best Seller') return false;
      } else if (selectedBadgeFilter === 'premium') {
        if (p.badge !== 'Premium' && p.price < 80) return false;
      }

      // 5. Price Max filter
      if (p.price > priceFilterMax) {
        return false;
      }

      return true;
    });
  }, [
    products,
    activeCategory,
    activeSubcategory,
    searchQuery,
    selectedBadgeFilter,
    priceFilterMax,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'discount') {
      return list.sort((a, b) => {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    }
    return list; // relevance
  }, [filteredProducts, sortBy]);

  const hasActiveFilters =
    searchQuery ||
    activeCategory !== 'all' ||
    activeSubcategory !== 'all' ||
    selectedBadgeFilter !== null ||
    priceFilterMax < 2000;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBadgeFilter(null);
    setPriceFilterMax(2000);
    setSortBy('relevance');
  };

  return (
    <div>
      {/* Editorial Hero Banner */}
      {activeCategory === 'all' && !searchQuery && !selectedBadgeFilter && (
        <HeroBanner />
      )}

      {/* Main Mall Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Department Title & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : currentCategoryObj
                  ? currentCategoryObj.name
                  : selectedBadgeFilter
                  ? `${selectedBadgeFilter.toUpperCase()} Collection`
                  : 'All Mall Departments'}
              </span>
              <span className="text-xs font-semibold text-neutral-400 tabular-nums">
                ({sortedProducts.length} items)
              </span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {currentCategoryObj
                ? currentCategoryObj.description
                : 'Browse our expansive virtual selection with 30s live delivery simulation.'}
            </p>
          </div>

          {/* Right Controls: Sort Dropdown & Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-neutral-900 cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>

            {/* Clear filters shortcut */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Collection Badges Filter Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-6 text-xs">
          <span className="text-neutral-400 font-medium shrink-0 mr-1 text-[11px]">
            Collections:
          </span>

          <button
            onClick={() => setSelectedBadgeFilter(null)}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
              selectedBadgeFilter === null
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            All Items
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'deals' ? null : 'deals')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'deals'
                ? 'bg-rose-600 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Zap className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>Today's Deals</span>
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'under25' ? null : 'under25')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'under25'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Tag className="w-3 h-3 text-emerald-500" />
            <span>Under $25</span>
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'under10' ? null : 'under10')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'under10'
                ? 'bg-sky-600 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Coins className="w-3 h-3 text-sky-500" />
            <span>Under $10</span>
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'trending' ? null : 'trending')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'trending'
                ? 'bg-amber-500 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-500" />
            <span>Trending</span>
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'bestsellers' ? null : 'bestsellers')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'bestsellers'
                ? 'bg-violet-600 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Award className="w-3 h-3 text-violet-500" />
            <span>Best Sellers</span>
          </button>

          <button
            onClick={() => setSelectedBadgeFilter(selectedBadgeFilter === 'premium' ? null : 'premium')}
            className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              selectedBadgeFilter === 'premium'
                ? 'bg-neutral-900 text-white font-semibold'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Premium Picks</span>
          </button>
        </div>

        {/* Product Cards Responsive Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200 max-w-md mx-auto p-8 shadow-xs">
            <Filter className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800 mb-1">No Matching Products</h3>
            <p className="text-xs text-neutral-500 mb-6">
              We couldn't find any demo products matching your current filters or search term.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-5">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
