import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { StreakData } from "../../types/course.types";

interface StatsSummaryProps {
  enrolledCount: number;
  totalLessonsCompleted: number;
  streakData: StreakData;
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  const { colors } = useTheme();
  const styles = createCardStyles(colors);

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  enrolledCount,
  totalLessonsCompleted,
  streakData,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        <StatCard icon="📚" value={enrolledCount} label="Enrolled" />
        <StatCard
          icon="✅"
          value={totalLessonsCompleted}
          label="Lessons Done"
        />
        <StatCard
          icon="🔥"
          value={streakData.currentStreak}
          label="Day Streak"
        />
        <StatCard
          icon="📅"
          value={streakData.totalActiveDays}
          label="Active Days"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
});

const createCardStyles = (colors: AppTheme) =>
  StyleSheet.create({
    card: {
      width: 100,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      fontSize: 24,
      marginBottom: SPACING.xs,
    },
    value: {
      color: colors.primary,
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.bold,
    },
    label: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      textAlign: "center",
      marginTop: 2,
    },
  });
