import { useState, type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styles from './FinishPage.module.css';
import TextArea from '../../components/TextArea/TextArea';
import TextButton from '../../components/TextButton/TextButton';

type Props = {
  onComment: (message: string) => void;
  onCredits: () => void;
};

const FinishPage: FC<Props> = ({ onComment, onCredits }) => {
  const { t } = useTranslation();
  const [comment, setComment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = () => {
    if (comment.trim()) {
      onComment(comment);
      setShowConfirmation(true);
      setComment('');

      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }
  };

  return (
    <div className="page-container">
      <h1>
        <Trans i18nKey="finishPage.title">Thank you!</Trans>
      </h1>
      <h2>
        <Trans i18nKey="finishPage.subtitle">You've completed the test</Trans>
      </h2>

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

      <TextArea
        value={comment}
        onChange={(value) => setComment(value)}
        placeholder={t('finishPage.comment.placeholder')}
        className={styles.textArea}
      />


      <div className='navigation'>
        <TextButton
          className={styles.submitButton}
          onClick={handleSubmit}
          isEnabled={!!comment.trim()}
        >
          <Trans i18nKey="finishPage.buttons.submit">Submit message</Trans>
        </TextButton>
      </div>

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