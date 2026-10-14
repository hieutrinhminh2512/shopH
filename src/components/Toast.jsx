import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useShop();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-white border-emerald-500 text-gray-800';
        let iconClass = 'text-emerald-500';

        if (toast.type === 'warning') {
          Icon = AlertCircle;
          bgClass = 'bg-white border-amber-500 text-gray-800';
          iconClass = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          bgClass = 'bg-white border-blue-500 text-gray-800';
          iconClass = 'text-blue-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border-l-4 ${bgClass} transform transition-all duration-300 translate-y-0 animate-in fade-in slide-in-from-right-4 max-w-sm`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconClass}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
