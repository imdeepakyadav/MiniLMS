import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "@utils/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={10}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: SPACING.sm,
    width: "100%",
  },
  text: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.sm,
    flex: 1,
    marginRight: SPACING.sm,
  },
  closeBtn: { padding: 2 },
});
