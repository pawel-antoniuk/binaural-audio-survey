import React from "react";
import styles from './Button.module.css';

type ButtonProps = {
  onClick: () => void;
  icon?: React.ReactNode;
  text?: string; // New prop for text
  size?: number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  caption?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  icon,
  text,
  style = {},
  className,
  caption = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${text ? styles.withText : ''} ${className}`}
      style={{
        padding: text ? '0 15px' : '0',
        ...style,
      }}
    >
      {icon ?? <div className={styles.iconContainer}>{icon}</div>}
      {text && <span className={styles.text}>{text}</span>}
      {caption && (
        <span className={styles.caption}>
          {caption}
        </span>
      )}
    </button>
  );
};

export default Button;