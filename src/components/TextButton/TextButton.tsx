import React, { ReactElement } from "react";
import styles from './TextButton.module.css';

type TextButtonProps = {
  onClick: () => void;
  text?: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  className?: string;
  style?: React.CSSProperties;
  isEnabled?: boolean;
  isPrimary?: boolean;
};

const TextButton: React.FC<TextButtonProps> = ({
  onClick,
  text,
  startIcon,
  endIcon,
  style = {},
  className = "",
  isEnabled = true,
  isPrimary = false,
}) => {
  return (
    <button
      onClick={isEnabled ? onClick : undefined}
      className={`${styles.button} ${className} ${!isEnabled ? styles.disabled : ''} ${isPrimary ? styles.primary : ''}`}
      style={style}
      disabled={!isEnabled}
    >
      {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
      {text && <span>{text}</span>}
      {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};

export default TextButton;