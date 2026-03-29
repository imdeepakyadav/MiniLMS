import * as SecureStore from 'expo-secure-store';
import { SECURE_KEYS } from '../utils/constants';

export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(SECURE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving authToken', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting authToken', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SECURE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error removing authToken', error);
  }
};

