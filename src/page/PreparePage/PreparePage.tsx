import React from "react";
import { Trans, useTranslation } from "react-i18next";
import TextButton from "../../components/TextButton/TextButton";
import { SkipBack, SkipForward } from "lucide-react";

type PreparePageProps = {
  onStart: () => void;
  onReturn: () => void;
};

const PreparePage: React.FC<PreparePageProps> = ({ onStart, onReturn }) => {
  useTranslation();
  
  return (
    <div className="page-container">
      <h1>
        <Trans i18nKey="preparePage.title">
          Are you ready?
        </Trans>
      </h1>

      <p>
        <Trans i18nKey="preparePage.description2">
          You will listen to 40 short audio recordings, each presenting different ensemble width.
          The test has no time limit and will take about 10 minutes.
        </Trans>
      </p>

      <p>
        <Trans i18nKey="preparePage.description1">
          You are about to start the survey. If you need to review the guide again or feel unsure,
          you can go back. Once you click "Yes, I'm ready", the survey will begin.
        </Trans>
      </p>

      <div className="navigation">
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