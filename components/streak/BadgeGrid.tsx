import { useTheme } from "@store/themeStore";
import {
  AppTheme,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
  SPACING,
} from "@utils/theme";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "../../types/course.types";

interface BadgeGridProps {
  badges: Badge[];
}

interface BadgeCellProps {
  badge: Badge;
}

const BadgeCell: React.FC<BadgeCellProps> = ({ badge }) => {
  const { colors } = useTheme();
  const isUnlocked = badge.unlockedAt !== null;
  const styles = createStyles(colors, !isUnlocked);

  return (
    <View style={styles.cell}>
      <Text style={styles.icon}>{isUnlocked ? badge.icon : "🔒"}</Text>
      <Text style={styles.label}>{badge.label}</Text>
      {isUnlocked ? (
        <Text style={styles.description}>{badge.description}</Text>
      ) : null}
      <View style={isUnlocked ? styles.unlockedTag : styles.lockedTag}>
        <Text
          style={isUnlocked ? styles.unlockedTagText : styles.lockedTagText}
        >
          {isUnlocked ? "Unlocked" : "Locked"}
        </Text>
      </View>
    </View>
  );
};

export const BadgeGrid: React.FC<BadgeGridProps> = ({ badges }) => {
  const { colors } = useTheme();
  const styles = createGridStyles(colors);
  const badgeRows = useMemo(() => {
    const rows: Badge[][] = [];

    for (let index = 0; index < badges.length; index += 2) {
      rows.push(badges.slice(index, index + 2));
    }

    return rows;
  }, [badges]);

  return (
    <View>
      <Text style={styles.title}>Achievements</Text>
      <View style={styles.grid}>
        {badgeRows.map((row, rowIndex) => (
          <View key={`badge-row-${rowIndex}`} style={styles.row}>
            {row.map((badge) => (
              <View key={badge.id} style={styles.cellWrapper}>
                <BadgeCell badge={badge} />
              </View>
            ))}
            {row.length === 1 ? <View style={styles.cellWrapper} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const createGridStyles = (colors: AppTheme) =>
  StyleSheet.create({
    title: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.lg,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.md,
    },
    grid: {
      gap: SPACING.md,
    },
    row: {
      flexDirection: "row",
      gap: SPACING.md,
    },
    cellWrapper: {
      flex: 1,
    },
  });

const createStyles = (colors: AppTheme, locked: boolean) =>
  StyleSheet.create({
    cell: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.md,
      padding: SPACING.md,
      opacity: locked ? 0.4 : 1,
      minHeight: 140,
      justifyContent: "space-between",
    },
    icon: {
      fontSize: 32,
      marginBottom: SPACING.sm,
    },
    label: {
      color: colors.textPrimary,
      fontSize: FONT_SIZE.sm,
      fontWeight: FONT_WEIGHT.bold,
      marginBottom: SPACING.xs,
    },
    description: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      marginBottom: SPACING.sm,
    },
    unlockedTag: {
      alignSelf: "flex-start",
      backgroundColor: colors.accent,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
    },
    lockedTag: {
      alignSelf: "flex-start",
      backgroundColor: colors.surfaceElevated,
      borderRadius: RADIUS.full,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
    },
    unlockedTagText: {
      color: colors.onPrimary,
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.bold,
    },
    lockedTagText: {
      color: colors.textSecondary,
      fontSize: FONT_SIZE.xs,
      fontWeight: FONT_WEIGHT.bold,
    },
  });
