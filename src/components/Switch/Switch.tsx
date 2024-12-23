import React from "react";
import styles from "./Switch.module.css";

interface SwitchProps {
  onToggle: (checked: boolean) => void;
  checked: boolean;
  label?: string;  // Make label optional
}

const Switch: React.FC<SwitchProps> = ({ onToggle, checked, label }) => {
  return (
    <div className={styles.switchContainer}>
      <div className={styles.switch}>
        <input
          type="checkbox"
          id="toggleSwitch"
          className={styles.switchInput}
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <label htmlFor="toggleSwitch" className={styles.switchLabel}></label>
      </div>
      {label && <span className={styles.switchText}>{label}</span>}
    </div>
  );
};

export default Switch;