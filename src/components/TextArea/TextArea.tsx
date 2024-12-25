import React, { ReactNode } from "react";
import styles from "./TextArea.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: ReactNode;
}

const TextArea: React.FC<Props> = ({
  value,
  onChange,
  placeholder = ""
}) => {
  // Convert ReactNode placeholder to string if it's not already a string
  const getPlaceholderString = () => {
    if (typeof placeholder === 'string') {
      return placeholder;
    }
    // If it's a React element, try to get its text content
    if (React.isValidElement(placeholder)) {
      const props = placeholder.props as { children?: string };
      return props.children || '';
    }
    return '';
  };

  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={getPlaceholderString()}
      autoFocus
    />
  );
};

export default TextArea;