import { Button } from "@components/ui/Button";
import { EmptyState } from "@components/ui/EmptyState";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import { Loader } from "@components/ui/Loader";
import { ProgressRing } from "@components/ui/ProgressRing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { useCourseStore } from "@store/courseStore";
import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  DIMENSIONS,
  FONT_SIZE,
  FONT_WEIGHT,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from "@utils/theme";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseDetailsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const params = useLocalSearchParams<{ id?: string }>();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { courses, isLoading, error, refetch } = useCourses();
  const { enrolledCourses, progress, dispatch } = useCourseStore();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    if (!courses.length) {
      void refetch();
    }
  }, [courses.length, refetch]);

  const course = courses.find((item) => item.id === courseId);
  const isEnrolled = courseId ? enrolledCourses.includes(courseId) : false;
  const courseProgress = courseId ? progress[courseId] : undefined;

  const handleEnroll = () => {
    if (!courseId || isEnrolled) {
      return;
    }

    dispatch({ type: "ENROLL_COURSE", payload: courseId });
  };

  if (isLoading && !course) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  if (!course) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Course Detail",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.textPrimary,
          }}
        />
        {error ? <ErrorBanner message={error} onDismiss={refetch} /> : null}
        <EmptyState
          icon="alert-circle-outline"
          title="Course not found"
          subtitle={error ?? "We could not find that course."}
          actionLabel={error ? "Retry" : "Go back"}
          onAction={error ? refetch : () => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerAction}
            >
              <Ionicons
                name="arrow-back"
                size={ICON_SIZE.md}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleBookmark(course.id)}
              style={styles.headerAction}
            >
              <Ionicons
                name={isBookmarked(course.id) ? "star" : "star-outline"}
                size={ICON_SIZE.md}
                color={colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

        <View style={styles.progressBlock}>
          <ProgressRing
            percentage={courseProgress?.percentage ?? 0}
            size={104}
            strokeWidth={10}
            color={colors.accent}
          />
          <Text style={styles.progressText}>
            {courseProgress?.completedLessons.length ?? 0} of 5 lessons
            completed
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.instructorRow}>
            <Image
              source={{ uri: course.instructorAvatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.instructorName}>{course.instructorName}</Text>
              <Text style={styles.instructorLabel}>Instructor</Text>
            </View>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${course.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.description}>{course.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          disabled={isEnrolled}
          onPress={handleEnroll}
          style={[
            styles.enrollButton,
            isEnrolled ? styles.enrolledButton : null,
          ]}
        >
          <Text style={styles.enrollButtonText}>
            {isEnrolled ? "Enrolled ✓" : "Enroll Now"}
          </Text>
        </TouchableOpacity>

        <Button
          label="View Course Content"
          onPress={() => router.push(`/webview/${course.id}`)}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loaderContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    headerAction: {
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
    },
    headerActionText: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
    },
    scrollContent: {
      paddingBottom: DIMENSIONS.detailFooterOffset,
    },
    thumbnail: {
      width: "100%",
      height: DIMENSIONS.courseThumbnailHeight,
      backgroundColor: colors.surface,
    },
    progressBlock: {
      alignItems: "center",
      paddingTop: SPACING.lg,
    },
    progressText: {
      marginTop: SPACING.sm,
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
    },
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.md,
    },
    instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    avatar: {
      width: DIMENSIONS.courseDetailAvatar,
      height: DIMENSIONS.courseDetailAvatar,
      borderRadius: RADIUS.full,
      backgroundColor: colors.border,
      marginRight: SPACING.sm,
    },
    instructorName: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.semibold,
    },
    instructorLabel: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
    },
    priceBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.accent,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: RADIUS.full,
      marginBottom: SPACING.md,
    },
    priceText: {
      color: colors.background,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.bold,
    },
    description: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.md,
      lineHeight: 24,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.background,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.sm,
      paddingBottom: SPACING.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    enrollButton: {
      backgroundColor: colors.primary,
      borderRadius: RADIUS.md,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: SPACING.md,
      marginBottom: SPACING.sm,
    },
    enrolledButton: {
      backgroundColor: colors.accent,
    },
    enrollButtonText: {
      color: colors.onPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: SPACING.lg,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.md,
    },
  });
