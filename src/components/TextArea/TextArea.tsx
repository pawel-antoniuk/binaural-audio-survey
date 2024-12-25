import React, { ReactNode } from "react";
import styles from "./TextArea.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: ReactNode;
  className?: string;
}

const TextArea: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "",
  className = ""
}) => {
  const getPlaceholderString = () => {
    if (typeof placeholder === 'string') {
      return placeholder;
    }
    
    if (React.isValidElement(placeholder)) {
      const props = placeholder.props as { children?: string };
      return props.children || '';
    }
    return '';
  };

  return (
    <textarea
      className={`${styles.textarea} ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={getPlaceholderString()}
      autoFocus
    />
  );
};

export default TextArea;