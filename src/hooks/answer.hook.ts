import { useCallback } from 'react';
import { AnswerService } from '../services/answer.service';
import { Answer } from '../models/Answer';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    }
  }
}

interface UseAnswerResult {
  sendAnswer: (token: string, answer: Answer) => Promise<void>;
}

export const useAnswer = (): UseAnswerResult => {
  const answerService = AnswerService.getInstance();

  const sendAnswer = useCallback(async (token: string, answer: Answer) => {
    answerService.sendAnswer(token, answer);
  }, []);

  return {
    sendAnswer
  };
};