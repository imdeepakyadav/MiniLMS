import { useTheme } from "@store/themeStore";
import { AppTheme, FONT_SIZE, SPACING } from "@utils/theme";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OfflineBannerProps {
  isConnected: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isConnected,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(!isConnected);

  useEffect(() => {
    if (!isConnected) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -60,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRendered(false);
    });
  }, [isConnected, opacity, translateY]);

  if (!rendered) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.banner,
        {
          paddingTop: insets.top + SPACING.sm,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.inner}>
        <Text style={styles.text}>
          You&apos;re offline. Some features may not work.
        </Text>
      </View>
    </Animated.View>
  );
};

export default OfflineBanner;

const createStyles = (colors: AppTheme) =>
  StyleSheet.create({
    banner: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      backgroundColor: colors.error,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.sm,
    },
    inner: {
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      color: colors.onPrimary,
      fontSize: FONT_SIZE.sm,
      textAlign: "center",
    },
  });
