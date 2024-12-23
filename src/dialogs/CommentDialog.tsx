import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './CommentDialog.module.css';
import TextButton from '../components/TextButton/TextButton';
import TextArea from '../components/TextArea/TextArea';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

const CommentDialog = ({ isOpen, onClose, onSubmit }: CommentDialogProps) => {
  const [comment, setComment] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialogRef.current && showThankYou) {
      // Set explicit height before transition
      const height = dialogRef.current.scrollHeight;
      dialogRef.current.style.height = `${height}px`;
    }
  }, [showThankYou]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (comment.trim()) {
      setIsTransitioning(true);
      onSubmit(comment);
      setComment('');
      
      // Start transition
      setTimeout(() => {
        setShowThankYou(true);
      }, 300); // Wait for exit animation
      
      // Close dialog after showing thank you message
      setTimeout(() => {
        setShowThankYou(false);
        setIsTransitioning(false);
        onClose();
      }, 2000); // Increased time to account for transitions
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={dialogRef}
        className={styles.dialogContainer} 
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        {showThankYou ? (
          <div className={`${styles.thankYouMessage} ${styles.enter}`}>
            <p>Thanks for your comment! 🎉</p>
          </div>
        ) : (
          <div className={`${styles.dialogContent} ${isTransitioning ? styles.exit : styles.enter}`}>
            <h2>Leave a comment</h2>
            <p>Share your thoughts about what you see or hear.</p>
            <TextArea
              value={comment}
              onChange={setComment}
              placeholder="Type your comment here..."
            />
            <div className={styles.buttonGroup}>
              <TextButton
                onClick={onClose}
                text="Cancel" />
              <TextButton
                onClick={handleSubmit}
                text="Submit"
                isPrimary={true}
                isEnabled={!!comment.trim()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentDialog;