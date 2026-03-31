import { Loader } from "@components/ui/Loader";
import OfflineBanner from "@components/ui/OfflineBanner";
import Ionicons from "@expo/vector-icons/Ionicons";
import useNetworkStatus from "@hooks/useNetworkStatus";
import { useAuthStore } from "@store/authStore";
import { useCourseStore } from "@store/courseStore";
import { COLORS, DIMENSIONS, FONT_SIZE, FONT_WEIGHT } from "@utils/theme";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isConnected } = useNetworkStatus();
  const { bookmarks } = useCourseStore();

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.loadingInner}>
          <Loader color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <OfflineBanner isConnected={isConnected} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: DIMENSIONS.tabBarHeight,
          },
          tabBarLabelStyle: {
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.semibold,
          },
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.onPrimary,
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.bold,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmarks"
          options={{
            title: "Bookmarks",
            tabBarBadge: bookmarks.length > 0 ? bookmarks.length : undefined,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
