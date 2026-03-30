import { CourseCard } from "@components/course/CourseCard";
import { Button } from "@components/ui/Button";
import { EmptyState } from "@components/ui/EmptyState";
import { ErrorBanner } from "@components/ui/ErrorBanner";
import { SkeletonCard } from "@components/ui/SkeletonCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useBookmarks } from "@features/courses/useBookmarks";
import { useCourses } from "@features/courses/useCourses";
import { useDebounce } from "@hooks/useDebounce";
import { useAuthStore } from "@store/authStore";
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
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { courses, isLoading, error, refetch } = useCourses();
  const { toggleBookmark } = useBookmarks();
  const { user } = useAuthStore();
  const { courses: allCourses, dispatch } = useCourseStore();
  const [searchText, setSearchText] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 300);
  const { width, height } = useWindowDimensions();
  const numColumns = width > height ? 2 : 1;

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
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.logoText}>MiniLMS</Text>
          <Text style={styles.subtitle}>Find something to learn today.</Text>
        </View>
        <Text style={styles.greeting} numberOfLines={1}>
          Hi, {user?.username ?? "Learner"} 👋
        </Text>
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
        <View style={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={`skeleton-${index}`} style={styles.gridItem}>
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={courses}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <CourseCard
                course={item}
                onPress={() => router.push(`/course/${item.id}`)}
                onBookmarkToggle={() => toggleBookmark(item.id)}
              />
            </View>
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
              <EmptyState
                icon="search-outline"
                title="No courses found"
                subtitle="Try a different search term or refresh the catalog."
                actionLabel={searchText ? "Clear search" : undefined}
                onAction={searchText ? () => setSearchText("") : undefined}
              />
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  logoText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
    letterSpacing: 0.4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  greeting: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: "right",
    flexShrink: 1,
    marginLeft: SPACING.md,
    marginTop: SPACING.xs,
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
  skeletonGrid: {
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
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    maxWidth: 280,
  },
});
