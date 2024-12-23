export const config = (() => {
  const isDev = import.meta.env.MODE === 'development';
  const runtimeConfig = isDev ? {} : ((window as any)._env_ || {});
  
  return {
      surveyService: {
          baseUrl: isDev 
              ? import.meta.env.VITE_SURVEY_SERVICE_BASE_URL 
              : (runtimeConfig.SURVEY_SERVICE_BASE_URL || import.meta.env.VITE_SURVEY_SERVICE_BASE_URL || ''),
      },
      recaptcha: {
          siteKey: isDev
              ? import.meta.env.VITE_RECAPTCHA_SITE_KEY
              : (runtimeConfig.RECAPTCHA_SITE_KEY || import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''),
      }
  };
})();