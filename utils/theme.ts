export const darkTheme = {
  background: "#0F172A",
  surface: "#1E293B",
  surfaceElevated: "#263548",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  primary: "#6366F1",
  primaryMuted: "#4F46E5",
  accent: "#22C55E",
  error: "#EF4444",
  warning: "#F59E0B",
  border: "#334155",
  tabBar: "#1E293B",
  card: "#1E293B",
  onPrimary: "#FFFFFF",
  skeletonBase: "#334155",
  skeletonShimmer: "rgba(255, 255, 255, 0.08)",
};

export const lightTheme = {
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceElevated: "#F1F5F9",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  primary: "#6366F1",
  primaryMuted: "#818CF8",
  accent: "#16A34A",
  error: "#DC2626",
  warning: "#D97706",
  border: "#E2E8F0",
  tabBar: "#FFFFFF",
  card: "#FFFFFF",
  onPrimary: "#FFFFFF",
  skeletonBase: "#CBD5E1",
  skeletonShimmer: "rgba(15, 23, 42, 0.08)",
};

export type AppTheme = typeof darkTheme;
export type ThemeMode = "dark" | "light";

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
};

export const FONT_WEIGHT = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const ICON_SIZE = {
  sm: 18,
  md: 22,
  lg: 24,
  xl: 36,
  xxl: 44,
  profile: 48,
} as const;

export const DIMENSIONS = {
  avatarLarge: 100,
  tabBarHeight: 60,
  courseCardThumbnail: 80,
  courseCardAvatar: 22,
  courseThumbnailHeight: 220,
  courseDetailAvatar: 44,
  emptyStateIcon: 48,
  detailFooterOffset: 140,
  webViewCardRadius: 20,
  webViewMaxWidth: 320,
} as const;
