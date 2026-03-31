import { useTheme } from "@store/themeStore";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function Component() {
  const { colors } = useTheme();

  return <View style={[styles.card, { backgroundColor: colors.surface }]} />;
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
  },
});
