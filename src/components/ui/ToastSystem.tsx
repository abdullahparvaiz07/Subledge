import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  undoAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, options?: { undoAction?: () => void; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_COLORS: Record<ToastType, string> = {
  success: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
};

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[320px] max-w-[420px] ${TOAST_COLORS[toast.type]}`}
    >
      <span className="shrink-0">{TOAST_ICONS[toast.type]}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      {toast.undoAction && (
        <button
          onClick={() => { toast.undoAction?.(); onDismiss(toast.id); }}
          className="text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity shrink-0"
        >
          Undo
        </button>
      )}
      <button onClick={() => onDismiss(toast.id)} className="opacity-40 hover:opacity-100 transition-opacity shrink-0">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, options?: { undoAction?: () => void; duration?: number }) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => {
      const next = [...prev, { id, message, type, ...options }];
      return next.slice(-3); // Max 3 visible
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
