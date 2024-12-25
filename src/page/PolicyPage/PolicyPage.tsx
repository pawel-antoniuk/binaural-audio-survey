import { useState, type FC } from 'react';
import { Trans } from 'react-i18next';
import styles from './PolicyPage.module.css';
import TextButton from '../../components/TextButton/TextButton';
import { SkipBack, SkipForward } from 'lucide-react';
import Checkbox from '../../components/Checkbox/Checkbox';

type PolicyProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const PolicyPage: FC<PolicyProps> = ({ onNext, onPrevious }) => {
  const [consent, setConsent] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleConsentChange = (checked: boolean) => {
    setConsent(checked);
    if (checked) {
      setShowError(false);
    }
  };

  const handleNext = () => {
    if (!consent) {
      setShowError(true);
      return;
    }
    onNext();
  };

  return (
    <div className={styles.container}>
      <h1>Terms and Conditions</h1>
      <p>
        <Trans i18nKey="policy.disclaimer">
          The test was prepared according to the best academic practice.
          It is the responsibility of the participants to control the playback loudness at safe and comfortable level.
          We are not liable for any hearing losses or damage sustained as a result of the test.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="policy.dataCollection">
          We collect information including participants' IP adresses and the names of their operating systems.
          This information is used to detect false responses.
          Cookies are used only for session management to detect the moment when the test has started or finished.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="policy.privacy">
          All the data gathered throughout the test will be processed anonymously.
          It is collected solely for academic research purposes and will not be passed to any third party.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="policy.approval">
          The study received approval of the Ethics Committee of Białystok University of Technology.
        </Trans>
      </p>

      <div className={styles.consentSection}>
        <div className={`${styles.consentContainer} ${showError ? styles.errorBorder : ''}`}>
          <Checkbox checked={consent} onChange={handleConsentChange} />
          <p>
            <Trans i18nKey="policy.consent">
              I hereby grant my consent to participate in the listening test and
              agree to terms and cookie policy.
            </Trans>
          </p>
        </div>
        {showError && (
          <div className={styles.errorMessage}>
            <Trans i18nKey="policy.consentError">
              Please accept the terms and cookie policy to continue
            </Trans>
          </div>
        )}
      </div>

      <div className={styles.navigation}>
        <TextButton
          onClick={onPrevious}
          startIcon={<SkipBack />}
        >
          <Trans i18nKey="headphoneTest.navigation.previous">Previous</Trans>
        </TextButton>
        <TextButton
          onClick={handleNext}
          isPrimary={true}
          endIcon={<SkipForward />}
          isEnabled={consent}
        >
          <Trans i18nKey="headphoneTest.navigation.next">Accept</Trans>
        </TextButton>
      </div>
    </div>
  );
};

export default PolicyPage;