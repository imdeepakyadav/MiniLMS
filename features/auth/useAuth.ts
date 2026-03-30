import { saveToken } from "@services/secureStorage";
import { setItem } from "@services/storage";
import { useAuthStore } from "@store/authStore";
import { STORAGE_KEYS } from "@utils/constants";
import { useState } from "react";
import { LoginRequest, RegisterRequest, User } from "../../types/auth.types";
import * as authService from "./authService";

export const useAuth = () => {
  const { dispatch } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const persistSession = async (accessToken: string, user: User) => {
    await saveToken(accessToken);
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
