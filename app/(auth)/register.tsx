import { Button } from "@components/ui/Button";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import { useAuth } from "@features/auth/useAuth";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@utils/theme";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ValidationErrors = Partial<{
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}>;

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isLoading, error: apiError, clearError } = useAuth();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const validate = () => {
    const errors: ValidationErrors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();

    if (!validate()) {
      return;
    }

    const success = await register({ username, email, password });
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>MiniLMS</Text>
          <Text style={styles.subtitle}>Create your account.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.username ? styles.inputError : null,
              ]}
              placeholder="Choose a username"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setValidationErrors((current) => ({
                  ...current,
                  username: undefined,
                }));
                clearError();
              }}
            />
            {validationErrors.username ? (
              <Text style={styles.errorText}>{validationErrors.username}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.email ? styles.inputError : null,
              ]}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setValidationErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
                clearError();
              }}
            />
            {validationErrors.email ? (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.password ? styles.inputError : null,
              ]}
              placeholder="Create a password"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setValidationErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
                clearError();
              }}
            />
            {validationErrors.password ? (
              <Text style={styles.errorText}>{validationErrors.password}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                validationErrors.confirmPassword ? styles.inputError : null,
              ]}
              placeholder="Re-enter your password"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setValidationErrors((current) => ({
                  ...current,
                  confirmPassword: undefined,
                }));
                clearError();
              }}
            />
            {validationErrors.confirmPassword ? (
              <Text style={styles.errorText}>
                {validationErrors.confirmPassword}
              </Text>
            ) : null}
          </View>

          <Button
            label="Register"
            onPress={handleRegister}
            loading={isLoading}
          />

          {apiError ? (
            <ErrorBanner message={apiError} onDismiss={clearError} />
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity disabled={isLoading}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: { alignItems: "center", marginBottom: SPACING.xl },
  title: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md },
  formContainer: { width: "100%" },
  inputGroup: { marginBottom: SPACING.md },
  label: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.textPrimary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.error },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});
