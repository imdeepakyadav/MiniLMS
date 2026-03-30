import { CourseCard } from "@components/course/CourseCard";
import { Button } from "@components/ui/Button";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import { SkeletonCard } from "@components/ui/SkeletonCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { useDebounce } from "@hooks/useDebounce";
import { useCourseStore } from "@store/courseStore";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@utils/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { courses, isLoading, error, refetch } = useCourses();
  const { toggleBookmark } = useBookmarks();
  const { courses: allCourses, dispatch } = useCourseStore();
  const [searchText, setSearchText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: debouncedSearchText });
  }, [debouncedSearchText, dispatch]);

  useEffect(() => {
    if (!allCourses.length) {
      void refetch();
    }
  }, [allCourses.length, refetch]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Courses</Text>
        <Text style={styles.subtitle}>Find something to learn today.</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={FONT_SIZE.lg}
          color={COLORS.primary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses or instructors"
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <ErrorBanner message={error} />
          <Button label="Retry" onPress={refetch} variant="outline" />
        </View>
      ) : null}

      {isLoading && allCourses.length === 0 ? (
        <View style={styles.listPadding}>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => router.push(`/course/${item.id}`)}
              onBookmarkToggle={() => toggleBookmark(item.id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            courses.length === 0 ? styles.emptyContent : null,
          ]}
          ListEmptyComponent={
            error ? null : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={36}
                  color={COLORS.primary}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyTitle}>No courses found</Text>
                <Text style={styles.emptyText}>
                  Try a different search term or refresh the catalog.
                </Text>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
  },
  errorBlock: {
    marginBottom: SPACING.md,
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
    maxWidth: 280,
  },
});
