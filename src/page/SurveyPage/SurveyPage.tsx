import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from './SurveyPage.module.css';
import RangeSurvey from "../../components/RangeSurvey/RangeSurvey";
import { useQuestions } from "../../hooks/question.hook";
import { useAudioPreloader } from "../../hooks/audio.hook";
import Tour from "../../components/Tour/Tour";
import AngularAnswer from "../../models/AngularAnswer";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

type Props = {
  onConfirm(questionId: string, audioFilename: string, angularAnswer: AngularAnswer): void;
  onComment(questionId: string, message: string): void;
  onFinish(): void;
};

const Survey: React.FC<Props> = ({ onConfirm, onComment, onFinish }) => {
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number>(0);
  const [numberOfRecordings, setNumberOfRecordings] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { data: questions } = useQuestions();
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);
  const [isSmallTourRunning, setIsSmallTourRunning] = useState<boolean>(false);

  function currentQuestionName(): string {
    const question = questions[currentRecordingIndex];
    return question?.audioFilename?.split('/')?.pop() ?? '';
  }

  function nextQuestion() {
    setIsTransitioning(true);
    setTimeout(() => {
      stop();
      setCurrentRecordingIndex(currentRecordingIndex + 1);
      setAudioPlayed(false);
      setIsTransitioning(false);
    }, 150);
  }

  const getAudioUrls = useCallback(() => {
    return questions.map(q => q.audioFilename);
  }, [questions]);

  const {
    isLoading: isAudioLoading,
    isPlaying,
    play,
    pause,
    stop
  } = useAudioPreloader(getAudioUrls);

  // Combined loading state that checks both audio loading and questions availability
  const isLoading = isAudioLoading || !questions || questions.length === 0;

  useEffect(() => {
    setNumberOfRecordings(questions?.length ?? 0);
  }, [questions]);

  const handlePlayToggle = () => {
    setIsSmallTourRunning(false);
    if (isPlaying) {
      pause();
    } else {
      play(currentRecordingIndex);
      setAudioPlayed(true);
    }
  };

  const handleConfirm = (answer: AngularAnswer) => {
    if (audioPlayed) {
      const currentQuestion = questions[currentRecordingIndex];
      onConfirm(
        currentQuestion.id,
        currentQuestion.audioFilename,
        answer
      );
      if (currentRecordingIndex < numberOfRecordings - 1) {
        nextQuestion();
      } else {
        onFinish();
      }
    } else {
      setIsSmallTourRunning(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePlayToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, play, pause, currentRecordingIndex]);

  return (
    <>
      <LoadingSpinner 
        label={!questions || questions.length === 0 ? "Loading questions..." : "Loading recordings..."} 
        isVisible={isLoading} 
      />
      <div className={`${styles.mainContainer} step-end`}>
        {isSmallTourRunning && (
          <Tour
            steps={[1, 4]}
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
            className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ''}`}
          >
            {!isLoading && (
              <RangeSurvey
                onPlayToggle={handlePlayToggle}
                onCommentSubmit={(message) => onComment(questions[currentRecordingIndex].id, message)}
                onConfirm={handleConfirm}
                isPlaying={isPlaying}
                currentRecordingIndex={currentRecordingIndex}
                numberOfRecordings={numberOfRecordings}
                currentPlayingRecordingName={currentQuestionName()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Survey;