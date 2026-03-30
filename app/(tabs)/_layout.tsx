import OfflineBanner from "@components/ui/OfflineBanner";
import Ionicons from "@expo/vector-icons/Ionicons";
import useNetworkStatus from "@hooks/useNetworkStatus";
import { useCourseStore } from "@store/courseStore";
import { COLORS, DIMENSIONS, FONT_SIZE, FONT_WEIGHT } from "@utils/theme";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  const { isConnected } = useNetworkStatus();
  const { bookmarks } = useCourseStore();

  return (
    <View style={{ flex: 1 }}>
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
