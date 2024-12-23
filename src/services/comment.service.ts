import { ApiResponse } from '../models/api';
import Comment from '../models/Comment';
import { apiClient } from './api.config';

export class CommentService {
  private static instance: CommentService;
  private readonly endpoint = '/comments';

  private constructor() {}

  public static getInstance(): CommentService {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async sendComment(token: string, comment: Comment): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      this.endpoint,
      comment,
      {
        headers: {
          'X-Recaptcha-Token': token,
        },
      }
    );
    console.log(response);
  }
}