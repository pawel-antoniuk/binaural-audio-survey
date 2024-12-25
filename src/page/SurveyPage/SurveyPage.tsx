import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from './SurveyPage.module.css';
import RangeSurvey from "../../components/RangeSurvey/RangeSurvey";
import Tour from "../../components/Tour/Tour";
import AngularAnswer from "../../models/AngularAnswer";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useSurveyProgress } from "../../hooks/useSurveyProgress";
import { useAudioControl } from "../../hooks/useAudioControls";

type Props = {
  onConfirm(questionId: string, audioFilename: string, angularAnswer: AngularAnswer): void;
  onComment(questionId: string, message: string): void;
  onFinish(): void;
  rememberProgress: boolean;
};

const Survey: React.FC<Props> = ({ onConfirm, onComment, onFinish, rememberProgress = false }) => {
  const { t } = useTranslation();
  const [isSmallTourRunning, setIsSmallTourRunning] = useState<boolean>(false);

  const {
    currentRecordingIndex,
    numberOfRecordings,
    questions,
    isLoading,
    nextQuestion,
    resetProgress
  } = useSurveyProgress({ rememberProgress });

  const {
    isAudioLoading,
    isPlaying,
    audioPlayed,
    handlePlayToggle,
    stop
  } = useAudioControl({ questions, currentRecordingIndex });

  const handleFinish = () => {
    resetProgress();
    onFinish();
  }

  const handleConfirm = (answer: AngularAnswer) => {
    if (audioPlayed) {
      stop();
      const currentQuestion = questions[currentRecordingIndex];
      onConfirm(
        currentQuestion.id,
        currentQuestion.audioFilename,
        answer
      );
      if (currentRecordingIndex < numberOfRecordings - 1) {
        nextQuestion();
      } else {
        handleFinish();
      }
    } else {
      setIsSmallTourRunning(true);
    }
  };

  const getLoadingMessage = () => {
    if (!questions || questions.length === 0) {
      return t('survey.loading.questions');
    }
    return t('survey.loading.recordings');
  };

  return (
    <div className="page-container">
      <LoadingSpinner
        label={getLoadingMessage()}
        isVisible={isLoading || isAudioLoading}
      />
      <div className={`${styles.mainContainer} step-end`}>
        {isSmallTourRunning && (
          <Tour
            steps={[1, 5]}
            onEnd={() => setIsSmallTourRunning(false)}
          />
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRecordingIndex}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={styles.contentWrapper}
          >
            {!isLoading && !isAudioLoading && (
              <RangeSurvey
                onPlayToggle={handlePlayToggle}
                onCommentSubmit={(message) => onComment(questions[currentRecordingIndex].id, message)}
                onConfirm={handleConfirm}
                isPlaying={isPlaying}
                currentRecordingIndex={currentRecordingIndex}
                numberOfRecordings={numberOfRecordings}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Survey;