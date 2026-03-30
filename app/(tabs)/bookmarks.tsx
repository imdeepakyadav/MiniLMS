import { CourseCard } from "@components/course/CourseCard";
import { SkeletonCard } from "@components/ui/SkeletonCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { useCourseStore } from "@store/courseStore";
import { COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from "@utils/theme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarksScreen() {
  const { bookmarkedCourses, toggleBookmark } = useBookmarks();
  const { isLoading, refetch } = useCourses();
  const { courses } = useCourseStore();

  useEffect(() => {
    if (!courses.length) {
      void refetch();
    }
  }, [courses.length, refetch]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        <Text style={styles.subtitle}>Courses you saved for later.</Text>
      </View>

      {isLoading && courses.length === 0 ? (
        <View style={styles.listPadding}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`bookmark-skeleton-${index}`} />
          ))}
        </View>
      ) : (
        <FlatList
          data={bookmarkedCourses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => router.push(`/course/${item.id}`)}
              onBookmarkToggle={() => toggleBookmark(item.id)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            bookmarkedCourses.length === 0 ? styles.emptyContent : null,
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="bookmark-outline"
                size={36}
                color={COLORS.primary}
                style={styles.emptyIcon}
              />
              <Text style={styles.emptyTitle}>No bookmarks yet</Text>
              <Text style={styles.emptyText}>
                Start exploring courses and tap the star to save them here.
              </Text>
            </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
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
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyIcon: { marginBottom: SPACING.sm },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    maxWidth: 300,
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    textAlign: "center",
    paddingVertical: SPACING.sm,
  },
});
