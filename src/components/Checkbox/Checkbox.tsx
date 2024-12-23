import type { FC, MouseEvent } from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <span 
      className={`${styles.container} ${className}`}
      onClick={(e: MouseEvent) => {
        if (!disabled) {
          e.preventDefault();
          onChange?.(!checked);
        }
      }}
    >
      <div 
        className={`
          ${styles.checkbox}
          ${checked ? styles.checked : ''}
          ${disabled ? styles.disabled : ''}
        `}
      >
        {checked && (
          <Check 
            size={14} 
            className={styles.checkIcon}
            strokeWidth={3}
          />
        )}
      </div>
    </span>
  );
};

export default Checkbox;