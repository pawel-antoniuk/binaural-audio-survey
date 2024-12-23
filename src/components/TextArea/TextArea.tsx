import React from "react";
import styles from "./TextArea.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextArea: React.FC<Props> = ({
  value,
  onChange,
  placeholder = ""
}) => {
  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus
    />
  );
};

export default TextArea;