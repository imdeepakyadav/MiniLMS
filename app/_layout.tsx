import { ErrorBoundary } from "@components/ErrorBoundary";
import notificationService from "@features/notifications/notificationService";
import { getItem, setItem } from "@services/storage";
import { AuthProvider } from "@store/authStore";
import { CourseStoreProvider } from "@store/courseStore";
import { STORAGE_KEYS } from "@utils/constants";
import { COLORS } from "@utils/theme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    const bootstrapNotifications = async () => {
      try {
        const permissionGranted =
          await notificationService.requestPermissions();
        const lastOpenTimestamp = await getItem<number>(
          STORAGE_KEYS.LAST_OPEN_TIMESTAMP,
        );

        if (
          permissionGranted &&
          lastOpenTimestamp &&
          Date.now() - lastOpenTimestamp > 86400000
        ) {
          await notificationService.scheduleReEngagementNotification();
        }

        await setItem(STORAGE_KEYS.LAST_OPEN_TIMESTAMP, Date.now());
      } catch (error) {
        console.error("Notification bootstrap failed", error);
      }
    };

    void bootstrapNotifications();
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: COLORS.background }}>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
