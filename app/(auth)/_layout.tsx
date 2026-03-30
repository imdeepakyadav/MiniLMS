import { Loader } from "@components/ui/Loader";
import { useAuthStore } from "@store/authStore";
import { COLORS } from "@utils/theme";
import { Redirect, Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingInner}>
          <Loader color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
