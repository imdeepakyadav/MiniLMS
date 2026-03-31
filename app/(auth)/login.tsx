import { Button } from "@components/ui/Button";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getCurrentUser } from "@features/auth/authService";
import {
  authenticate,
  getBiometricType,
  isBiometricAvailable,
  isBiometricEnabled,
} from "@features/auth/biometricService";
import { useAuth } from "@features/auth/useAuth";
import { setItem } from "@services/storage";
import { useAuthStore } from "@store/authStore";
import { useTheme } from "@store/themeStore";
import { STORAGE_KEYS } from "@utils/constants";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { dispatch } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState("Biometric");
  const [biometricPromptVisible, setBiometricPromptVisible] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    let autoPromptTimer: ReturnType<typeof setTimeout> | null = null;

    const bootstrapBiometrics = async () => {
      const [available, enabled] = await Promise.all([
        isBiometricAvailable(),
        isBiometricEnabled(),
      ]);

      if (!isMounted || !available || !enabled) {
        return;
      }

      const type = await getBiometricType();
      if (!isMounted) {
        return;
      }

      setBiometricAvailable(true);
      setBiometricEnabled(true);
      setBiometricType(type);
      setBiometricPromptVisible(true);

      autoPromptTimer = setTimeout(() => {
        void handleBiometricLogin(type);
      }, 500);
    };

    void bootstrapBiometrics();

    return () => {
      isMounted = false;
      if (autoPromptTimer) {
        clearTimeout(autoPromptTimer);
      }
    };
  }, []);

  const handleBiometricLogin = async (reasonType?: string) => {
    const promptType = reasonType ?? biometricType;
    setBiometricLoading(true);
    setLocalError(null);
    clearError();
    setBiometricMessage(null);

    try {
      const success = await authenticate(`Sign in with ${promptType}`);
      if (!success) {
        return;
      }

      const user = await getCurrentUser();
      await setItem(STORAGE_KEYS.USER_DATA, user);
      dispatch({ type: "LOGIN", payload: user });
      router.replace("/(tabs)");
    } catch (error) {
      await Promise.resolve();
      setBiometricMessage("Session expired. Please login again.");
      setBiometricPromptVisible(false);
      setBiometricAvailable(false);
      setBiometricEnabled(false);
      Alert.alert("Session expired", "Session expired. Please login again.");
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleLogin = async () => {
    setLocalError(null);
    clearError();
    setBiometricMessage(null);

    if (!email.trim() || !password.trim()) {
      setLocalError("Please enter both email and password.");
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.replace("/(tabs)");
    }
  };

  const bannerMessage = biometricMessage ?? error ?? localError;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logoText}>MiniLMS</Text>
            <Text style={styles.subtitle}>Learn without friction.</Text>
          </View>

          <View style={styles.formContainer}>
            {biometricPromptVisible &&
            biometricAvailable &&
            biometricEnabled ? (
              <View style={styles.biometricCard}>
                <Ionicons
                  name={biometricType === "Face ID" ? "scan" : "finger-print"}
                  size={28}
                  color={colors.primary}
                  style={styles.biometricIcon}
                />
                <Text style={styles.biometricTitle}>
                  Sign in with {biometricType}
                </Text>
                <Text style={styles.biometricSubtitle}>
                  Use your saved session to get back in quickly.
                </Text>
                <Button
                  label={`Use ${biometricType}`}
                  onPress={() => {
                    void handleBiometricLogin();
                  }}
                  loading={biometricLoading}
                  variant="outline"
                />
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                  setLocalError(null);
                  setBiometricMessage(null);
                }}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                    setLocalError(null);
                    setBiometricMessage(null);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((current) => !current)}
                  style={styles.toggleBtn}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              label="Login"
              onPress={handleLogin}
              loading={isLoading}
              variant="primary"
            />

            {bannerMessage ? (
              <ErrorBanner
                message={bannerMessage}
                onDismiss={() => {
                  clearError();
                  setLocalError(null);
                }}
              />
            ) : null}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text style={styles.footerLink}>Register</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
    },
    header: { alignItems: "center", marginBottom: SPACING.xl },
    logoText: {
      color: colors.primary,
      fontSize: FONT_SIZE.xxl,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.xs,
    },
    subtitle: { color: colors.textSecondary, fontSize: FONT_SIZE.md },
    formContainer: { width: "100%" },
    biometricCard: {
      alignItems: "center",
      padding: SPACING.lg,
      borderRadius: RADIUS.lg,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    biometricIcon: {
      marginBottom: SPACING.sm,
    },
    biometricTitle: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.xs,
    },
    biometricSubtitle: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
      textAlign: "center",
      marginBottom: SPACING.md,
    },
    inputGroup: { marginBottom: SPACING.md },
    label: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.sm,
      marginBottom: SPACING.xs,
      fontWeight: FONT_WEIGHT.medium,
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZE.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    passwordInput: {
      flex: 1,
      color: colors.textPrimary,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZE.md,
    },
    toggleBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
    toggleText: {
      color: colors.primary,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.semibold,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: SPACING.lg,
    },
    footerText: { color: colors.textSecondary, fontSize: FONT_SIZE.sm },
    footerLink: {
      color: colors.primary,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.bold,
    },
  });
