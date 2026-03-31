import { saveRefreshToken, saveToken } from "@services/secureStorage";
import { getItem, setItem } from "@services/storage";
import { useAuthStore } from "@store/authStore";
import { STORAGE_KEYS } from "@utils/constants";
import { useState } from "react";
import { Alert } from "react-native";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../types/auth.types";
import * as authService from "./authService";
import {
  getBiometricType,
  isBiometricAvailable,
  isBiometricEnabled,
  setBiometricEnabled,
} from "./biometricService";

export const useAuth = () => {
  const { dispatch } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const maybePromptBiometricSetup = async () => {
    const [available, enabled, promptShown] = await Promise.all([
      isBiometricAvailable(),
      isBiometricEnabled(),
      getItem<boolean>(STORAGE_KEYS.BIOMETRIC_PROMPT_SHOWN),
    ]);

    if (!available || enabled || promptShown) {
      return;
    }

    const biometricType = await getBiometricType();
    await setItem(STORAGE_KEYS.BIOMETRIC_PROMPT_SHOWN, true);

    setTimeout(() => {
      Alert.alert(
        `Enable ${biometricType} for faster sign in next time?`,
        "You can turn this on now and skip password entry later.",
        [
          { text: "Not Now", style: "cancel" },
          {
            text: "Enable",
            onPress: () => {
              void setBiometricEnabled(true);
            },
          },
        ],
      );
    }, 1000);
  };

  const persistSession = async (response: AuthResponse) => {
    const { user, accessToken, refreshToken } = response.data;

    if (!accessToken) {
      throw new Error("Auth token was not returned by the server.");
    }

    await saveToken(accessToken);
    if (refreshToken) {
      await saveRefreshToken(refreshToken);
    }

    await setItem(STORAGE_KEYS.USER_DATA, user);
    dispatch({ type: "LOGIN", payload: user });
  };

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    clearError();
    try {
      const response = await authService.login(data);
      await persistSession(response);
      void maybePromptBiometricSetup();
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

      if (response.data.accessToken) {
        await persistSession(response);
      } else {
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password,
        });
        await persistSession(loginResponse);
      }

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
