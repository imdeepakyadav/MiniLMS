import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, RADIUS, SPACING } from "@utils/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  tone?: "default" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  tone = "default",
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const getContainerStyle = () => {
    switch (variant) {
      case "outline":
        return [
          styles.container,
          tone === "danger"
            ? styles.dangerOutlineContainer
            : styles.outlineContainer,
        ];
      case "ghost":
        return [
          styles.container,
          tone === "danger"
            ? styles.dangerGhostContainer
            : styles.ghostContainer,
        ];
      default:
        return [styles.container, styles.primaryContainer];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return [
          styles.text,
          tone === "danger" ? styles.dangerText : styles.outlineText,
        ];
      case "ghost":
        return [
          styles.text,
          tone === "danger" ? styles.dangerText : styles.ghostText,
        ];
      default:
        return [styles.text, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.onPrimary : colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      paddingVertical: SPACING.md,
      borderRadius: RADIUS.md,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: SPACING.sm,
    },
    primaryContainer: { backgroundColor: colors.primary },
    outlineContainer: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
    },
    dangerOutlineContainer: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.error,
    },
    ghostContainer: { backgroundColor: "transparent" },
    dangerGhostContainer: { backgroundColor: "transparent" },
    disabled: { opacity: 0.5 },
    text: { fontSize: FONT_SIZE.md, fontWeight: "600" },
    primaryText: { color: colors.onPrimary },
    outlineText: { color: colors.primary },
    ghostText: { color: colors.primary },
    dangerText: { color: colors.error },
  });
