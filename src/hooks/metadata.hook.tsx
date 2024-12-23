import { useState, useEffect } from 'react';

interface UserMetadata {
  browser: string;
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
  geoData?: any;
  loading: boolean;
  error?: string;
}

export const useUserMetadata = () => {
  const [metadata, setMetadata] = useState<UserMetadata>({
    browser: getBrowserInfo(),
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    platform: window.navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: window.navigator.cookieEnabled,
    loading: true
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        const response = await fetch('/api/ip');

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();

        setMetadata(prev => ({
          ...prev,
          geoData: data,
          loading: false
        }));
      } catch (error) {
        console.error('Failed to get location:', error);
        setMetadata(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch location data'
        }));
      }
    };

    getLocation();
  }, []);

  return metadata;
};

function getBrowserInfo(): string {
  const userAgent = window.navigator.userAgent;
  const browsers = [
    { name: 'Chrome', value: 'Chrome' },
    { name: 'Firefox', value: 'Firefox' },
    { name: 'Safari', value: 'Safari' },
    { name: 'Edge', value: 'Edg' },
    { name: 'Opera', value: 'Opera' }
  ];

  const browser = browsers.find(browser => userAgent.includes(browser.value));
  return browser?.name || 'Unknown Browser';
}