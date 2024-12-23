import { Answer } from '../models/Answer';
import { ApiResponse } from '../models/api';
import { apiClient } from './api.config';

export class AnswerService {
  private static instance: AnswerService;
  private readonly endpoint = '/answers';

  private constructor() {}

  public static getInstance(): AnswerService {
    if (!AnswerService.instance) {
      AnswerService.instance = new AnswerService();
    }
    return AnswerService.instance;
  }

  async sendAnswer(token: string, answer: Answer): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      this.endpoint,
      answer,
      {
        headers: {
          'X-Recaptcha-Token': token,
        },
      }
    );
    console.log(response);
  }
}