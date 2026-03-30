import { Button } from "@components/ui/Button";
import { EmptyState } from "@components/ui/EmptyState";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@features/auth/useAuth";
import { getItem, setItem } from "@services/storage";
import { useAuthStore } from "@store/authStore";
import { useCourseStore } from "@store/courseStore";
import { STORAGE_KEYS } from "@utils/constants";
import {
  COLORS,
  DIMENSIONS,
  FONT_SIZE,
  FONT_WEIGHT,
  ICON_SIZE,
  RADIUS,
  SPACING,
} from "@utils/theme";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PROFILE_IMAGE_MAX_SIZE = DIMENSIONS.avatarLarge;

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const { logout, isLoading } = useAuth();
  const { bookmarks, enrolledCourses } = useCourseStore();
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const savedImage = await getItem<string>(STORAGE_KEYS.PROFILE_IMAGE);
        setProfileImageUri(savedImage);
      } catch {
        setProfileImageUri(null);
      }
    };

    void loadProfileImage();
  }, []);

  const joinDate = useMemo(() => {
    if (!user?.createdAt) {
      return "Recently";
    }

    return new Date(user.createdAt).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [user?.createdAt]);

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets.length) {
        return;
      }

      const nextUri = result.assets[0].uri;
      await setItem(STORAGE_KEYS.PROFILE_IMAGE, nextUri);
      setProfileImageUri(nextUri);
    } catch {
      Alert.alert("Unable to update photo", "Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch {
      Alert.alert("Logout failed", "Please try again.");
    }
  };

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          void handleLogout();
        },
      },
    ]);
  };

  const initial = user?.username?.trim().charAt(0).toUpperCase() ?? "?";

  if (!user) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right", "bottom"]}
      >
        <EmptyState
          icon="person-outline"
          title="Profile unavailable"
          subtitle="Please sign in again to view your profile."
          actionLabel="Go to login"
          onAction={() => router.replace("/(auth)/login")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.avatarContainer}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.avatarImage}
                onError={() => setProfileImageUri(null)}
              />
            ) : (
              <View style={styles.initialAvatar}>
                <Text style={styles.initialText}>{initial}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => void handleChangePhoto()}
            style={styles.photoButton}
          >
            <Text style={styles.photoButtonText}>Change Photo</Text>
          </TouchableOpacity>

          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{enrolledCourses.length}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{bookmarks.length}</Text>
            <Text style={styles.statLabel}>Bookmarked</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}>
              <Ionicons
                name="calendar-outline"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
              <Text style={styles.infoLabel}>Member since</Text>
            </View>
            <Text style={styles.infoValue}>{joinDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}>
              <Ionicons
                name="mail-outline"
                size={ICON_SIZE.sm}
                color={COLORS.primary}
              />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label={isLoading ? "Logging out..." : "Logout"}
            onPress={confirmLogout}
            variant="outline"
            tone="danger"
            loading={isLoading}
          />
        </View>
      </ScrollView>
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
  content: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: SPACING.lg,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  avatarImage: {
    width: PROFILE_IMAGE_MAX_SIZE,
    height: PROFILE_IMAGE_MAX_SIZE,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
  },
  initialAvatar: {
    width: PROFILE_IMAGE_MAX_SIZE,
    height: PROFILE_IMAGE_MAX_SIZE,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  initialText: {
    color: COLORS.onPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  photoButton: {
    alignSelf: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  photoButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  username: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: "center",
  },
  email: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    marginTop: SPACING.xs,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.xl,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: SPACING.md,
  },
  infoLabel: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.sm,
  },
  infoValue: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: "right",
    flexShrink: 1,
  },
  footer: {
    marginTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
});
