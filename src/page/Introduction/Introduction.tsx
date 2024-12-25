import React, { useState } from "react";
import styles from "./Introduction.module.css";
import logo from '../../assets/logo-wi.svg';
import { Trans, useTranslation } from 'react-i18next';
import TextButton from "../../components/TextButton/TextButton";
import { Play } from "lucide-react";

interface IntroductionProps {
  onStart: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  const { t } = useTranslation();

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
          It's part of the research into perception of 3D audio carried out at <a href={t("introduction.universityLink")}>Bialystok University of Technology</a>.
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
      <TextButton
        startIcon={<Play />}
        onClick={onStart}
        isPrimary={true}
      >
        <Trans i18nKey="introduction.start">
          Next
        </Trans>
      </TextButton>
      <a href="https://wi.pb.edu.pl/en/" target="_blank" rel="noopener noreferrer">
        <img src={logo} alt={t('introduction.logoAlt')} className={styles.logo} />
      </a>
    </div>
  );
};

export default Introduction;