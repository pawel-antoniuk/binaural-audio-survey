import React, { useEffect, useState, useRef } from "react";
import styles from "./Introduction.module.css";
import { Trans, useTranslation } from 'react-i18next';
import TextButton from "../../components/TextButton/TextButton";
import { Play } from "lucide-react";

import logoEn from '../../assets/logo-wi-en.svg';
import logoPl from '../../assets/logo-wi-pl.svg';

interface IntroductionProps {
  onStart: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(true);

  const logoContent = {
    en: {
      src: logoEn,
      url: 'https://wi.pb.edu.pl/en/'
    },
    pl: {
      src: logoPl,
      url: 'https://wi.pb.edu.pl/'
    }
  };

  const currentLang = i18n.language.split('-')[0];
  const { src: logoSrc, url: logoUrl } = logoContent[currentLang as keyof typeof logoContent] || logoContent.en;

  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        const contentHeight = containerRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const logoHeight = 200;
        const totalRequiredHeight = contentHeight + logoHeight;

        setIsFixed(totalRequiredHeight <= viewportHeight);
      }
    };

    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  return (
    <div className="page-container" ref={containerRef}>
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

      <div className="navigation">
        <TextButton
          startIcon={<Play />}
          onClick={onStart}
          isPrimary={true}
        >
          <Trans i18nKey="introduction.start">
            Next
          </Trans>
        </TextButton>
      </div>

      <div className={`${styles.logoContainer} ${!isFixed ? styles.relative : ''}`}>
        <a href={logoUrl} target="_blank" rel="noopener noreferrer">
          <img src={logoSrc} alt={t('introduction.logoAlt')} className={styles.logo} />
        </a>
      </div>
    </div>
  );
};

export default Introduction;