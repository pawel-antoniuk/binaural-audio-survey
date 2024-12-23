import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import styles from './errorToast.module.css';

interface ErrorContextType {
  addError: (error: Error | string, errorDetails?: ErrorDetails) => void;
  removeError: (id: string) => void;
}

interface ErrorDetails {
  type?: string;
  url?: string;
  status?: number;
  statusText?: string;
  method?: string;
  response?: any;
  headers?: Record<string, string>;
}

interface ErrorWithId {
  id: string;
  message: string;
  timestamp: number;
  type?: string;
  stack?: string;
  componentStack?: string;
  details?: ErrorDetails;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const formatResponse = (response: any): string => {
  try {
    return typeof response === 'object' 
      ? JSON.stringify(response, null, 2)
      : String(response);
  } catch (e) {
    return String(response);
  }
};

const ErrorNotification = ({ 
  error, 
  onClose,
  onHover,
  onLeave,
}: { 
  error: ErrorWithId;
  onClose: () => void;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleClose = () => {
    setIsDismissing(true);
    setTimeout(() => onClose(), 300); // Match animation duration
  };

  return (
    <div 
      className={`${styles.toast} ${isDismissing ? styles.dismissing : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span>Error</span>
          {error.type && <span className={styles.errorType}>{error.type}</span>}
          <span className={styles.timestamp}>{formatTime(error.timestamp)}</span>
        </div>
        <button onClick={handleClose} className={styles.closeButton}>×</button>
      </div>
      <div className={styles.message}>{error.message}</div>
      <div className={styles.details}>
        {error.details && (
          <>
            {error.details.method && error.details.url && (
              <div>Request: {error.details.method} {error.details.url}</div>
            )}
            {error.details.status && (
              <div>Status: {error.details.status} {error.details.statusText}</div>
            )}
            {error.details.response && (
              <>
                <div>Response:</div>
                <pre>{formatResponse(error.details.response)}</pre>
              </>
            )}
            {error.details.headers && Object.keys(error.details.headers).length > 0 && (
              <>
                <div>Headers:</div>
                <pre>{JSON.stringify(error.details.headers, null, 2)}</pre>
              </>
            )}
          </>
        )}
        {error.stack && <pre>{error.stack}</pre>}
        {error.componentStack && (
          <pre>Component Stack:{error.componentStack}</pre>
        )}
      </div>
    </div>
  );
};

export const GlobalErrorHandler = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<ErrorWithId[]>([]);
  const timersRef = useRef<Map<string, { timer: NodeJS.Timeout; remaining: number }>>(new Map());

  const addError = (error: Error | string, errorDetails?: ErrorDetails) => {
    const newError: ErrorWithId = {
      id: Math.random().toString(36).substr(2, 9),
      message: typeof error === 'string' ? error : error.message,
      timestamp: Date.now(),
      type: error instanceof Error ? error.constructor.name : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      details: errorDetails
    };

    setErrors(prev => [...prev, newError]);
    startErrorTimer(newError.id);
  };

  const startErrorTimer = (errorId: string, initialDelay = 8000) => {
    const timer = setTimeout(() => removeError(errorId), initialDelay);
    timersRef.current.set(errorId, { 
      timer, 
      remaining: initialDelay 
    });
  };

  const removeError = (id: string) => {
    const timerInfo = timersRef.current.get(id);
    if (timerInfo) {
      clearTimeout(timerInfo.timer);
      timersRef.current.delete(id);
    }
    setErrors(prev => prev.filter(error => error.id !== id));
  };

  const handleErrorHover = (errorId: string) => {
    const timerInfo = timersRef.current.get(errorId);
    if (timerInfo) {
      clearTimeout(timerInfo.timer);
      timerInfo.remaining = Math.max(0, timerInfo.remaining - 
        (Date.now() - errors.find(e => e.id === errorId)!.timestamp));
    }
  };

  const handleErrorLeave = (errorId: string) => {
    const timerInfo = timersRef.current.get(errorId);
    if (timerInfo) {
      const timer = setTimeout(() => removeError(errorId), timerInfo.remaining);
      timersRef.current.set(errorId, { ...timerInfo, timer });
    }
  };

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
        
        if (!response.ok) {
          const url = typeof input === 'string' 
            ? input 
            : input instanceof URL 
              ? input.href
              : input instanceof Request 
                ? input.url 
                : String(input);

          const errorDetails: ErrorDetails = {
            type: 'NetworkError',
            url,
            method: init?.method || 'GET',
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
          };

          try {
            const clonedResponse = response.clone();
            const responseData = await clonedResponse.json();
            errorDetails.response = responseData;
          } catch {
            try {
              const clonedResponse = response.clone();
              const responseText = await clonedResponse.text();
              errorDetails.response = responseText;
            } catch (e) {
              errorDetails.response = 'Unable to read response body';
            }
          }

          const error = new Error(`${response.status} ${response.statusText}`);
          addError(error, errorDetails);
        }
        
        return response;
      } catch (error) {
        const url = typeof input === 'string' 
          ? input 
          : input instanceof URL 
            ? input.href
            : input instanceof Request 
              ? input.url 
              : String(input);

        addError(error as Error, {
          type: 'NetworkError',
          url,
          method: init?.method || 'GET'
        });
        throw error;
      }
    };

    const XHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string) {
      this.addEventListener('error', () => {
        addError(new Error('Network request failed'), {
          type: 'NetworkError',
          url,
          method
        });
      });

      this.addEventListener('load', () => {
        if (this.status >= 400) {
          addError(new Error(`${this.status} ${this.statusText}`), {
            type: 'NetworkError',
            url,
            method,
            status: this.status,
            statusText: this.statusText,
            response: this.responseText,
            headers: this.getAllResponseHeaders()
              .split('\r\n')
              .reduce((acc, current) => {
                const [name, value] = current.split(': ');
                if (name) acc[name] = value;
                return acc;
              }, {} as Record<string, string>)
          });
        }
      });

      return XHROpen.apply(this, arguments as any);
    };

    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      const error = event.error || new Error(event.message);
      error.stack = error.stack || `at ${event.filename}:${event.lineno}:${event.colno}`;
      addError(error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const error = event.reason instanceof Error ? 
        event.reason : 
        new Error(event.reason?.message || 'Promise rejected');
      addError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    const cleanupTimer = setInterval(() => {
      errors.forEach(error => {
        const timerInfo = timersRef.current.get(error.id);
        if (timerInfo && !timerInfo.timer) {
          startErrorTimer(error.id, timerInfo.remaining);
        }
      });
    }, 1000);

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(cleanupTimer);
      timersRef.current.forEach(({ timer }) => clearTimeout(timer));
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ addError, removeError }}>
      {children}
      <div className={styles.container}>
        {errors.map(error => (
          <ErrorNotification
            key={error.id}
            error={error}
            onClose={() => removeError(error.id)}
            onHover={() => handleErrorHover(error.id)}
            onLeave={() => handleErrorLeave(error.id)}
          />
        ))}
      </div>
    </ErrorContext.Provider>
  );
};

export class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const context = useContext(ErrorContext);
    if (context) {
      const enhancedError = {
        ...error,
        componentStack: errorInfo.componentStack
      };
      context.addError(enhancedError);
    }
    setTimeout(() => this.setState({ hasError: false }), 1000);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export const ErrorHandlingProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalErrorHandler>
      <GlobalErrorBoundary>
        {children}
      </GlobalErrorBoundary>
    </GlobalErrorHandler>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorHandlingProvider;