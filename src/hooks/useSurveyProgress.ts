import { useState, useEffect } from 'react';
import useLocalStorage from './localStorage.hook';
import { useQuestions } from './question.hook';
import Question from '../models/Question';

interface UseSurveyProgressProps {
  rememberProgress?: boolean;
}

interface UseSurveyProgressReturn {
  currentRecordingIndex: number;
  numberOfRecordings: number;
  questions: Question[];
  isLoading: boolean;
  nextQuestion: () => void;
  setCurrentRecordingIndex: (index: number) => void;
  resetProgress: () => void;
}

export const useSurveyProgress = ({
  rememberProgress = false
}: UseSurveyProgressProps): UseSurveyProgressReturn => {
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number>(0);
  const [localCurrentRecordingIndex, setLocalCurrentRecordingIndex] = useLocalStorage<number>("currentRecordingIndex", -1);
  const [numberOfRecordings, setNumberOfRecordings] = useState<number>(0);
  const [, setIsTransitioning] = useState(false);
  const { fetch: getQuestions } = useQuestions();
  const [localQuestions, setLocalQuestions] = useLocalStorage<Question[]>("questions", []);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (rememberProgress && localQuestions.length > 0 && localCurrentRecordingIndex >= 0) {
        setQuestions(localQuestions);
        setCurrentRecordingIndex(localCurrentRecordingIndex);
        return;
      }

      const remoteQuestions = await getQuestions() ?? [];
      setQuestions(remoteQuestions);

      if (rememberProgress) {
        setLocalQuestions(remoteQuestions);
      }
    }

    fetchQuestions();
  }, [rememberProgress, getQuestions]);

  useEffect(() => {
    if (rememberProgress) {
      setLocalCurrentRecordingIndex(currentRecordingIndex);
    }
  }, [currentRecordingIndex, rememberProgress]);

  useEffect(() => {
    setNumberOfRecordings(questions?.length ?? 0);
  }, [questions]);

  const nextQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRecordingIndex(currentRecordingIndex + 1);
      setIsTransitioning(false);
    }, 150);
  };

  const isLoading = !questions || questions.length === 0;

  const resetProgress = () => {
    setCurrentRecordingIndex(0);
    setLocalCurrentRecordingIndex(-1);
    setLocalQuestions([]);
  }

  return {
    currentRecordingIndex,
    numberOfRecordings,
    questions,
    isLoading,
    nextQuestion,
    setCurrentRecordingIndex,
    resetProgress
  };
};