import React from 'react';
import { CheckCircle2, Truck, ArrowRight, FileText, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

export const OrderConfirmation: React.FC = () => {
  const { selectedOrderId, getOrderById, setActiveView, setSelectedOrderId, openReceipt, currency } = useShop();

  const order = selectedOrderId ? getOrderById(selectedOrderId) : null;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">Order Not Found</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          Could not locate the requested demo order record.
        </p>
        <button
          onClick={() => setActiveView('mall')}
          className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Virtual Mall
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Celebration Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-10 border border-neutral-200/80 dark:border-neutral-800 shadow-lg text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
          Demo Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
          Thank You, {order.deliveryAddress.fullName}!
        </h1>

        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto mb-6">
          Your simulated purchase has been registered. The 30-second-per-day delivery simulation has started.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              setSelectedOrderId(order.id);
              setActiveView('tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Track Delivery (30s / Day)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openReceipt(order)}
            className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>View & Download Receipt</span>
          </button>

          <button
            onClick={() => setActiveView('mall')}
            className="w-full sm:w-auto px-5 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-2xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Order Number
            </span>
            <p className="text-base font-extrabold text-neutral-900 dark:text-white font-mono">
              {order.orderNumber}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Simulated Payment
            </span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {order.paymentStatus}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Total Amount
            </span>
            <p className="text-base font-extrabold text-neutral-900 dark:text-white tabular-nums">
              {formatPrice(order.totalUSD, currency)}
            </p>
          </div>
        </div>

        {/* Shipping Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600 dark:text-neutral-300 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Delivery Destination
            </span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-100">{order.deliveryAddress.fullName}</p>
            <p>{order.deliveryAddress.streetAddress}</p>
            {order.deliveryAddress.suite && <p>{order.deliveryAddress.suite}</p>}
            <p>
              {order.deliveryAddress.city}, {order.deliveryAddress.country}
            </p>
            <p className="text-neutral-400 text-[11px] mt-0.5">{order.deliveryAddress.phone}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Shipping Method
            </span>
            <p className="font-semibold text-neutral-800 dark:text-neutral-100 capitalize">
              {order.shippingMethod} Delivery
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Calculated timeline: 5 simulated virtual days (30 seconds represents 1 simulated day).
            </p>
          </div>
        </div>

        {/* Items summary */}
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">
            Purchased Items ({order.items.length})
          </span>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      Qty: {item.quantity} {item.selectedSize ? `· Size ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `· ${item.selectedColor}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums shrink-0">
                  {formatPrice(item.product.price * item.quantity, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
