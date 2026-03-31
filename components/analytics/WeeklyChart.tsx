import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, FONT_WEIGHT, SPACING } from "@utils/theme";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { ActivityLog } from "../../types/course.types";

interface WeeklyChartProps {
  activityLog: ActivityLog[];
}

type ChartBar = {
  day: string;
  value: number;
  isToday: boolean;
};

const getDateString = (date: Date): string =>
  date.toISOString().split("T")[0] ?? "";

const getDayLabel = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ activityLog }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const animatedValues = useRef<Animated.Value[]>(
    Array.from({ length: 7 }, () => new Animated.Value(0)),
  ).current;

  const bars = useMemo<ChartBar[]>(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date;
    });

    return days.map((date) => {
      const dateString = getDateString(date);
      const entry = activityLog.find((item) => item.date === dateString);
      return {
        day: getDayLabel(date),
        value: entry?.lessonsCompleted ?? 0,
        isToday: dateString === getDateString(new Date()),
      };
    });
  }, [activityLog]);

  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);

  useEffect(() => {
    animatedValues.forEach((value, index) => {
      value.setValue(0);
      Animated.timing(value, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        delay: index * 80,
        useNativeDriver: false,
      }).start();
    });
  }, [animatedValues, bars]);

  return (
    <View>
      <Text style={styles.title}>This Week</Text>
      <Text style={styles.subtitle}>Lessons completed per day</Text>
      <View style={styles.chartRow}>
        {bars.map((bar, index) => {
          const targetHeight = bar.value > 0 ? (bar.value / maxValue) * 100 : 4;
          const heightInterpolation = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, targetHeight],
          });
          const barColor =
            bar.value > 0
              ? bar.isToday
                ? colors.accent
                : colors.primary
              : "transparent";

          return (
            <View key={`${bar.day}-${index}`} style={styles.barColumn}>
              <Text style={styles.valueLabel}>
                {bar.value > 0 ? String(bar.value) : ""}
              </Text>
              <View style={styles.barTrack}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: heightInterpolation,
                      backgroundColor: barColor,
                      borderColor: bar.value > 0 ? barColor : colors.border,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{bar.day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginBottom: SPACING.md,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 120,
      gap: SPACING.sm,
    },
    barColumn: {
      alignItems: "center",
      justifyContent: "flex-end",
      flex: 1,
    },
    valueLabel: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      minHeight: 16,
      marginBottom: 4,
      textAlign: "center",
    },
    barTrack: {
      width: 32,
      height: 100,
      justifyContent: "flex-end",
    },
    bar: {
      width: 32,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
      borderWidth: 1,
    },
    dayLabel: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginTop: 6,
    },
  });
