import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";
import { getToken, removeToken } from "./secureStorage";
import { removeItem } from "./storage";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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
    if (error.response?.status === 401) {
      await removeToken();
      await removeItem(STORAGE_KEYS.USER_DATA);
      router.replace("/(auth)/login");
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
