import React, { ReactElement, ReactNode } from "react";
import styles from './TextButton.module.css';

type TextButtonProps = {
  onClick: () => void;
  children?: ReactNode;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  className?: string;
  style?: React.CSSProperties;
  isEnabled?: boolean;
  isPrimary?: boolean;
};

const TextButton: React.FC<TextButtonProps> = ({
  onClick,
  children,
  startIcon,
  endIcon,
  style = {},
  className = "",
  isEnabled = true,
  isPrimary = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className} ${!isEnabled ? styles.disabled : ''} ${isPrimary ? styles.primary : ''}`}
      style={style}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      {children && <span>{children}</span>}
      {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};

export default TextButton;