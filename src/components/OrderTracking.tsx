import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Calendar,
  AlertCircle,
  ArrowLeft,
  FastForward,
  RotateCcw,
  ShieldCheck,
  FileCheck,
  Cog,
  PackageCheck,
  BadgeCheck,
  Search,
  FileText,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { computeLiveOrderStatus, DELIVERY_STAGES } from '../utils/deliveryTimeline';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

export const OrderTracking: React.FC = () => {
  const {
    selectedOrderId,
    getOrderById,
    orders,
    setSelectedOrderId,
    setActiveView,
    advanceOrderStage,
    openReceipt,
    currency,
    showToast,
  } = useShop();

  const [tick, setTick] = useState(Date.now());
  const [searchOrderNumber, setSearchOrderNumber] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // 1-second interval to update live countdown and smooth progress
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeOrder = selectedOrderId
    ? getOrderById(selectedOrderId)
    : orders[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const query = searchOrderNumber.trim().toUpperCase();
    if (!query) return;

    const matched = orders.find(
      (o) => o.orderNumber.toUpperCase() === query || o.id.toUpperCase() === query
    );

    if (matched) {
      setSelectedOrderId(matched.id);
      setSearchOrderNumber('');
      showToast(`Found Order ${matched.orderNumber}`, 'success');
    } else {
      setSearchError(`No simulated order found matching "${query}". Check order history in your profile.`);
    }
  };

  const liveStatus = activeOrder ? computeLiveOrderStatus(activeOrder, tick) : null;

  const getStageIcon = (stageIndex: number, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-white" />;
    }
    switch (stageIndex) {
      case 0:
        return <FileCheck className="w-5 h-5" />;
      case 1:
        return <Cog className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />;
      case 2:
        return <PackageCheck className="w-5 h-5" />;
      case 3:
        return <Truck className="w-5 h-5" />;
      case 4:
        return <MapPin className="w-5 h-5" />;
      case 5:
        return <BadgeCheck className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveView('mall')}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mall</span>
        </button>

        {/* Search Order Number Form */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              placeholder="Search by Order # (e.g. OMNI-849204)"
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {searchError && (
        <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center justify-between">
          <span>{searchError}</span>
          <button
            onClick={() => setSearchError(null)}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Switch order dropdown if user has multiple orders */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 mb-6 text-xs text-neutral-600 dark:text-neutral-400">
          <span>Your Placed Orders:</span>
          <select
            value={activeOrder?.id || ''}
            onChange={(e) => setSelectedOrderId(e.target.value)}
            className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1 text-neutral-900 dark:text-white text-xs font-mono font-semibold"
          >
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} ({formatPrice(o.totalUSD, currency)}) —{' '}
                {new Date(o.createdAt).toLocaleTimeString()}
              </option>
            ))}
          </select>
        </div>
      )}

      {!activeOrder || !liveStatus ? (
        <div className="p-12 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 text-center max-w-md mx-auto shadow-sm">
          <Package className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">No Active Demo Orders Found</h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
            Place a simulated order first to experience the accelerated 30-second delivery timeline.
          </p>
          <button
            onClick={() => setActiveView('mall')}
            className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold cursor-pointer"
          >
            Explore Mall & Place Demo Order
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-lg overflow-hidden mb-8">
          {/* Top Simulated Day Status Bar */}
          <div className="bg-neutral-900 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-2 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  <span>DEMO DELIVERY SIMULATION — 30 seconds represents one simulated day.</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {liveStatus.currentStage.label}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                  {liveStatus.currentStage.statusHeadline}
                </p>
              </div>

              {/* Virtual Day Badge + Stage Timer */}
              <div className="flex flex-col items-end text-right bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0">
                <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Simulated Time
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-amber-300">
                  {liveStatus.virtualDayLabel}
                </span>
                {!liveStatus.isFullyDelivered ? (
                  <span className="text-xs text-neutral-200 mt-0.5 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    Next stage in {liveStatus.secondsRemainingInStage}s
                  </span>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Complete
                  </span>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-neutral-300 mb-1.5 font-medium">
                <span>Overall Simulated Transit Progress</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  {liveStatus.progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${liveStatus.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Real-Time Delivery Stages Timeline */}
          <div className="p-6 sm:p-8 bg-neutral-50/50 dark:bg-neutral-850/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
              {liveStatus.stagesWithStatus.map((stg) => {
                const isPast = stg.isCompleted;
                const isCurrent = stg.isCurrent;

                return (
                  <div
                    key={stg.stageIndex}
                    className={`flex flex-col p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-white dark:bg-neutral-800 border-rose-500 shadow-md ring-2 ring-rose-500/20'
                        : isPast
                        ? 'bg-white dark:bg-neutral-800 border-emerald-200 dark:border-emerald-800 text-neutral-800 dark:text-neutral-200'
                        : 'bg-neutral-100/60 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-700/40 text-neutral-400 dark:text-neutral-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isPast
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                        }`}
                      >
                        {getStageIcon(stg.stageIndex, isPast, isCurrent)}
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : isPast
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {stg.virtualDayLabel}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white mb-1 leading-snug">
                      {stg.label}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {stg.description}
                    </p>

                    <div className="mt-auto pt-2 border-t border-neutral-100 dark:border-neutral-700/60 text-[10px] text-neutral-400 font-mono">
                      {stg.relativeTimeLabel}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Controls to Fast-Forward */}
            <div className="mt-6 p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <FastForward className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Simulation Fast-Forward:</strong> Skip waiting 30 seconds per stage:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => advanceOrderStage(activeOrder.id)}
                  disabled={liveStatus.isFullyDelivered}
                  className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Advance Next Day →
                </button>

                <button
                  onClick={() => advanceOrderStage(activeOrder.id, 5)}
                  disabled={liveStatus.isFullyDelivered}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Jump to Delivered ✓
                </button>

                <button
                  onClick={() => openReceipt(activeOrder)}
                  className="px-3.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Order Receipt</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Details & Summary Breakdown */}
          <div className="p-6 sm:p-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Order Information
              </span>
              <p className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{activeOrder.orderNumber}</p>
              <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                Placed: {new Date(activeOrder.createdAt).toLocaleTimeString()} ·{' '}
                {new Date(activeOrder.createdAt).toLocaleDateString()}
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {activeOrder.paymentStatus}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Destination & Shipping
              </span>
              <p className="font-bold text-neutral-900 dark:text-white">{activeOrder.deliveryAddress.fullName}</p>
              <p className="text-neutral-600 dark:text-neutral-300">{activeOrder.deliveryAddress.streetAddress}</p>
              <p className="text-neutral-600 dark:text-neutral-300">
                {activeOrder.deliveryAddress.city}, {activeOrder.deliveryAddress.country}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1 capitalize font-medium">
                Speed: {activeOrder.shippingMethod} Delivery
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                Total Breakdown
              </span>
              <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
                    {formatPrice(activeOrder.subtotalUSD, currency)}
                  </span>
                </div>
                {activeOrder.discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount:</span>
                    <span className="tabular-nums">-{formatPrice(activeOrder.discountUSD, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="tabular-nums">
                    {activeOrder.shippingFeeUSD === 0 ? 'Free' : formatPrice(activeOrder.shippingFeeUSD, currency)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900 dark:text-white pt-1 border-t border-neutral-100 dark:border-neutral-800 text-sm">
                  <span>Total:</span>
                  <span className="text-rose-600 dark:text-rose-400 tabular-nums">
                    {formatPrice(activeOrder.totalUSD, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products preview list */}
          <div className="p-6 sm:p-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-850/40">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
              Items in This Parcel ({activeOrder.items.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeOrder.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Qty: {item.quantity}{' '}
                      {item.selectedSize ? `· Size ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `· ${item.selectedColor}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums shrink-0">
                    {formatPrice(item.product.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
