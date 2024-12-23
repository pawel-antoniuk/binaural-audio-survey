import { ApiResponse } from '../models/api';
import { User } from '../models/User';
import { apiClient } from './api.config';

export class UserService {
  private static instance: UserService;
  private readonly endpoint = '/users';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async sendUser(token: string, user: User): Promise<void> {
    const response = await apiClient.post<ApiResponse<void>>(
      this.endpoint,
      user,
      {
        headers: {
          'X-Recaptcha-Token': token,
        },
      }
    );
    console.log(response);
  }
}