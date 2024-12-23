import React from "react";
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
      <h1>Are you ready?</h1>
      <p>
        You are about to start the actual survey. If you need to review the guide again or feel unsure, you can go back. Once you click "Yes, I'm ready", the survey will begin.
      </p>

      <div className={styles.navigation}>
        <TextButton text="No, go back to guide" onClick={() => { onReturn(); }} startIcon={<SkipBack />} />
        <TextButton text="Yes, I'm ready" onClick={() => { onStart(); }} isPrimary={true} endIcon={<SkipForward />} />
      </div>
    </div>
  );
};

export default PreparePage;