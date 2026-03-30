import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuthStore } from '@store/authStore';
import { View, StyleSheet } from 'react-native';
import { Loader } from '@components/ui/Loader';
import { COLORS } from '@utils/theme';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
