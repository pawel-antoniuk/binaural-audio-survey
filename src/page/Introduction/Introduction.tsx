import React, {useState} from "react";
import styles from "./Introduction.module.css";
import logo from '../../assets/logo-wi.svg';
import Checkbox from "../../components/Checkbox/Checkbox";
import StartButton from "../../components/StartButton/StartButton";
import {config} from "../../config";
import {Trans, useTranslation} from 'react-i18next';

interface IntroductionProps {
  onStart: () => void;
  onPolicy: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({onStart, onPolicy}) => {
  const {t} = useTranslation();
  const [consent, setConsent] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleConsentChange = (checked: boolean) => {
    setConsent(checked);
    if (checked) {
      setShowError(false);
    }
  };

  const handleStart = () => {
    if (!consent) {
      setShowError(true);
      return;
    }
    onStart();
  };
  return (
    <div className={styles.container}>
      <h1>
        <Trans i18nKey="introduction.welcome">
          Welcome
        </Trans>
      </h1>
      <p>
        <Trans i18nKey="introduction.description">
          This website contains a listening test which takes about 10 minutes to complete.
          During the test you will be asked to listen to 20 short music recordings and to
          indicate the direction where an ensemble of musicians is located. It requires
          using headphones.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="introduction.research">
          It's part of the research into perception of 3D audio carried out at
          <a href={t("introduction.universityLink")}>Bialystok University of Technology</a>.
          The tests are coordinated by Dr S. K. Zielinski
          (email: <a href={`mailto:s.zielinski@pb.edu.pl`}>s.zielinski@pb.edu.pl</a>).
        </Trans>
      </p>
      <p>
        <Trans i18nKey="introduction.dataCollection">
          For the research purposes, we gather anonymous data,
          including information regarding listeners' age, background,
          and model of headphones used. We also use cookies for session management.
        </Trans>
      </p>
      <div className={styles.consentSection}>
        <div className={`${styles.consentContainer} ${showError ? styles.errorBorder : ''}`}>
          <Checkbox checked={consent} onChange={handleConsentChange}/>
          <p>
            <Trans i18nKey="introduction.consent">
              I hereby grant my consent to participate in the listening test and
              agree to <a href="#" onClick={onPolicy}>terms and cookie policy</a>.
            </Trans>
          </p>
        </div>
        {showError && (
          <div className={styles.errorMessage}>
            <Trans i18nKey="introduction.consentError">
              Please accept the terms and cookie policy to continue
            </Trans>
          </div>
        )}
      </div>
      <StartButton
        onStart={handleStart}
        isEnabled={consent}
        siteKey={config.recaptcha.siteKey}
      />
      <a href="https://wi.pb.edu.pl/en/" target="_blank" rel="noopener noreferrer">
        <img src={logo} alt={t('introduction.logoAlt')} className={styles.logo}/>
      </a>
    </div>
  );
};

export default Introduction;