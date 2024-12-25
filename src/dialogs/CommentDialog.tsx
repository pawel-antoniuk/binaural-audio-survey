import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './CommentDialog.module.css';
import TextButton from '../components/TextButton/TextButton';
import TextArea from '../components/TextArea/TextArea';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

const CommentDialog = ({ isOpen, onClose, onSubmit }: CommentDialogProps) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialogRef.current && showThankYou) {
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
      
      setTimeout(() => {
        setShowThankYou(true);
      }, 300);
      
      setTimeout(() => {
        setShowThankYou(false);
        setIsTransitioning(false);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        ref={dialogRef}
        className={styles.dialogContainer} 
        onClick={e => e.stopPropagation()}
      >
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label={t("commentDialog.close")}
        >
          <X size={20} />
        </button>

        {showThankYou ? (
          <div className={`${styles.thankYouMessage} ${styles.enter}`}>
            <p>
              <Trans i18nKey="commentDialog.thankYou">
                Thanks for your feedback! 🎉
              </Trans>
            </p>
          </div>
        ) : (
          <div className={`${styles.dialogContent} ${isTransitioning ? styles.exit : styles.enter}`}>
            <h2>
              <Trans i18nKey="commentDialog.title">
                Leave a Comment
              </Trans>
            </h2>
            <p>
              <Trans i18nKey="commentDialog.description">
                Share your thoughts about what you see or hear.
              </Trans>
            </p>
            <TextArea
              value={comment}
              onChange={setComment}
              placeholder={<Trans i18nKey="commentDialog.placeholder">Type your comment here...</Trans>}
            />
            <div className={styles.buttonGroup}>
              <TextButton onClick={onClose}>
                <Trans i18nKey="commentDialog.buttons.cancel">
                  Cancel
                </Trans>
              </TextButton>
              <TextButton
                onClick={handleSubmit}
                isPrimary={true}
                isEnabled={!!comment.trim()}
              >
                <Trans i18nKey="commentDialog.buttons.submit">
                  Submit
                </Trans>
              </TextButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentDialog;