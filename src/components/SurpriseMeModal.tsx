import React, { useState } from 'react';
import { X, Sparkles, ShoppingCart, RefreshCw, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

export const SurpriseMeModal: React.FC = () => {
  const {
    isSurpriseModalOpen,
    setIsSurpriseModalOpen,
    products,
    addToCart,
    currency,
    setSelectedProductId,
    setActiveView,
  } = useShop();

  const [mode, setMode] = useState<'random' | 'setup'>('setup');
  const [randomProductIndex, setRandomProductIndex] = useState(0);

  if (!isSurpriseModalOpen) return null;

  // Curated "Dream Setup" bundle: 3 items (Lounge Chair, Ceramic Storage, Desk Notebook)
  const deskSetupProducts = [
    products.find((p) => p.id === 'phone-03') || products[2],
    products.find((p) => p.id === 'elec-02') || products[0],
    products.find((p) => p.id === 'book-01') || products[1],
  ];

  const handleShuffle = () => {
    setRandomProductIndex(Math.floor(Math.random() * products.length));
  };

  const randomProd = products[randomProductIndex] || products[0];

  const handleAddBundleToCart = () => {
    deskSetupProducts.forEach((p) => {
      addToCart(p);
    });
    setIsSurpriseModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl my-auto">
        <button
          onClick={() => setIsSurpriseModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-extrabold text-neutral-900">
            Free-Time Shopping Discoveries
          </h3>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Fun exploratory bundles and mystery recommendations to spend your free time.
        </p>

        {/* Mode selector */}
        <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl mb-6">
          <button
            onClick={() => setMode('setup')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'setup'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Dream Desk & Tech Setup
          </button>
          <button
            onClick={() => setMode('random')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'random'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Mystery Item of the Moment
          </button>
        </div>

        {/* Setup Bundle View */}
        {mode === 'setup' && (
          <div>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-800">
                  Curated 3-Piece Minimalist Workspace Bundle
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Bundle Deal
                </span>
              </div>

              <div className="space-y-2.5">
                {deskSetupProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-neutral-200 shrink-0">
                        <ProductImage src={p.image} alt={p.title} />
                      </div>
                      <span className="font-medium text-neutral-800 truncate">{p.title}</span>
                    </div>
                    <span className="font-bold text-neutral-900 tabular-nums shrink-0">
                      {formatPrice(p.price, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddBundleToCart}
              className="w-full py-3 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add All 3 Items to Cart</span>
            </button>
          </div>
        )}

        {/* Random Item View */}
        {mode === 'random' && (
          <div className="text-center">
            <div className="max-w-xs mx-auto p-4 rounded-2xl border border-neutral-200 bg-neutral-50 mb-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white mb-3">
                <ProductImage src={randomProd.image} alt={randomProd.title} />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 mb-1">{randomProd.title}</h4>
              <p className="text-xs text-neutral-500 mb-2">{randomProd.subcategory}</p>
              <p className="text-base font-extrabold text-neutral-900 tabular-nums">
                {formatPrice(randomProd.price, currency)}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleShuffle}
                className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Shuffle Another</span>
              </button>

              <button
                onClick={() => {
                  addToCart(randomProd, { openDrawer: true });
                  setIsSurpriseModalOpen(false);
                }}
                className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
