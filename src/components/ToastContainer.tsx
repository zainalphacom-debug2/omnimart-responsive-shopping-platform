import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 flex flex-col gap-2 max-w-sm sm:w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-neutral-900 dark:bg-neutral-800 text-white p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 text-xs border border-neutral-700/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span className="font-medium text-[11px] sm:text-xs truncate">{toast.message}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  dismissToast(toast.id);
                }}
                className="px-2.5 py-1 bg-white dark:bg-neutral-100 text-neutral-900 rounded-lg font-bold text-[10px] sm:text-[11px] hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
