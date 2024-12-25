import React, { useState } from "react";
import styles from './Button.module.css';

type ButtonProps = {
  children?: React.ReactNode;
  onClick: () => void | Promise<void>;
  icon?: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  preventDoubleClick?: boolean;
  debounceTime?: number;
  isEnabled?: boolean;
};

const LoadingSpinner = () => (
  <div className={styles.spinnerWrapper}>
    <div className={styles.spinner} />
  </div>
);

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon,
  style = {},
  className,
  preventDoubleClick = false,
  debounceTime = 1000,
  isEnabled = true,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isEnabled && preventDoubleClick) {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        await onClick();
      } catch (error) {
        console.error('Button action failed:', error);
      } finally {
        setTimeout(() => {
          setIsProcessing(false);
        }, debounceTime);
      }
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.button} ${className} ${preventDoubleClick && isProcessing ? styles.processing : ''} 
        ${!isEnabled ? styles.disabled : ''}`}
      style={style}
    >
      {!isProcessing && icon && <div className={styles.iconContainer}>{icon}</div>}
      {isProcessing && preventDoubleClick && <LoadingSpinner />}
      {children && <span className={styles.text}>{children}</span>}
    </button>
  );
};

export default Button;