import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { CaptchaProvider } from './hooks/useCaptcha.tsx';
import ErrorHandlingProvider from './components/ErrorHandling/ErrorHandling';
import './i18n';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorHandlingProvider>
      <BrowserRouter>
        <CaptchaProvider>
          <App />
        </CaptchaProvider>
      </BrowserRouter>
    </ErrorHandlingProvider>
  </React.StrictMode>
);