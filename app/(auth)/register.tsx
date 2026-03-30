import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@utils/theme';
import { Button } from '@components/ui/Button';
import { ErrorBanner } from '@components/ui/ErrorBanner';
import { useAuth } from '@features/auth/useAuth';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error: apiError, clearError } = useAuth();
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!username.trim()) errors.username = 'Username is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
       errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
       errors.email = 'Invalid email format';
    }

    if (!password) {
       errors.password = 'Password is required';
    } else if (password.length < 8) {
       errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
       errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    clearError();
    if (!validate()) return;

    const success = await register({ username, email, password });
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join MiniLMS today</Text>
        </View>

        <View style={styles.formContainer}>
          {apiError && <ErrorBanner message={apiError} onDismiss={clearError} />}

          <View style={styles.inputGroup}>
             <Text style={styles.label}>Username</Text>
             <TextInput
               style={[styles.input, validationErrors.username && styles.inputError]}
               placeholder="Choose a username"
               placeholderTextColor={COLORS.textSecondary}
               value={username}
               onChangeText={text => { setUsername(text); setValidationErrors(prev => ({...prev, username: ''})); clearError(); }}
             />
             {validationErrors.username && <Text style={styles.errorText}>{validationErrors.username}</Text>}
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.label}>Email</Text>
             <TextInput
               style={[styles.input, validationErrors.email && styles.inputError]}
               placeholder="Enter your email"
               placeholderTextColor={COLORS.textSecondary}
               keyboardType="email-address"
               autoCapitalize="none"
               value={email}
               onChangeText={text => { setEmail(text); setValidationErrors(prev => ({...prev, email: ''})); clearError(); }}
             />
             {validationErrors.email && <Text style={styles.errorText}>{validationErrors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.label}>Password</Text>
             <TextInput
               style={[styles.input, validationErrors.password && styles.inputError]}
               placeholder="Create a password"
               placeholderTextColor={COLORS.textSecondary}
               secureTextEntry
               value={password}
               onChangeText={text => { setPassword(text); setValidationErrors(prev => ({...prev, password: ''})); clearError(); }}
             />
             {validationErrors.password && <Text style={styles.errorText}>{validationErrors.password}</Text>}
          </View>

          <View style={styles.inputGroup}>
             <Text style={styles.label}>Confirm Password</Text>
             <TextInput
               style={[styles.input, validationErrors.confirmPassword && styles.inputError]}
               placeholder="Verify your password"
               placeholderTextColor={COLORS.textSecondary}
               secureTextEntry
               value={confirmPassword}
               onChangeText={text => { setConfirmPassword(text); setValidationErrors(prev => ({...prev, confirmPassword: ''})); clearError(); }}
             />
             {validationErrors.confirmPassword && <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>}
          </View>

          <Button label="Register" onPress={handleRegister} loading={isLoading} />

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
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  title: { color: COLORS.primary, fontSize: 32, fontWeight: 'bold', marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONT_SIZE.md },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: SPACING.md },
  label: { color: COLORS.textPrimary, fontSize: FONT_SIZE.sm, marginBottom: SPACING.xs, fontWeight: '500' },
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
  errorText: { color: COLORS.error, fontSize: FONT_SIZE.xs, marginTop: 4 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.lg },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  footerLink: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: 'bold' }
});