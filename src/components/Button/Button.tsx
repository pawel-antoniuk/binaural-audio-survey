import React from "react";
import styles from './Button.module.css';

type ButtonProps = {
  children?: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  caption?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon,
  style = {},
  className,
  caption = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      style={{
        ...style,
      }}
    >
      {icon ?? <div className={styles.iconContainer}>{icon}</div>}
      {children && <span>{children}</span>}
      {caption && (
        <span className={styles.caption}>
          {caption}
        </span>
      )}
    </button>
  );
};

export default Button;