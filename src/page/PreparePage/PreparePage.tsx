import React from "react";
import { Trans } from "react-i18next";
import TextButton from "../../components/TextButton/TextButton";
import styles from "./PreparePage.module.css";
import { SkipBack, SkipForward } from "lucide-react";

type PreparePageProps = {
  onStart: () => void;
  onReturn: () => void;
};

const PreparePage: React.FC<PreparePageProps> = ({ onStart, onReturn }) => {
  return (
    <div className={styles.container}>
      <h1>
        <Trans i18nKey="preparePage.title">
          Are you ready?
        </Trans>
      </h1>
      <p>
        <Trans i18nKey="preparePage.description">
          You are about to start the actual survey. If you need to review the guide again or feel unsure, 
          you can go back. Once you click "Yes, I'm ready", the survey will begin.
        </Trans>
      </p>

      <div className={styles.navigation}>
        <TextButton 
          onClick={onReturn} 
          startIcon={<SkipBack />}
        >
          <Trans i18nKey="preparePage.buttons.return">
            No, go back to guide
          </Trans>
        </TextButton>
        <TextButton 
          onClick={onStart}
          isPrimary={true} 
          endIcon={<SkipForward />}
        >
          <Trans i18nKey="preparePage.buttons.start">
            Yes, I'm ready
          </Trans>
        </TextButton>
      </div>
    </div>
  );
};

export default PreparePage;