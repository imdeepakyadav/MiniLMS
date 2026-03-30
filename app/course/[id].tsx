import { Button } from "@components/ui/Button";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import { Loader } from "@components/ui/Loader";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { useCourseStore } from "@store/courseStore";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@utils/theme";
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

export default function CourseDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { courses, isLoading, error, refetch } = useCourses();
  const { enrolledCourses, dispatch } = useCourseStore();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    if (!courses.length) {
      void refetch();
    }
  }, [courses.length, refetch]);

  const course = courses.find((item) => item.id === courseId);
  const isEnrolled = courseId ? enrolledCourses.includes(courseId) : false;

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
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Course Detail",
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.textPrimary,
          }}
        />
        {error ? <ErrorBanner message={error} onDismiss={refetch} /> : null}
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Course not found</Text>
          <Button
            label="Go Back"
            onPress={() => router.back()}
            variant="outline"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.textPrimary,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerAction}
            >
              <Text style={styles.headerActionText}>←</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleBookmark(course.id)}
              style={styles.headerAction}
            >
              <Text style={styles.headerActionText}>
                {isBookmarked(course.id) ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAction: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  headerActionText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  thumbnail: {
    width: "100%",
    height: 220,
    backgroundColor: COLORS.surface,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  title: {
    color: COLORS.textPrimary,
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
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  instructorName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  instructorLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  priceBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.md,
  },
  priceText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  enrollButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  enrolledButton: {
    backgroundColor: COLORS.accent,
  },
  enrollButtonText: {
    color: COLORS.textPrimary,
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
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
});
