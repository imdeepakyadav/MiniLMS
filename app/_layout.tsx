import { AuthProvider } from "@store/authStore";
import { CourseStoreProvider } from "@store/courseStore";
import { COLORS } from "@utils/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: COLORS.background }}>
      <AuthProvider>
        <CourseStoreProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </CourseStoreProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
