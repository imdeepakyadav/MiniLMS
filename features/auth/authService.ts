import { apiGet, apiPost } from "@services/api";
import { removeRefreshToken, removeToken } from "@services/secureStorage";
import { removeItem } from "@services/storage";
import { STORAGE_KEYS } from "@utils/constants";
import { ApiResponse } from "../../types/api.types";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../../types/auth.types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return apiPost<AuthResponse>("api/v1/users/login", data);
};

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  return apiPost<AuthResponse>("api/v1/users/register", data);
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiGet<ApiResponse<User>>("api/v1/users/current-user");
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await apiPost("api/v1/users/logout");
  } catch (err) {}
  await removeToken();
  await removeRefreshToken();
  await removeItem(STORAGE_KEYS.USER_DATA);
};
