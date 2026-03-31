import { ErrorBoundary } from "@components/ErrorBoundary";
import notificationService from "@features/notifications/notificationService";
import { useStreak } from "@features/streak/useStreak";
import { getItem, setItem } from "@services/storage";
import { AuthProvider } from "@store/authStore";
import { CourseStoreProvider } from "@store/courseStore";
import { ThemeProvider, useTheme } from "@store/themeStore";
import { STORAGE_KEYS } from "@utils/constants";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootShell />
    </ThemeProvider>
  );
}

function RootShell() {
  const { colors, mode } = useTheme();
  const { recordActivity, isLoading: streakLoading } = useStreak();
  const hasUpdatedStreak = useRef(false);

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

  useEffect(() => {
    if (streakLoading || hasUpdatedStreak.current) {
      return;
    }

    hasUpdatedStreak.current = true;

    const updateStreakForAppOpen = async () => {
      try {
        const streakData = await recordActivity("course");
        if (streakData.currentStreak > 0) {
          await notificationService.cancelAllScheduledNotifications();
          await notificationService.scheduleStreakRecoveryNotification();
        }
      } catch (error) {
        console.error("Failed to update streak", error);
      }
    };

    void updateStreakForAppOpen();
  }, [recordActivity, streakLoading]);

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <ErrorBoundary>
        <AuthProvider>
          <CourseStoreProvider>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
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
