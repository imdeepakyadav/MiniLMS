import { CourseProgressList } from "@components/analytics/CourseProgressList";
import { StatsSummary } from "@components/analytics/StatsSummary";
import { WeeklyChart } from "@components/analytics/WeeklyChart";
import { BadgeGrid } from "@components/streak/BadgeGrid";
import { Loader } from "@components/ui/Loader";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getActivityLog } from "@features/streak/streakService";
import { useStreak } from "@features/streak/useStreak";
import { useCourseStore } from "@store/courseStore";
import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import { Stack } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityLog } from "../types/course.types";

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { streakData, badges, isLoading: streakLoading } = useStreak();
  const { courses, progress, enrolledCourses } = useCourseStore();
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hydrateActivityLog = useCallback(async () => {
    const nextActivityLog = await getActivityLog();
    setActivityLog(nextActivityLog);
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        await hydrateActivityLog();
      } finally {
        setActivityLoading(false);
      }
    };

    void loadAnalytics();
  }, [hydrateActivityLog]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await hydrateActivityLog();
    } finally {
      setIsRefreshing(false);
    }
  }, [hydrateActivityLog]);

  const totalLessonsCompleted = useMemo(() => {
    return Object.values(progress).reduce(
      (total, courseProgress) => total + courseProgress.completedLessons.length,
      0,
    );
  }, [progress]);

  const unlockedBadges = useMemo(() => {
    return badges.filter((badge) => badge.unlockedAt !== null).length;
  }, [badges]);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  if (streakLoading || activityLoading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.loadingInner}>
          <Loader />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Analytics",
          headerTintColor: colors.textPrimary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconWrap}>
              <Ionicons
                name="analytics-outline"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>Learning dashboard</Text>
              <Text style={styles.heroTitle}>Your progress at a glance</Text>
            </View>
          </View>

          <Text style={styles.heroDescription}>
            Review streaks, weekly activity, course progress, and unlocked
            achievements in one place.
          </Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.metaChip}>
              <Ionicons
                name="today-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={styles.metaChipText}>{todayLabel}</Text>
            </View>
            {streakData.currentStreak > 0 ? (
              <View style={[styles.metaChip, styles.metaChipAccent]}>
                <Ionicons
                  name="flame-outline"
                  size={14}
                  color={colors.onPrimary}
                />
                <Text style={[styles.metaChipText, styles.metaChipTextAccent]}>
                  {streakData.currentStreak} day streak
                </Text>
              </View>
            ) : (
              <View style={styles.metaChip}>
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={styles.metaChipText}>
                  Build a new streak today
                </Text>
              </View>
            )}
          </View>

          <View style={styles.heroMetricsRow}>
            <MetricCard
              icon="book-outline"
              label="Enrolled"
              value={enrolledCourses.length}
            />
            <MetricCard
              icon="checkmark-done-outline"
              label="Lessons"
              value={totalLessonsCompleted}
            />
            <MetricCard
              icon="trophy-outline"
              label="Badges"
              value={unlockedBadges}
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Snapshot</Text>
            <Text style={styles.sectionDescription}>
              A compact view of your current learning state.
            </Text>
          </View>
          <StatsSummary
            enrolledCount={enrolledCourses.length}
            totalLessonsCompleted={totalLessonsCompleted}
            streakData={streakData}
          />
        </View>

        <View style={styles.sectionCard}>
          <WeeklyChart activityLog={activityLog} />
        </View>

        <View style={styles.sectionCard}>
          <CourseProgressList courses={courses} progress={progress} />
        </View>

        <View style={styles.sectionCard}>
          <BadgeGrid badges={badges} />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

interface MetricCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
}

function MetricCard({ icon, label, value }: MetricCardProps) {
  const { colors } = useTheme();
  const styles = createMetricStyles(colors);

  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingInner: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    heroCard: {
      overflow: "hidden",
      borderRadius: RADIUS.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
    },
    heroGlow: {
      position: "absolute",
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: 140,
      backgroundColor: colors.primary,
      opacity: 0.08,
    },
    heroTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: SPACING.md,
    },
    heroIconWrap: {
      width: 48,
      height: 48,
      borderRadius: RADIUS.full,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
    },
    heroCopy: {
      flex: 1,
    },
    heroEyebrow: {
      color: colors.primary,
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.bold,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 2,
    },
    heroTitle: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.xxl,
      fontWeight: FONT_WEIGHT.bold,
      lineHeight: 34,
    },
    heroDescription: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
      lineHeight: 20,
      marginTop: SPACING.md,
    },
    heroMetaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surfaceElevated,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 6,
    },
    metaChipAccent: {
      backgroundColor: colors.primary,
    },
    metaChipText: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.semibold,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      marginBottom: SPACING.md,
    },
    sectionLabel: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
    },
    sectionDescription: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
      marginTop: SPACING.xs,
    },
    metaChipTextAccent: {
      color: colors.onPrimary,
    },
    heroMetricsRow: {
      flexDirection: "row",
      gap: SPACING.sm,
      marginTop: SPACING.lg,
    },
    bottomSpacing: {
      height: SPACING.xl,
    },
  });

const createMetricStyles = (colors: AppTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
      borderRadius: RADIUS.md,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.sm,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 88,
    },
    value: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
      marginTop: 6,
    },
    label: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.medium,
      marginTop: 2,
    },
  });
