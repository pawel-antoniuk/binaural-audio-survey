import { config } from '../config';
import { ApiResponse } from '../models/api';
import Question from '../models/Question';
import { apiClient } from './api.config';

export class QuestionService {
  private static instance: QuestionService;
  private readonly endpoint = '/questions';

  private constructor() {}

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  async getQuestions(token: string): Promise<Question[]> {
    const response = await apiClient.post<ApiResponse<Question[]>>(
      this.endpoint,
      {}, // No body since token is in the header
      {
        headers: {
          'X-Recaptcha-Token': token, // Custom header for reCAPTCHA token
        },
      }
    );

    return response.data.data.map(q => ({
      id: q.id, 
      audioFilename: `${config.surveyService.baseUrl}/audio/${q.audioFilename}`
    }));
  }
}