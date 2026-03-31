import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, RADIUS, SPACING } from "@utils/theme";
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
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity
          onPress={onDismiss}
          hitSlop={10}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={18} color={colors.onPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      backgroundColor: colors.error,
      padding: SPACING.md,
      borderRadius: RADIUS.md,
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: SPACING.sm,
      width: "100%",
    },
    text: {
      color: colors.onPrimary,
      fontSize: FONT_SIZE.sm,
      flex: 1,
      marginRight: SPACING.sm,
    },
    closeBtn: { padding: 2 },
  });
