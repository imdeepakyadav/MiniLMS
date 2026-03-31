export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface AuthResponse {
  statusCode: number;
  data: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
  message: string;
  success: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  success: boolean;
}
