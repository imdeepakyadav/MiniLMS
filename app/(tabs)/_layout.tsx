import { COLORS, FONT_SIZE, FONT_WEIGHT } from "@utils/theme";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

const TabIcon = ({ label }: { label: string }) => (
  <Text
    style={{
      color: COLORS.primary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
    }}
  >
    {label}
  </Text>
);

export default function TabsLayout() {
  return (
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
          tabBarIcon: () => <TabIcon label="⌂" />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarIcon: () => <TabIcon label="★" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <TabIcon label="☺" />,
        }}
      />
    </Tabs>
  );
}
