import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(\Error saving item for key: \\, error);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(\Error getting item for key: \\, error);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(\Error removing item for key: \\, error);
  }
};

