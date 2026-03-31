import { EmptyState } from "@components/ui/EmptyState";
import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Course, CourseProgress } from "../../types/course.types";

interface CourseProgressListProps {
  courses: Course[];
  progress: Record<string, CourseProgress>;
}

interface ProgressRowProps {
  course: Course;
  courseProgress: CourseProgress | undefined;
}

const ProgressRow: React.FC<ProgressRowProps> = ({
  course,
  courseProgress,
}) => {
  const { colors } = useTheme();
  const styles = createRowStyles(colors);
  const percentage = courseProgress?.percentage ?? 0;
  const completedLessons = courseProgress?.completedLessons.length ?? 0;
  const percentageColor =
    percentage === 100
      ? colors.accent
      : percentage > 0
        ? colors.primary
        : colors.textSecondary;

  return (
    <View style={styles.row}>
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      <View style={styles.middle}>
        <Text style={styles.title} numberOfLines={1}>
          {course.title}
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.detailText}>
          {completedLessons}/5 lessons · {percentage}%
        </Text>
      </View>
      <Text style={[styles.percentage, { color: percentageColor }]}>
        {percentage}%
      </Text>
    </View>
  );
};

export const CourseProgressList: React.FC<CourseProgressListProps> = ({
  courses,
  progress,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const progressRows = useMemo(() => {
    return courses
      .filter((course) => course.isEnrolled || Boolean(progress[course.id]))
      .map((course) => ({
        course,
        courseProgress: progress[course.id],
      }))
      .sort((left, right) => {
        const leftPercentage = left.courseProgress?.percentage ?? 0;
        const rightPercentage = right.courseProgress?.percentage ?? 0;

        if (leftPercentage === 100 && rightPercentage !== 100) {
          return -1;
        }

        if (rightPercentage === 100 && leftPercentage !== 100) {
          return 1;
        }

        return rightPercentage - leftPercentage;
      });
  }, [courses, progress]);

  if (progressRows.length === 0) {
    return (
      <View>
        <Text style={styles.title}>Course Progress</Text>
        <EmptyState
          icon="book-outline"
          title="Start a course to track progress"
          subtitle="Your lesson history will appear here once you begin learning."
        />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Course Progress</Text>
      <View style={styles.list}>
        {progressRows.map(({ course, courseProgress }) => (
          <ProgressRow
            key={course.id}
            course={course}
            courseProgress={courseProgress}
          />
        ))}
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
      marginBottom: SPACING.md,
    },
    list: {
      gap: SPACING.sm,
    },
  });

const createRowStyles = (colors: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.sm,
    },
    thumbnail: {
      width: 40,
      height: 40,
      borderRadius: RADIUS.sm,
      backgroundColor: colors.border,
      marginRight: SPACING.sm,
    },
    middle: {
      flex: 1,
      marginRight: SPACING.sm,
    },
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: 6,
    },
    track: {
      height: 6,
      borderRadius: RADIUS.full,
      backgroundColor: colors.border,
      overflow: "hidden",
    },
    fill: {
      height: 6,
      borderRadius: RADIUS.full,
      backgroundColor: colors.accent,
    },
    detailText: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginTop: 4,
    },
    percentage: {
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
    },
  });
