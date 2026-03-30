import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS, FONT_SIZE, FONT_WEIGHT, RADIUS, SPACING } from "@utils/theme";
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

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  onBookmarkToggle,
}) => {
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
          color={COLORS.primary}
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
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000000",
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
    color: COLORS.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: SPACING.lg,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    backgroundColor: COLORS.border,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: COLORS.textPrimary,
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
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    marginRight: SPACING.xs,
  },
  instructorName: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  priceBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  priceText: {
    color: COLORS.background,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
});
