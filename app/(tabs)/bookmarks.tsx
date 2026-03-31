import { CourseCard } from "@components/course/CourseCard";
import { EmptyState } from "@components/ui/EmptyState";
import { SkeletonCard } from "@components/ui/SkeletonCard";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { LegendList } from "@legendapp/list";
import { useCourseStore } from "@store/courseStore";
import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, FONT_WEIGHT, SPACING } from "@utils/theme";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarksScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { bookmarkedCourses, toggleBookmark } = useBookmarks();
  const { isLoading, refetch } = useCourses();
  const { courses } = useCourseStore();
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? 2 : 1;

  useEffect(() => {
    if (!courses.length) {
      void refetch();
    }
  }, [courses.length, refetch]);

  const handleCoursePress = useCallback((courseId: string) => {
    router.push(`/course/${courseId}`);
  }, []);

  const handleBookmarkToggle = useCallback(
    (courseId: string) => {
      void toggleBookmark(courseId);
    },
    [toggleBookmark],
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>Courses you saved for later.</Text>
      </View>

      {isLoading && courses.length === 0 ? (
        <View style={styles.listPadding}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={`bookmark-skeleton-${index}`} style={styles.gridItem}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <LegendList
          key={numColumns}
          data={bookmarkedCourses}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          estimatedItemSize={120}
          recycleItems
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <CourseCard
                course={item}
                onPress={() => handleCoursePress(item.id)}
                onBookmarkToggle={() => handleBookmarkToggle(item.id)}
              />
            </View>
          )}
          contentContainerStyle={[
            styles.listContent,
            bookmarkedCourses.length === 0 ? styles.emptyContent : null,
          ]}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="No bookmarks yet"
              subtitle="Start exploring courses and tap the star to save them here."
              actionLabel="Browse courses"
              onAction={() => router.push("/")}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <Text style={styles.hint}>
        Swipe-to-remove is ready for a future pass.
      </Text>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: SPACING.lg,
      paddingTop: SPACING.lg,
    },
    header: {
      marginBottom: SPACING.md,
    },
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.xl,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.xs,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
    },
    listPadding: {
      paddingBottom: SPACING.xl,
    },
    listContent: {
      paddingBottom: SPACING.xl,
    },
    emptyContent: {
      flexGrow: 1,
      justifyContent: "center",
    },
    columnWrapper: {
      gap: SPACING.md,
    },
    gridItem: {
      flex: 1,
    },
    hint: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      textAlign: "center",
      paddingVertical: SPACING.sm,
    },
  });
