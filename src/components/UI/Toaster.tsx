import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

const initialState: ToastState = {
  toasts: []
};

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    default:
      return state;
  }
};

interface ToastContextType {
  addToast: (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const addToast = (message: string, type: Toast['type'], duration = 5000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type, duration };
    
    dispatch({ type: 'ADD_TOAST', payload: toast });

    // Auto-remove toast after duration
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, duration);
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={state.toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg max-w-sm animate-slide-in ${getBgColor()}`}
    >
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Global toast function for easy use
let globalAddToast: ((message: string, type: Toast['type'], duration?: number) => void) | null = null;

export const showToast = (message: string, type: Toast['type'], duration?: number) => {
  if (globalAddToast) {
    globalAddToast(message, type, duration);
  } else {
    console.warn('Toast system not initialized');
  }
};

// Component to connect global function
export const Toaster: React.FC = () => {
  const { addToast } = useToast();
  
  React.useEffect(() => {
    globalAddToast = addToast;
    return () => {
      globalAddToast = null;
    };
  }, [addToast]);

  return null;
};

// Wrap App with ToastProvider
const ToasterWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
};

export default ToasterWrapper;