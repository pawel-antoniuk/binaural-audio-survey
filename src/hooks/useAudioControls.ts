import { useEffect, useCallback, useState } from 'react';
import { useAudioPreloader } from './audio.hook';
import Question from '../models/Question';

interface UseAudioControlProps {
  questions: Question[];
  currentRecordingIndex: number;
}

interface UseAudioControlReturn {
  isAudioLoading: boolean;
  isPlaying: boolean;
  audioPlayed: boolean;
  handlePlayToggle: () => void;
  stop: () => void;
}

export const useAudioControl = ({
  questions,
  currentRecordingIndex
}: UseAudioControlProps): UseAudioControlReturn => {
  const [audioPlayed, setAudioPlayed] = useState<boolean>(false);

  const getAudioUrls = useCallback(() => {
    return questions.map(question => question.audioFilename);
  }, [questions]);

  const {
    isLoading: isAudioLoading,
    isPlaying,
    play,
    pause,
    stop
  } = useAudioPreloader(getAudioUrls);

  const handlePlayToggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play(currentRecordingIndex);
      setAudioPlayed(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isEditingText = target.isContentEditable ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT';

      if (event.code === "Space" && !isEditingText) {
        event.preventDefault();
        handlePlayToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, play, pause, currentRecordingIndex]);

  useEffect(() => {
    const question = questions[currentRecordingIndex];
    const currentPlaying = question?.audioFilename?.split('/')?.pop() ?? '';
    if (currentPlaying && isPlaying) {
      console.log('Currently playing: ', currentPlaying);
    }
  }, [isPlaying]);

  return {
    isAudioLoading,
    isPlaying,
    audioPlayed,
    handlePlayToggle,
    stop
  };
};