import { clearAuthSessionState } from "@services/authSession";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { AuthResponse } from "../types/auth.types";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import {
  getRefreshToken,
  getToken,
  removeRefreshToken,
  removeToken,
  saveRefreshToken,
  saveToken,
} from "./secureStorage";
import { removeItem } from "./storage";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const clearAuthSession = async () => {
  await removeToken();
  await removeRefreshToken();
  await removeItem(STORAGE_KEYS.USER_DATA);
  clearAuthSessionState();
  router.replace("/(auth)/login");
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest) {
      const isRefreshRequest = originalRequest.url?.includes("refresh-token");

      if (isRefreshRequest || originalRequest._retry) {
        await clearAuthSession();
      } else {
        originalRequest._retry = true;

        try {
          const refreshToken = await getRefreshToken();

          if (!refreshToken) {
            throw new Error("Missing refresh token");
          }

          const refreshResponse = await api.post<AuthResponse>(
            "api/v1/users/refresh-token",
            { refreshToken },
          );

          const nextAccessToken = refreshResponse.data.data.accessToken;
          if (!nextAccessToken) {
            throw new Error("Refresh token response missing access token");
          }

          await saveToken(nextAccessToken);
          if (refreshResponse.data.data.refreshToken) {
            await saveRefreshToken(refreshResponse.data.data.refreshToken);
          }

          return api(originalRequest);
        } catch (refreshError) {
          await clearAuthSession();
        }
      }
    }

    const customError = {
      message:
        (error.response?.data as any)?.message ||
        error.message ||
        "An unexpected error occurred",
      statusCode: error.response?.status || 500,
      success: false,
    };

    return Promise.reject(customError);
  },
);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const executeWithRetry = async <T>(
  requestFn: () => Promise<T>,
  attemptCount: number = 0,
): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    if (attemptCount < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS);
      return executeWithRetry(requestFn, attemptCount + 1);
    }
    throw error;
  }
};

export const apiGet = <T>(url: string, params?: object): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.get<T>(url, { params });
    return response.data;
  });
};

export const apiPost = <T>(url: string, body?: object): Promise<T> => {
  return executeWithRetry(async () => {
    const response = await api.post<T>(url, body);
    return response.data;
  });
};
