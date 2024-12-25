import React from 'react';
import { useTranslation } from 'react-i18next';
import Switch from '../Switch/Switch';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = (checked: boolean) => {
    const newLang = checked ? 'pl' : 'en-GB';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>EN</span>
      <Switch
        checked={i18n.language === 'pl'}
        onToggle={toggleLanguage}
        aria-label="Toggle language"
      />
      <span className={styles.label}>PL</span>
    </div>
  );
};

export default LanguageSwitcher;