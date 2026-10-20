import React from 'react';
import {
  X,
  Download,
  Share2,
  Printer,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { DemoOrder } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { ProductImage } from './ProductImage';

interface OrderReceiptModalProps {
  order: DemoOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { currency, setActiveView, setSelectedOrderId, showToast } = useShop();

  if (!isOpen || !order) return null;

  const orderDateFormatted = new Date(order.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Action 1: Download formatted receipt file
  const handleDownloadReceipt = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OMNIMART Receipt - ${order.orderNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #18181b; max-width: 650px; margin: auto; }
    .header { border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 20px; }
    .brand { font-size: 24px; font-weight: 800; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #71717a; }
    .meta { margin: 15px 0; font-size: 13px; color: #52525b; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { text-align: left; padding: 8px 0; border-bottom: 1px solid #e4e4e7; font-size: 12px; text-transform: uppercase; color: #71717a; }
    td { padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 13px; }
    .totals { margin-top: 20px; padding-top: 15px; border-top: 2px solid #e4e4e7; text-align: right; font-size: 14px; }
    .total-amount { font-size: 20px; font-weight: 800; color: #e11d48; }
    .disclaimer { margin-top: 40px; padding: 15px; background: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; font-size: 11px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">OMNIMART</div>
    <div class="tagline">Your World. One Cart. — Official Demo Order Slip</div>
  </div>
  <div class="meta">
    <p><strong>Order Number:</strong> ${order.orderNumber}</p>
    <p><strong>Order Date:</strong> ${orderDateFormatted}</p>
    <p><strong>Customer Name:</strong> ${order.deliveryAddress.fullName}</p>
    <p><strong>Phone:</strong> ${order.deliveryAddress.phone}</p>
    <p><strong>Delivery Address:</strong> ${order.deliveryAddress.streetAddress}, ${order.deliveryAddress.city}, ${order.deliveryAddress.country}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th>Qty</th>
        <th>Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.items
        .map(
          (item) => `<tr>
        <td>
          <strong>${item.product.title}</strong><br>
          <span style="font-size: 11px; color: #71717a;">${[
            item.selectedSize ? `Size: ${item.selectedSize}` : '',
            item.selectedColor ? `Color: ${item.selectedColor}` : '',
            item.selectedCompatibility ? `Fits: ${item.selectedCompatibility}` : '',
          ]
            .filter(Boolean)
            .join(' · ')}</span>
        </td>
        <td>${item.quantity}</td>
        <td>${formatPrice(item.product.price, order.currency)}</td>
        <td style="text-align: right;">${formatPrice(item.product.price * item.quantity, order.currency)}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
  <div class="totals">
    <p>Subtotal: ${formatPrice(order.subtotalUSD, order.currency)}</p>
    ${order.discountUSD > 0 ? `<p style="color: #16a34a;">Discount: -${formatPrice(order.discountUSD, order.currency)}</p>` : ''}
    <p>Simulated Shipping: ${order.shippingFeeUSD === 0 ? 'FREE' : formatPrice(order.shippingFeeUSD, order.currency)}</p>
    <p>Simulated Tax (5%): ${formatPrice(order.taxUSD, order.currency)}</p>
    <p class="total-amount">Total: ${formatPrice(order.totalUSD, order.currency)}</p>
  </div>
  <div class="disclaimer">
    <strong>DEMO SHOPPING ENVIRONMENT</strong><br>
    This receipt is for simulated demonstration purposes only. No real financial transaction was conducted, and no real physical items will be shipped.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `omnimart-receipt-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Receipt downloaded: omnimart-receipt-${order.orderNumber}.html`, 'success');
  };

  // Action 2: Share receipt
  const handleShareReceipt = async () => {
    const summaryText = `OMNIMART Order #${order.orderNumber}\nDate: ${orderDateFormatted}\nTotal: ${formatPrice(order.totalUSD, order.currency)}\nStatus: ${order.paymentStatus} (Simulated Demo Order)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `OMNIMART Demo Order #${order.orderNumber}`,
          text: summaryText,
          url: window.location.href,
        });
        showToast('Receipt shared successfully', 'success');
        return;
      } catch (err) {
        // User cancelled or fallback needed
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(summaryText);
      showToast('Order summary copied to clipboard!', 'info');
    } catch {
      showToast('Order details ready for sharing', 'info');
    }
  };

  // Action 3: Print receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Action 4: View order tracking
  const handleViewOrder = () => {
    setSelectedOrderId(order.id);
    setActiveView('tracking');
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto border border-neutral-200 dark:border-neutral-800">
        {/* Top bar with Close button */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
              OMNIMART
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">
              Digital Order Slip
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close Receipt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Order Slip Container */}
        <div id="printable-order-slip" className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap items-start justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 text-xs">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Order Reference
              </span>
              <p className="text-base font-extrabold text-neutral-900 dark:text-white font-mono mt-0.5">
                {order.orderNumber}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">
                {orderDateFormatted}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Payment Verification
              </span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{order.paymentStatus}</span>
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] capitalize">
                Method: {order.paymentMethod.replace('_', ' ')}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Customer & Destination
              </span>
              <p className="font-bold text-neutral-900 dark:text-white mt-0.5">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300">
                {order.deliveryAddress.streetAddress}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                {order.deliveryAddress.city}, {order.deliveryAddress.country}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 max-h-60 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                    <ProductImage src={item.product.image} alt={item.product.title} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-neutral-900 dark:text-white truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Qty: {item.quantity}{' '}
                      {item.selectedSize ? `· Size ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `· ${item.selectedColor}` : ''}{' '}
                      {item.selectedCompatibility ? `· Fits ${item.selectedCompatibility}` : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-neutral-900 dark:text-white tabular-nums">
                    {formatPrice(item.product.price * item.quantity, order.currency)}
                  </span>
                  <span className="block text-[10px] text-neutral-400">
                    ({formatPrice(item.product.price, order.currency)} each)
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">
                {formatPrice(order.subtotalUSD, order.currency)}
              </span>
            </div>

            {order.discountUSD > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Coupon Discount ({order.appliedCoupon}):</span>
                <span className="tabular-nums">-{formatPrice(order.discountUSD, order.currency)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Simulated Delivery ({order.shippingMethod}):</span>
              <span className="tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                {order.shippingFeeUSD === 0 ? 'FREE' : formatPrice(order.shippingFeeUSD, order.currency)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Sales Tax (5%):</span>
              <span className="tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                {formatPrice(order.taxUSD, order.currency)}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200 dark:border-neutral-700 text-sm font-extrabold text-neutral-900 dark:text-white">
              <span>Total Paid:</span>
              <span className="text-base text-rose-600 dark:text-rose-400 tabular-nums">
                {formatPrice(order.totalUSD, order.currency)}
              </span>
            </div>
          </div>

          {/* Honest Demo Disclaimer Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 text-center">
            <strong>DEMO ORDER RECEIPT</strong> — No real money was charged and no physical items will be shipped. For demonstration & entertainment only.
          </div>
        </div>

        {/* 4 Working Receipt Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Action 1: Download */}
          <button
            onClick={handleDownloadReceipt}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
            title="Download printable receipt"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {/* Action 2: Share */}
          <button
            onClick={handleShareReceipt}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Share order summary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Action 3: Print */}
          <button
            onClick={handlePrintReceipt}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Print receipt layout"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* Action 4: View Live Order Tracking */}
          <button
            onClick={handleViewOrder}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            title="Open 30s live delivery tracking"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Track Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
