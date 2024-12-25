import { useState, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './FinishPage.module.css';

type Props = {
  onComment: (message: string) => void;
  onCredits: () => void;
};

const FinishPage: FC<Props> = ({ onComment, onCredits }) => {
  useTranslation();
  const [comment, setComment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (comment.trim()) {
      onComment(comment);
      setShowConfirmation(true);
      setComment('');

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>
          <Trans i18nKey="finishPage.title">Thank you!</Trans>
        </h1>
        <h2>
          <Trans i18nKey="finishPage.subtitle">You've completed the test.</Trans>
        </h2>
      </div>

      <p className={styles.description}>
        <Trans i18nKey="finishPage.description">
          We hope you have enjoyed our test. Please leave your feedback in the box below. 
          Your effort will be appreciated.
        </Trans>
      </p>

      {showConfirmation && (
        <div className={styles.confirmation}>
          <span>
            <Trans i18nKey="finishPage.confirmation.success">
              Message submitted successfully!
            </Trans>
          </span>
          <button
            className={styles.closeButton}
            onClick={() => setShowConfirmation(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type your message here..."
        className={styles.textArea}
      />

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={!comment.trim()}
      >
        <Trans i18nKey="finishPage.buttons.submit">Submit message</Trans>
      </button>

      <p className={styles.credits}>
        <Trans i18nKey="finishPage.credits">
          <b>Credits</b>: to see a list of credits,{' '}
          <button onClick={onCredits} className={styles.creditsLink}>click here</button>
        </Trans>
      </p>
    </div>
  );
};

export default FinishPage;