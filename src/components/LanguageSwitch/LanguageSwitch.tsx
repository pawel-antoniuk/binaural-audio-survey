import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitch: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pl' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      {t('common.switchLanguage')}
    </button>
  );
};

export default LanguageSwitch;
