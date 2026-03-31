import * as SecureStore from "expo-secure-store";
import { SECURE_KEYS } from "../utils/constants";

export const saveToken = async (token: string): Promise<void> => {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Invalid auth token");
  }

  try {
    await SecureStore.setItemAsync(SECURE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error("Error saving authToken", error);
  }
};

export const saveRefreshToken = async (token: string): Promise<void> => {
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Invalid refresh token");
  }

  try {
    await SecureStore.setItemAsync(SECURE_KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error("Error saving refreshToken", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error getting authToken", error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Error getting refreshToken", error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error("Error removing authToken", error);
  }
};

export const removeRefreshToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Error removing refreshToken", error);
  }
};
