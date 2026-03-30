import OfflineBanner from "@components/ui/OfflineBanner";
import Ionicons from "@expo/vector-icons/Ionicons";
import useNetworkStatus from "@hooks/useNetworkStatus";
import { COLORS, FONT_SIZE, FONT_WEIGHT } from "@utils/theme";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  const { isConnected } = useNetworkStatus();

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
            borderTopColor: COLORS.border,
          },
          tabBarLabelStyle: {
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.semibold,
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
