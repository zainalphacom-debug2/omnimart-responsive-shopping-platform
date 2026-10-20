import React from 'react';
import {
  X,
  Bell,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  CheckCheck,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { AppNotification } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    navigateTo,
    getOrderById,
    openReceipt,
    requestBrowserNotificationPermission,
  } = useShop();

  if (!isOpen) return null;

  const handleTrackOrder = (orderId: string, notifId: string) => {
    markNotificationAsRead(notifId);
    navigateTo('tracking', { orderId });
    onClose();
  };

  const handleViewReceipt = (orderId: string, notifId: string) => {
    markNotificationAsRead(notifId);
    const order = getOrderById(orderId);
    if (order) {
      openReceipt(order);
    } else {
      navigateTo('tracking', { orderId });
    }
    onClose();
  };

  const handleRequestPermission = async () => {
    await requestBrowserNotificationPermission();
  };

  const hasBrowserSupport = typeof window !== 'undefined' && 'Notification' in window;
  const permissionState = hasBrowserSupport ? Notification.permission : 'unsupported';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col text-neutral-900 dark:text-neutral-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Bell className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">Delivery Notifications</h2>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {unreadNotificationCount > 0
                    ? `${unreadNotificationCount} unread update${unreadNotificationCount > 1 ? 's' : ''}`
                    : 'All caught up'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={clearNotifications}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg text-xs cursor-pointer transition-colors"
                    title="Clear notification history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Browser Notification Permission Banner (Optional) */}
          {hasBrowserSupport && permissionState === 'default' && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="font-semibold text-rose-900 dark:text-rose-200">
                  Enable Desktop Alerts
                </p>
                <p className="text-[11px] text-rose-700 dark:text-rose-300 truncate">
                  Get notified when orders hit Out for Delivery & Delivered.
                </p>
              </div>
              <button
                onClick={handleRequestPermission}
                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 shrink-0 cursor-pointer shadow-xs"
              >
                Allow
              </button>
            </div>
          )}

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 divide-y divide-neutral-100 dark:divide-neutral-800">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 dark:text-neutral-400">
                <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-3 text-neutral-400">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                  No Notifications Yet
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mb-4">
                  Place a simulated order to receive automatic real-time alerts when your package reaches
                  <strong> Out for Delivery</strong> and <strong>Delivered</strong>.
                </p>
                <button
                  onClick={() => {
                    navigateTo('mall');
                    onClose();
                  }}
                  className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Browse Mall Catalog
                </button>
              </div>
            ) : (
              notifications.map((notif) => {
                const isOutForDelivery = notif.type === 'out_for_delivery';
                const formattedTime = new Date(notif.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <div
                    key={notif.id}
                    className={`py-3.5 px-3 rounded-2xl transition-colors mb-2 border ${
                      !notif.read
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        : 'bg-white dark:bg-neutral-850 border-neutral-150 dark:border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isOutForDelivery
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOutForDelivery ? (
                          <Truck className="w-5 h-5" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isOutForDelivery
                                ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                            }`}
                          >
                            {isOutForDelivery ? 'Out for Delivery' : 'Delivered'}
                          </span>
                          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                            {formattedTime}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                          <button
                            onClick={() => handleTrackOrder(notif.orderId, notif.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Order</span>
                          </button>

                          {!isOutForDelivery && (
                            <button
                              onClick={() => handleViewReceipt(notif.orderId, notif.id)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          )}

                          {!notif.read && (
                            <button
                              onClick={() => markNotificationAsRead(notif.id)}
                              className="ml-auto text-[10px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 font-medium cursor-pointer"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 bg-neutral-50 dark:bg-neutral-950/60">
            <p className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>Simulated 30s/day timeline updates persist in local storage.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
