import React, { useEffect, useState } from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  progress?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  children = null,
  isVisible = false,
  progress
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
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
        <span className={styles.loadingLabel} role="status">
          {children}
        </span>

        {progress !== undefined ? (
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            >
              <div className={styles.progressGlow}></div>
            </div>
            <span className={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        ) : (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinnerCircle}></div>
            <div className={styles.spinnerCircle}></div>
            <div className={styles.spinnerCircle}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;