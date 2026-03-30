import { COLORS, RADIUS, SPACING } from "@utils/theme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export const SkeletonCard = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 320],
  });

  return (
    <View style={styles.card}>
      <View style={styles.contentRow}>
        <View style={styles.thumbnail} />

        <View style={styles.content}>
          <View style={styles.title} />
          <View style={styles.instructorRow}>
            <View style={styles.avatar} />
            <View style={styles.instructorName} />
          </View>
          <View style={styles.priceBadge} />
        </View>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.shimmer, { transform: [{ translateX }] }]}
      />
    </View>
  );
};

export default SkeletonCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
    backgroundColor: "#334155",
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  title: {
    width: "78%",
    height: 16,
    borderRadius: RADIUS.full,
    backgroundColor: "#334155",
    marginBottom: SPACING.sm,
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
    backgroundColor: "#334155",
    marginRight: SPACING.xs,
  },
  instructorName: {
    width: "45%",
    height: 12,
    borderRadius: RADIUS.full,
    backgroundColor: "#334155",
  },
  priceBadge: {
    width: 72,
    height: 20,
    borderRadius: RADIUS.full,
    backgroundColor: "#334155",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 90,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
