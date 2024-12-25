import { apiClient } from './api.config';
import { ApiResource, ApiResponse } from '../types/api';

export class ApiService<T extends ApiResource> {
  constructor(
    readonly endpoint: string,
    protected readonly transformResponse?: (data: T) => T
  ) {}

  async getAll(token: string): Promise<T[]> {
    const response = await apiClient.post<ApiResponse<T[]>>(
      this.endpoint,
      {},
      this.getRequestConfig(token)
    );
    const items = response.data.data;
    return this.transformResponse ? items.map(this.transformResponse) : items;
  }

  async getOne(id: string | number, token: string): Promise<T> {
    const response = await apiClient.get<ApiResponse<T>>(
      `${this.endpoint}/${id}`,
      this.getRequestConfig(token)
    );
    const item = response.data.data;
    return this.transformResponse ? this.transformResponse(item) : item;
  }

  async create(data: Partial<T>, token: string): Promise<T> {
    const response = await apiClient.post<ApiResponse<T>>(
      this.endpoint,
      data,
      this.getRequestConfig(token)
    );
    const item = response.data.data;
    return this.transformResponse ? this.transformResponse(item) : item;
  }

  async update(id: string | number, data: Partial<T>, token: string): Promise<T> {
    const response = await apiClient.put<ApiResponse<T>>(
      `${this.endpoint}/${id}`,
      data,
      this.getRequestConfig(token)
    );
    const item = response.data.data;
    return this.transformResponse ? this.transformResponse(item) : item;
  }

  async delete(id: string | number, token: string): Promise<void> {
    await apiClient.delete(
      `${this.endpoint}/${id}`,
      this.getRequestConfig(token)
    );
  }

  private getRequestConfig(token: string) {
    return {
      headers: {
        'X-Recaptcha-Token': token,
      },
    };
  }
}