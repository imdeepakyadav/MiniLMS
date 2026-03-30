import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@utils/theme';
import { Button } from '@components/ui/Button';
import { ErrorBanner } from '@components/ui/ErrorBanner';
import { useAuth } from '@features/auth/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login({ email, password });
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoText}>MiniLMS</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        <View style={styles.formContainer}>
           {(error || localError) && (
             <ErrorBanner 
               message={error || localError || ''} 
               onDismiss={() => { clearError(); setLocalError(null); }} 
             />
           )}
           
           <View style={styles.inputGroup}>
             <Text style={styles.label}>Email</Text>
             <TextInput
               style={styles.input}
               placeholder="Enter your email"
               placeholderTextColor={COLORS.textSecondary}
               keyboardType="email-address"
               autoCapitalize="none"
               value={email}
               onChangeText={(text) => { setEmail(text); clearError(); setLocalError(null); }}
             />
           </View>

           <View style={styles.inputGroup}>
             <Text style={styles.label}>Password</Text>
             <View style={styles.passwordContainer}>
               <TextInput
                 style={styles.passwordInput}
                 placeholder="Enter your password"
                 placeholderTextColor={COLORS.textSecondary}
                 secureTextEntry={!showPassword}
                 value={password}
                 onChangeText={(text) => { setPassword(text); clearError(); setLocalError(null); }}
               />
               <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleBtn}>
                 <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
               </TouchableOpacity>
             </View>
           </View>

           <Button 
             label="Login" 
             onPress={handleLogin} 
             loading={isLoading} 
             variant="primary" 
           />
           
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  logoText: { color: COLORS.primary, fontSize: 32, fontWeight: 'bold', marginBottom: SPACING.xs },
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
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  toggleBtn: { padding: SPACING.sm },
  toggleText: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.lg },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  footerLink: { color: COLORS.primary, fontSize: FONT_SIZE.sm, fontWeight: 'bold' }
});