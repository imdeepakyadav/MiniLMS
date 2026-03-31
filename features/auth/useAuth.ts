import { saveToken } from "@services/secureStorage";
import { setItem } from "@services/storage";
import { useAuthStore } from "@store/authStore";
import { STORAGE_KEYS } from "@utils/constants";
import { useState } from "react";
import { LoginRequest, RegisterRequest, User } from "../../types/auth.types";
import * as authService from "./authService";

const resolveAccessToken = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value.trim() ? value : null;
  }

  if (value && typeof value === "object") {
    const tokenLikeValue = value as {
      accessToken?: unknown;
      token?: unknown;
      data?: unknown;
    };

    return (
      resolveAccessToken(tokenLikeValue.accessToken) ??
      resolveAccessToken(tokenLikeValue.token) ??
      resolveAccessToken(tokenLikeValue.data)
    );
  }

  return null;
};

export const useAuth = () => {
  const { dispatch } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const persistSession = async (accessToken: unknown, user: User) => {
    const resolvedToken = resolveAccessToken(accessToken);

    if (!resolvedToken) {
      throw new Error("Authentication token missing from response");
    }

    await saveToken(resolvedToken);
    await setItem(STORAGE_KEYS.USER_DATA, user);
    dispatch({ type: "LOGIN", payload: user });
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await authService.login(data);
      await persistSession(response.data.accessToken, response.data.user);
      return true;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await authService.register(data);
      await persistSession(response.data.accessToken, response.data.user);
      return true;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    clearError();
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      dispatch({ type: "LOGOUT" });
      setIsLoading(false);
    }
  };

  return { login, register, logout, isLoading, error, clearError };
};
