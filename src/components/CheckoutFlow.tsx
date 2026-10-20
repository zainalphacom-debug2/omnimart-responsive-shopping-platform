import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Wallet,
  Truck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowLeft,
  Lock,
  Zap,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/pricing';
import { DeliveryAddress, PaymentMethod, ShippingMethod } from '../types';
import { ProductImage } from './ProductImage';

export const CheckoutFlow: React.FC = () => {
  const {
    cart,
    directBuyItem,
    clearDirectBuyItem,
    addresses,
    defaultAddress,
    setIsAddressModalOpen,
    createDemoOrder,
    currency,
    appliedCoupon,
    profile,
    setActiveView,
    showToast,
  } = useShop();

  // Active items for this checkout session
  const checkoutItems = directBuyItem ? [directBuyItem] : cart;

  // Form states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddress ? defaultAddress.id : addresses[0]?.id || ''
  );
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('test_card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo card form states
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Zain Ahmed',
    expiry: '12/28',
    cvv: '•••',
  });

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">No Items in Checkout</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Your active checkout bag is empty. Explore our virtual catalog and add items or click Buy Now.
        </p>
        <button
          onClick={() => setActiveView('mall')}
          className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          Return to Virtual Mall
        </button>
      </div>
    );
  }

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || defaultAddress || addresses[0];

  // Pricing calculations
  const subtotalUSD = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let shippingFeeUSD = 0;
  if (shippingMethod === 'express') shippingFeeUSD = 12.00;
  if (shippingMethod === 'economy') shippingFeeUSD = 3.99;
  if (shippingMethod === 'standard') shippingFeeUSD = subtotalUSD > 50 ? 0 : 5.99;

  let discountUSD = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountUSD = (subtotalUSD * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      discountUSD = Math.min(subtotalUSD, appliedCoupon.value);
    } else if (appliedCoupon.type === 'free_shipping') {
      discountUSD = shippingFeeUSD;
      shippingFeeUSD = 0;
    }
  }

  const taxableAmount = Math.max(0, subtotalUSD - discountUSD);
  const taxUSD = taxableAmount * 0.05;
  const totalUSD = Math.max(0, taxableAmount + shippingFeeUSD + taxUSD);

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast('Please add or select a delivery address', 'error');
      return;
    }

    if (paymentMethod === 'virtual_credit' && profile.virtualCreditsUSD < totalUSD) {
      showToast('Insufficient virtual credits. Please choose another simulated method.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate 600ms network verification
    setTimeout(() => {
      createDemoOrder({
        items: checkoutItems,
        deliveryAddress: selectedAddress,
        shippingMethod,
        paymentMethod,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleFillTestCard = () => {
    setCardData({
      number: '4242 4242 4242 4242',
      name: 'Zain Ahmed',
      expiry: '12/28',
      cvv: '888',
    });
    showToast('Fictional test card auto-filled', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Banner & Back */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
        <button
          onClick={() => {
            if (directBuyItem) {
              clearDirectBuyItem();
            }
            setActiveView('mall');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Mall</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Simulated Safe Sandbox Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multi-Step Checkout Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-neutral-900">Delivery Address</h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address selector cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-neutral-200/80 text-neutral-700 px-1.5 py-0.2 rounded font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 line-clamp-1">{addr.streetAddress}</p>
                    {addr.suite && <p className="text-neutral-500">{addr.suite}</p>}
                    <p className="text-neutral-500">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-neutral-400 text-[11px] mt-1 font-medium">{addr.country} · {addr.phone}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Shipping Method */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-neutral-900">Shipping Speed</h3>
            </div>

            <div className="space-y-2.5">
              {/* Standard */}
              <label
                onClick={() => setShippingMethod('standard')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                  shippingMethod === 'standard'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <p className="font-bold text-neutral-900">Standard Delivery</p>
                    <p className="text-neutral-500 text-[11px]">Virtual transit time ~ 3 to 4 virtual days</p>
                  </div>
                </div>
                <span className="font-bold text-neutral-900 tabular-nums">
                  {subtotalUSD > 50 ? 'FREE' : formatPrice(5.99, currency)}
                </span>
              </label>

              {/* Express */}
              <label
                onClick={() => setShippingMethod('express')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                  shippingMethod === 'express'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <p className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>Express Priority</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">
                        Fastest
                      </span>
                    </p>
                    <p className="text-neutral-500 text-[11px]">Virtual transit time ~ 1 to 2 virtual days</p>
                  </div>
                </div>
                <span className="font-bold text-neutral-900 tabular-nums">
                  {formatPrice(12.00, currency)}
                </span>
              </label>

              {/* Economy */}
              <label
                onClick={() => setShippingMethod('economy')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer text-xs transition-all ${
                  shippingMethod === 'economy'
                    ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'economy'}
                    onChange={() => setShippingMethod('economy')}
                    className="text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <p className="font-bold text-neutral-900">Economy Green Shipping</p>
                    <p className="text-neutral-500 text-[11px]">Consolidated carbon-neutral simulated transport</p>
                  </div>
                </div>
                <span className="font-bold text-neutral-900 tabular-nums">
                  {formatPrice(3.99, currency)}
                </span>
              </label>
            </div>
          </div>

          {/* STEP 3: Simulated Payment Method */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-base font-bold text-neutral-900">Simulated Payment</h3>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Fictional Demo Only
              </span>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('test_card')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'test_card'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="truncate">Demo Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('virtual_credit')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'virtual_credit'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="truncate">Mall Credit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="truncate">Simulated Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="truncate">Demo COD</span>
              </button>
            </div>

            {/* Test Card Form */}
            {paymentMethod === 'test_card' && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800">Simulated Card Details</span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer underline"
                  >
                    Auto-Fill Test Credentials
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardData.number}
                    readOnly
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      readOnly
                      className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                      CVV Code
                    </label>
                    <input
                      type="text"
                      value={cardData.cvv}
                      readOnly
                      className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 bg-white font-mono"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-neutral-500 pt-1">
                  Safety guarantee: No real credit card or sensitive banking data is ever collected or processed.
                </p>
              </div>
            )}

            {/* Mall Credit Form */}
            {paymentMethod === 'virtual_credit' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Virtual Mall Credits Balance:</span>
                  <span className="font-extrabold text-sm tabular-nums">
                    {formatPrice(profile.virtualCreditsUSD, currency)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  {profile.virtualCreditsUSD >= totalUSD
                    ? 'Your virtual credit is sufficient to cover this entire simulated purchase.'
                    : 'Insufficient virtual credits. Top up from your profile or choose Demo Card.'}
                </p>
              </div>
            )}

            {/* Simulated Pay Form */}
            {paymentMethod === 'wallet' && (
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-700">
                <p className="font-bold mb-1">Simulated One-Touch Digital Wallet</p>
                <p className="text-[11px] text-neutral-500">
                  Mock tokenized biometrics authenticated. Instant virtual verification upon clicking Place Order.
                </p>
              </div>
            )}

            {/* Cash on Delivery Form */}
            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold mb-1">Demo Cash on Delivery (COD)</p>
                <p className="text-[11px] text-amber-800">
                  Simulated payment collection upon simulated parcel arrival on Virtual Day 6.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Place Demo Order Button */}
        <div className="lg:col-span-5">
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-neutral-200/80 shadow-md sticky top-24">
            <h3 className="text-base font-bold text-neutral-900 mb-4 pb-3 border-b border-neutral-100">
              Order Review ({checkoutItems.length} items)
            </h3>

            {/* Items review */}
            <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 pr-1 mb-4">
              {checkoutItems.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Qty: {item.quantity}{' '}
                      {item.selectedSize ? `· Size ${item.selectedSize}` : ''}{' '}
                      {item.selectedColor ? `· ${item.selectedColor}` : ''}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 tabular-nums shrink-0">
                    {formatPrice(item.product.price * item.quantity, currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs text-neutral-600 pb-4 border-b border-neutral-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(subtotalUSD, currency)}
                </span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">-{formatPrice(discountUSD, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Simulated Shipping</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {shippingFeeUSD === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shippingFeeUSD, currency)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Demo Sales Tax (5%)</span>
                <span className="font-semibold text-neutral-900 tabular-nums">
                  {formatPrice(taxUSD, currency)}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total Amount</span>
                <span className="tabular-nums text-rose-600">{formatPrice(totalUSD, currency)}</span>
              </div>
            </div>

            {/* Final Place Demo Order Button */}
            <div className="mt-5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-sm font-bold shadow-lg transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Demo Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Place Demo Order ({formatPrice(totalUSD, currency)})</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Order · Live 30s Delivery Tracking Starts Instantly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
