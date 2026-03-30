import Ionicons from "@expo/vector-icons/Ionicons";
import {
  COLORS,
  DIMENSIONS,
  FONT_SIZE,
  FONT_WEIGHT,
  SPACING,
} from "@utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={DIMENSIONS.emptyStateIcon}
        color={COLORS.primary}
      />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.actionContainer}>
          <Button label={actionLabel} onPress={onAction} variant="outline" />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
    marginTop: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.xs,
    maxWidth: DIMENSIONS.webViewMaxWidth,
  },
  actionContainer: {
    marginTop: SPACING.lg,
    width: "100%",
    maxWidth: DIMENSIONS.webViewMaxWidth,
  },
});
