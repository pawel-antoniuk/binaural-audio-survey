import { config } from '../config';
import Question from '../models/Question';
import { ApiService } from '../services/api.service';
import { createResourceHook } from './useResource';

const questionService = new ApiService<Question>('/questions', (question) => ({
  ...question,
  audioFilename: `${config.surveyService.baseUrl}/audio/${question.audioFilename}`
}));

export const useQuestions = createResourceHook(questionService, { autoFetch: false });
