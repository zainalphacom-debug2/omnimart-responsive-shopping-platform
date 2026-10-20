/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { MallView } from './components/MallView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutFlow } from './components/CheckoutFlow';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { ProfileModal } from './components/ProfileModal';
import { AddressModal } from './components/AddressModal';
import { ProductCompareModal } from './components/ProductCompareModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { DealsSection } from './components/DealsSection';
import { SpinCouponModal } from './components/SpinCouponModal';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedProductId,
    products,
    quickViewProduct,
    setQuickViewProduct,
    isSurpriseModalOpen,
    setIsSurpriseModalOpen,
    isSpinWheelOpen,
    setIsSpinWheelOpen,
    receiptOrder,
    isReceiptOpen,
    closeReceipt,
    isNotificationOpen,
    setIsNotificationOpen,
  } = useShop();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* 1. Global Storefront Header */}
      <Header
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. Responsive Category Navigation Bar */}
      <CategoryBar
        onOpenSurprise={() => setIsSurpriseModalOpen(true)}
        onOpenSpin={() => setIsSpinWheelOpen(true)}
      />

      {/* 3. Main Active View Router */}
      <main className="flex-1">
        {activeView === 'mall' && <MallView />}
        {activeView === 'product-detail' && selectedProduct && (
          <ProductDetailModal product={selectedProduct} isModal={false} />
        )}
        {activeView === 'checkout' && <CheckoutFlow />}
        {activeView === 'order-confirmation' && <OrderConfirmation />}
        {activeView === 'tracking' && <OrderTracking />}
        {activeView === 'deals' && <DealsSection />}
        {activeView === 'compare' && <ProductCompareModal />}
      </main>

      {/* 4. Global Modals & Drawers */}
      <CartDrawer />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AddressModal />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          isModal={true}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Digital Order Receipt Modal */}
      <OrderReceiptModal
        order={receiptOrder}
        isOpen={isReceiptOpen}
        onClose={closeReceipt}
      />

      {/* Delivery Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Spin-to-Win Coupon Modal */}
      <SpinCouponModal />

      {/* Surprise Me / Desk Setup Modal */}
      <SurpriseMeModal />

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSpin={() => setIsSpinWheelOpen(true)}
      />

      {/* Toast Feedback notifications */}
      <ToastContainer />

      {/* 5. Storefront Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
