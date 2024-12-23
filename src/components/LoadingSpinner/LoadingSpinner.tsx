import React, { useEffect, useState } from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  label: string;
  isVisible?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  label, 
  isVisible = false 
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this with your exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`${styles.loadingContainer} ${isVisible ? styles.enter : styles.exit}`}
      aria-hidden={!isVisible}
    >
      <div className={styles.content}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
          <div className={styles.spinnerCircle}></div>
        </div>
        <span className={styles.loadingLabel} role="status">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;