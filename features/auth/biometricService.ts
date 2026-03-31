import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@utils/constants";
import * as LocalAuthentication from "expo-local-authentication";

const getAuthenticationTypes = async (): Promise<number[]> => {
  try {
    return await LocalAuthentication.supportedAuthenticationTypesAsync();
  } catch {
    return [];
  }
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);

    return hasHardware && isEnrolled;
  } catch {
    return false;
  }
};

export const getBiometricType = async (): Promise<string> => {
  const authenticationTypes = await getAuthenticationTypes();
  const authType = LocalAuthentication.AuthenticationType as
    | {
        FACIAL_RECOGNITION?: number;
        FINGERPRINT?: number;
      }
    | undefined;

  if (authenticationTypes.includes(authType?.FACIAL_RECOGNITION ?? -1)) {
    return "Face ID";
  }

  if (authenticationTypes.includes(authType?.FINGERPRINT ?? -1)) {
    return "Fingerprint";
  }

  return "Biometric";
};

export const authenticate = async (reason: string): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason,
      fallbackLabel: "Use Password",
      disableDeviceFallback: false,
    });

    return result.success;
  } catch {
    return false;
  }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    return (
      (await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED)) === "true"
    );
  } catch {
    return false;
  }
};

export const setBiometricEnabled = async (value: boolean): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, String(value));
};
