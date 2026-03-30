import { apiGet, apiPost } from '@services/api';
import { saveToken, removeToken } from '@services/secureStorage';
import { setItem, removeItem } from '@services/storage';
import { STORAGE_KEYS } from '@utils/constants';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@types/auth.types';
import { ApiResponse } from '@types/api.types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await apiPost<AuthResponse>('api/v1/users/login', data);
  if (response.success && response.data.accessToken) {
    await saveToken(response.data.accessToken);
    await setItem(STORAGE_KEYS.USER_DATA, response.data.user);
  }
  return response;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await apiPost<AuthResponse>('api/v1/users/register', data);
  return response;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiGet<ApiResponse<User>>('api/v1/users/current-user');
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiPost('api/v1/users/logout');
  } catch (err) {
    // Ignore error if logout fails on server
  }
  await removeToken();
  await removeItem(STORAGE_KEYS.USER_DATA);
};
