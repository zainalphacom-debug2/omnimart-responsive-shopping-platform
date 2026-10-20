import React from 'react';
import { X, Check, ShoppingCart, Trash2, SlidersHorizontal } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

export const ProductCompareModal: React.FC = () => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    addToCart,
    currency,
    activeView,
    setActiveView,
  } = useShop();

  if (activeView !== 'compare') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-violet-600" />
            <span>Product Comparison ({compareList.length}/4)</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Compare key specifications, pricing, variants, and delivery timelines side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-xs text-neutral-500 hover:text-rose-600 font-semibold cursor-pointer"
            >
              Clear Comparison
            </button>
          )}
          <button
            onClick={() => setActiveView('mall')}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer"
          >
            Back to Mall
          </button>
        </div>
      </div>

      {compareList.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-neutral-200 text-center max-w-md mx-auto">
          <SlidersHorizontal className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800 mb-1">No Products to Compare</h3>
          <p className="text-xs text-neutral-500 mb-6">
            Click the "Compare" button on any product card in the virtual mall to view specifications side-by-side.
          </p>
          <button
            onClick={() => setActiveView('mall')}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-md overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/70">
                <th className="p-4 w-40 font-bold text-neutral-500 uppercase tracking-wider text-[11px]">
                  Feature
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-4 w-60 align-top">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(product)}
                        className="absolute -top-1 -right-1 p-1 bg-neutral-100 hover:bg-rose-100 text-neutral-400 hover:text-rose-600 rounded-full transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 mb-2 border border-neutral-200">
                        <ProductImage src={product.image} alt={product.title} />
                      </div>
                      <h4 className="font-bold text-neutral-900 line-clamp-2 mb-1">
                        {product.title}
                      </h4>
                      <p className="text-sm font-extrabold text-neutral-900 tabular-nums">
                        {formatPrice(product.price, currency)}
                      </p>
                      <button
                        onClick={() => addToCart(product, { openDrawer: true })}
                        className="mt-2 w-full py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-neutral-800 capitalize">
                    {p.category.replace('-', ' ')} ({p.subcategory})
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Brand</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-neutral-800">
                    {p.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Demo Rating</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-amber-500 font-bold tabular-nums">
                    ★ {p.rating} <span className="text-neutral-400 font-normal">({p.reviewCount} reviews)</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Variants / Sizes</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-neutral-700">
                    {p.sizes ? p.sizes.join(', ') : p.compatibility ? p.compatibility.slice(0, 3).join(', ') : 'Standard'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Available Colors</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-neutral-700">
                    {p.colors ? p.colors.map((c) => c.name).join(', ') : 'Single Variant'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Simulated Delivery</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-neutral-700 font-medium">
                    ~{p.deliveryEstimateDays} Simulated Days
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-neutral-500 bg-neutral-50/30">Stock Availability</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-emerald-600 font-bold">
                    {p.stock} units in demo mall
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
