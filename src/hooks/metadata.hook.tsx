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

export function useUserMetadata(): UserMetadata {
  return {
    browser: getBrowserInfo(),
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    platform: window.navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookiesEnabled: window.navigator.cookieEnabled,
    loading: true
  };
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