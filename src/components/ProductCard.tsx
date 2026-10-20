import React from 'react';
import { Heart, ShoppingCart, Zap, Eye, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    currency,
    addToCart,
    initiateBuyNow,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setSelectedProductId,
    setActiveView,
    setQuickViewProduct,
    addToRecentlyViewed,
  } = useShop();

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleOpenDetail = () => {
    addToRecentlyViewed(product);
    setSelectedProductId(product.id);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <button
          onClick={handleOpenDetail}
          className="w-full h-full cursor-pointer block focus:outline-none"
          tabIndex={0}
          aria-label={`View details for ${product.title}`}
        >
          <ProductImage
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs ${
                product.badge === 'Deal'
                  ? 'bg-rose-500 text-white'
                  : product.badge === 'Trending'
                  ? 'bg-amber-500 text-white'
                  : product.badge === 'Premium'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick action buttons floating on image */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-transform hover:scale-110 cursor-pointer shadow-xs ${
              isFavorited
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToRecentlyViewed(product);
              setQuickViewProduct(product);
            }}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-neutral-700 hover:bg-white hover:text-neutral-900 transition-transform hover:scale-110 cursor-pointer shadow-xs"
            title="Quick Preview"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compare checkbox in bottom left of image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium backdrop-blur-md transition-all cursor-pointer flex items-center gap-1 ${
            isCompared
              ? 'bg-violet-600 text-white shadow-xs'
              : 'bg-white/70 hover:bg-white text-neutral-600'
          }`}
          title="Compare specifications"
        >
          {isCompared && <Check className="w-2.5 h-2.5" />}
          <span>{isCompared ? 'Comparing' : 'Compare'}</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span className="truncate uppercase tracking-wider text-[10px] font-semibold text-neutral-400">
            {product.subcategory}
          </span>
          <div className="flex items-center gap-1 shrink-0 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-neutral-700 tabular-nums">
              {product.rating}
            </span>
            <span className="text-[10px] text-neutral-400 tabular-nums hidden xs:inline">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product Title */}
        <button
          onClick={handleOpenDetail}
          className="text-left font-semibold text-neutral-900 text-xs sm:text-sm line-clamp-2 hover:text-rose-600 transition-colors cursor-pointer mb-2 leading-snug"
        >
          {product.title}
        </button>

        {/* Variant hints (colors or sizes) */}
        <div className="flex items-center gap-1 mb-2.5 h-4 overflow-hidden">
          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[9px] text-neutral-400">+{product.colors.length - 4}</span>
              )}
            </div>
          ) : product.compatibility && product.compatibility.length > 0 ? (
            <span className="text-[10px] text-neutral-400 truncate">
              Fits: {product.compatibility[0]}
            </span>
          ) : (
            <span className="text-[10px] text-emerald-600 font-medium">In Demo Stock</span>
          )}
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-2 border-t border-neutral-100 flex items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-neutral-900 tabular-nums">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-neutral-400 whitespace-nowrap">
            ~{product.deliveryEstimateDays}d demo
          </span>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 mt-3 pt-1">
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="truncate">Add</span>
          </button>

          <button
            onClick={() => initiateBuyNow(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            title="Buy Now (Fast Checkout)"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
