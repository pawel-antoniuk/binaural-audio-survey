import { createContext, useContext, ReactNode, useRef } from 'react';
import { config } from '../config';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    }
  }
}

interface CaptchaContextType {
  getCaptchaToken: () => Promise<string>;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

const loadReCaptchaScript = (siteKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve(); // Script already loaded
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'));

    document.body.appendChild(script);
  });
};

export const CaptchaProvider = ({ children }: { children: ReactNode }) => {
  const siteKey = config.recaptcha.siteKey;
  const scriptLoaded = useRef(false);

  const getCaptchaToken = async (): Promise<string> => {
    if (!scriptLoaded.current) {
      await loadReCaptchaScript(siteKey);
      scriptLoaded.current = true;
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action: 'submit' })
          .then((token: string) => resolve(token))
          .catch(reject);
      });
    });
  };

  return (
    <CaptchaContext.Provider value={{ getCaptchaToken }}>
      {children}
    </CaptchaContext.Provider>
  );
};

export const useCaptcha = () => {
  const context = useContext(CaptchaContext);
  if (context === undefined) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return context;
};