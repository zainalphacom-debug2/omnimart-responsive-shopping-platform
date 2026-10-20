import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingCart,
  Zap,
  Check,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

interface ProductDetailProps {
  product: Product;
  isModal?: boolean;
  onClose?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailProps> = ({
  product,
  isModal = false,
  onClose,
}) => {
  const {
    currency,
    country,
    addToCart,
    initiateBuyNow,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    products,
    setSelectedProductId,
    setActiveView,
    addToRecentlyViewed,
  } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>(
    product.compatibility && product.compatibility.length > 0 ? product.compatibility[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'delivery'>('specs');

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      compatibility: selectedCompatibility || undefined,
      openDrawer: true,
    });
    if (onClose) onClose();
  };

  const handleBuyNow = () => {
    initiateBuyNow(product, {
      quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      compatibility: selectedCompatibility || undefined,
    });
    if (onClose) onClose();
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const content = (
    <div className="bg-white rounded-3xl overflow-hidden">
      {/* Breadcrumbs for full page */}
      {!isModal && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center gap-1.5 text-xs text-neutral-500">
          <button
            onClick={() => setActiveView('mall')}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Virtual Mall
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="capitalize">{product.category.replace('-', ' ')}</span>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
          <span className="text-neutral-900 font-medium truncate max-w-[200px]">
            {product.title}
          </span>
        </div>
      )}

      {/* Main PDP Grid: Gallery on left, purchase module on right */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Image Display */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <ProductImage
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />

              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider bg-neutral-900 text-white shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Honest Demo Disclaimer callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-800">Simulated Demo Catalogue Item</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Explore configurations and test purchases freely without real money. Delivery tracking runs on an accelerated 30s-per-virtual-day simulation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-rose-600">
                {product.brand} · {product.subcategory}
              </span>

              {isModal && onClose && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight mb-3">
              {product.title}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-800 tabular-nums">{product.rating}</span>
                <span className="text-neutral-400">({product.reviewCount} demo reviews)</span>
              </div>
              <span className="text-neutral-300">·</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {product.stock} units available in demo mall
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tabular-nums">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-neutral-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variant Picker: Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Select Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Picker: Sizes (Clothing/Shoes) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Select Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-400 text-neutral-700 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Picker: Device Compatibility (Phone Accessories) */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                  Device Compatibility:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.compatibility.map((dev) => (
                    <button
                      key={dev}
                      onClick={() => setSelectedCompatibility(dev)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        selectedCompatibility === dev
                          ? 'border-rose-600 bg-rose-50/50 text-rose-950 font-semibold ring-1 ring-rose-600'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{dev}</span>
                        {selectedCompatibility === dev && (
                          <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buy Buttons */}
            <div className="pt-2 mb-6 border-t border-neutral-100">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Quantity:
                </label>
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold text-neutral-800 min-w-8 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-neutral-400">
                  Total: <strong className="text-neutral-900 tabular-nums">{formatPrice(product.price * quantity, currency)}</strong>
                </span>
              </div>

              {/* Action Buttons: Add to Cart and Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Wishlist & Compare secondary row */}
              <div className="flex items-center justify-between gap-4 mt-3 pt-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isFavorited ? 'text-rose-600' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-600' : ''}`} />
                  <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => toggleCompare(product)}
                  className={`flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isCompared ? 'text-violet-600' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare Specs'}</span>
                </button>
              </div>
            </div>

            {/* Delivery & Assurance box */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-center text-xs text-neutral-600">
              <div className="flex flex-col items-center gap-1 p-2">
                <Truck className="w-4 h-4 text-neutral-700" />
                <span className="font-semibold text-neutral-800 text-[11px]">Virtual Delivery</span>
                <span className="text-[10px] text-neutral-400">~{product.deliveryEstimateDays} Simulated Days</span>
              </div>

              <div className="flex flex-col items-center gap-1 p-2 border-x border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-neutral-800 text-[11px]">Free Returns</span>
                <span className="text-[10px] text-neutral-400">30-day demo policy</span>
              </div>

              <div className="flex flex-col items-center gap-1 p-2">
                <RotateCcw className="w-4 h-4 text-sky-600" />
                <span className="font-semibold text-neutral-800 text-[11px]">To: {country}</span>
                <span className="text-[10px] text-neutral-400">Simulated Express</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Honest Reviews */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex items-center gap-3 border-b border-neutral-200 mb-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'border-b-2 border-neutral-900 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Specifications & Material
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-neutral-900 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Demo Ratings ({product.reviewCount})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer ${
                activeTab === 'delivery'
                  ? 'border-b-2 border-neutral-900 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Delivery & Returns
            </button>
          </div>

          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      {key}
                    </span>
                    <span className="font-medium text-neutral-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-2xl space-y-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-800">Farhan K.</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    ★★★★★
                  </div>
                </div>
                <p className="text-xs text-neutral-600">
                  "Exceeded expectations. The build quality and attention to detail feel genuine. The 30-second delivery tracking was super fun to watch!"
                </p>
                <span className="text-[10px] text-neutral-400 mt-2 block">
                  Demo review · Verified Simulation
                </span>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-800">Ayesha R.</span>
                  <div className="flex items-center text-amber-400 text-xs">
                    ★★★★★
                  </div>
                </div>
                <p className="text-xs text-neutral-600">
                  "Perfect sizing, beautiful fabric finish. Really like how smooth the checkout and address selection is."
                </p>
                <span className="text-[10px] text-neutral-400 mt-2 block">
                  Demo review · Verified Simulation
                </span>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="max-w-2xl text-xs text-neutral-600 space-y-2">
              <p>
                <strong>Simulated Shipping:</strong> When you place an order in OMNIMART, simulated delivery begins immediately. Every 30 seconds of real-time represents 1 Virtual Day.
              </p>
              <p>
                <strong>Demo Returns:</strong> Enjoy 30 simulated days of stress-free returns. Simply click reorder or reset demo data anytime in your account settings.
              </p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <h3 className="text-base font-bold text-neutral-900 mb-4">
              More from {product.brand} & Similar Collections
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => {
                    addToRecentlyViewed(rel);
                    setSelectedProductId(rel.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left group cursor-pointer"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-2 border border-neutral-200">
                    <ProductImage
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-800 truncate group-hover:text-rose-600">
                    {rel.title}
                  </h4>
                  <span className="text-xs font-bold text-neutral-900 tabular-nums">
                    {formatPrice(rel.price, currency)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl my-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
