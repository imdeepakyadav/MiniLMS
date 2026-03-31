import { useTheme } from "@store/themeStore";
import React from "react";
import { StyleSheet, View } from "react-native";

export const AnalyticsDivider: React.FC = () => {
  const { colors } = useTheme();

  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 24,
  },
});
