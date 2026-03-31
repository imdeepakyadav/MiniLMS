import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StreakData } from "../../types/course.types";

interface StreakCardProps {
  streakData: StreakData;
  onPress: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  streakData,
  onPress,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors, streakData.currentStreak >= 7);

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View style={styles.cardOuter}>
        <View style={styles.overlay} />
        <View style={styles.cardInner}>
          <View style={styles.leftSection}>
            <Text
              style={[
                styles.flame,
                streakData.currentStreak === 0 ? styles.flameMuted : null,
              ]}
            >
              🔥
            </Text>
            <Text style={styles.currentStreak}>{streakData.currentStreak}</Text>
            <Text style={styles.dayLabel}>day streak</Text>
            {streakData.currentStreak === 0 ? (
              <Text style={styles.startPrompt}>Start your streak today!</Text>
            ) : null}
          </View>

          <View style={styles.rightSection}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>🏆 Longest</Text>
              <Text style={styles.metricValue}>{streakData.longestStreak}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>📅 Total days</Text>
              <Text style={styles.metricValue}>
                {streakData.totalActiveDays}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = (colors: AppTheme, hasGoldBorder: boolean) =>
  StyleSheet.create({
    pressable: {
      marginBottom: SPACING.md,
    },
    cardOuter: {
      borderRadius: RADIUS.lg,
      overflow: "hidden",
      borderWidth: hasGoldBorder ? 1.5 : 0,
      borderColor: hasGoldBorder ? "#F59E0B" : "transparent",
      backgroundColor: colors.surface,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.primary,
      opacity: 0.05,
    },
    cardInner: {
      flexDirection: "row",
      padding: SPACING.lg,
      backgroundColor: colors.surface,
    },
    leftSection: {
      flex: 1,
      paddingRight: SPACING.lg,
      alignItems: "flex-start",
    },
    flame: {
      fontSize: 36,
      marginBottom: SPACING.xs,
    },
    flameMuted: {
      opacity: 0.4,
    },
    currentStreak: {
      color: colors.primary,
      fontSize: 28,
      fontWeight: FONT_WEIGHT.bold,
    },
    dayLabel: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginTop: 2,
    },
    startPrompt: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
      marginTop: SPACING.sm,
    },
    rightSection: {
      justifyContent: "center",
      gap: SPACING.sm,
    },
    metricRow: {
      alignItems: "flex-end",
    },
    metricLabel: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginBottom: 2,
    },
    metricValue: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
    },
  });
