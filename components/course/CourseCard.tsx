import Ionicons from "@expo/vector-icons/Ionicons";
import { useCourseStore } from "@store/courseStore";
import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  DIMENSIONS,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Course } from "../../types/course.types";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onBookmarkToggle: () => void;
}

const CourseCardBase: React.FC<CourseCardProps> = ({
  course,
  onPress,
  onBookmarkToggle,
}) => {
  const { colors } = useTheme();
  const { progress } = useCourseStore();
  const styles = createStyles(colors);
  const courseProgress = progress[course.id];
  const thumbnailSource: ImageSourcePropType = course.thumbnail
    ? { uri: course.thumbnail }
    : require("../../assets/icon.png");

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={(event) => {
          event.stopPropagation();
          onBookmarkToggle();
        }}
        style={styles.bookmarkButton}
      >
        <Ionicons
          name={course.isBookmarked ? "star" : "star-outline"}
          size={20}
          color={colors.primary}
        />
      </TouchableOpacity>

      <View style={styles.contentRow}>
        <Image source={thumbnailSource} style={styles.thumbnail} />

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>

          <View style={styles.instructorRow}>
            <Image
              source={
                course.instructorAvatar
                  ? { uri: course.instructorAvatar }
                  : require("../../assets/icon.png")
              }
              style={styles.avatar}
            />
            <Text style={styles.instructorName} numberOfLines={1}>
              {course.instructorName}
            </Text>
          </View>

          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>${course.price.toFixed(2)}</Text>
          </View>

          {courseProgress?.percentage ? (
            <View style={styles.progressSection}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${courseProgress.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {courseProgress.completedLessons.length}/5 lessons
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const areEqual = (prev: CourseCardProps, next: CourseCardProps) => {
  return (
    prev.course.id === next.course.id &&
    prev.course.isBookmarked === next.course.isBookmarked &&
    prev.course.isEnrolled === next.course.isEnrolled &&
    prev.onPress === next.onPress &&
    prev.onBookmarkToggle === next.onBookmarkToggle
  );
};

export const CourseCard = React.memo(CourseCardBase, areEqual);

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      shadowColor: colors.background,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    bookmarkButton: {
      position: "absolute",
      top: SPACING.sm,
      right: SPACING.sm,
      zIndex: 2,
      padding: SPACING.xs,
    },
    bookmarkIcon: {
      color: colors.primary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
    },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: SPACING.lg,
    },
    thumbnail: {
      width: DIMENSIONS.courseCardThumbnail,
      height: DIMENSIONS.courseCardThumbnail,
      borderRadius: RADIUS.md,
      marginRight: SPACING.md,
      backgroundColor: colors.border,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.md,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.sm,
      paddingRight: SPACING.lg,
    },
    instructorRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    avatar: {
      width: DIMENSIONS.courseCardAvatar,
      height: DIMENSIONS.courseCardAvatar,
      borderRadius: RADIUS.full,
      backgroundColor: colors.border,
      marginRight: SPACING.xs,
    },
    instructorName: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.sm,
      flex: 1,
    },
    priceBadge: {
      alignSelf: "flex-start",
      backgroundColor: colors.accent,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: RADIUS.full,
    },
    priceText: {
      color: colors.background,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.bold,
    },
    progressSection: {
      marginTop: SPACING.sm,
    },
    progressTrack: {
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: colors.border,
      overflow: "hidden",
    },
    progressFill: {
      height: 4,
      borderRadius: RADIUS.full,
      backgroundColor: colors.accent,
    },
    progressText: {
      marginTop: SPACING.xs,
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
    },
  });
