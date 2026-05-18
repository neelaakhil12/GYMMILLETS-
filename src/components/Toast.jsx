import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onRemoveToast }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemoveToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const { id, message, type = 'info', duration = 3000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success/90 dark:bg-success/95 border-success-light/20',
          icon: <CheckCircle size={18} className="text-white animate-bounce" />,
          text: 'text-white'
        };
      case 'warning':
        return {
          bg: 'bg-highlight/95 dark:bg-highlight/95 border-highlight-light/20',
          icon: <AlertTriangle size={18} className="text-white" />,
          text: 'text-white'
        };
      case 'info':
      default:
        return {
          bg: 'bg-secondary/90 dark:bg-[#252525]/95 border-accent/20',
          icon: <Info size={18} className="text-accent-light" />,
          text: 'text-white'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md shadow-premium pointer-events-auto transform transition-all duration-300 animate-fade-in ${styles.bg}`}
      style={{ animation: 'slideIn 0.3s ease-out' }}
    >
      <div className="flex items-center gap-3">
        {styles.icon}
        <p className={`text-xs font-bold leading-relaxed ${styles.text}`}>{message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-white/60 hover:text-white transition-colors pl-2.5"
      >
        <X size={14} />
      </button>
      
      {/* Styles for dynamic entrance */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
