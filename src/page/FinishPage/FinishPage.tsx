import { useState, type FC } from 'react';
import styles from './FinishPage.module.css';

type Props = {
  onComment: (message: string) => void;
  onCredits: () => void;
};

const FinishPage: FC<Props> = ({ onComment, onCredits }) => {
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
          Thank you!
        </h1>
        <h2>
          You've completed the test.
        </h2>
      </div>

      <p className={styles.description}>
        We hope you have enjoyed our test. Please leave your feedback in the box below.
        Your effort will be appreciated.
      </p>

      {showConfirmation && (
        <div className={styles.confirmation}>
          <span>Message submitted successfully!</span>
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
        Submit message
      </button>

      <p className={styles.credits}>
        <b>Credits:</b> to see a list of credits,{' '}
        <button onClick={onCredits} className={styles.creditsLink}>
          click here
        </button>
      </p>
    </div>
  );
};

export default FinishPage;