export interface ApiResource {
  id?: string | number;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  // Add other common response fields if needed
}