import { COLORS } from "@utils/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface LoaderProps {
  size?: "small" | "large";
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "large",
  color = COLORS.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
