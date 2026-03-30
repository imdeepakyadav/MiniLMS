export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: {
    data: T[];
  };
  success: boolean;
  message: string;
}