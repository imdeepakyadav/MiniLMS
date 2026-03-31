import notificationService from "@features/notifications/notificationService";
import { getItem, setItem } from "@services/storage";
import { STORAGE_KEYS } from "@utils/constants";
import { ActivityLog, Badge, StreakData } from "../../types/course.types";

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  totalActiveDays: 0,
};

const BADGE_MILESTONES: Badge[] = [
  {
    id: "streak_3",
    label: "3-Day Streak",
    description: "Learned 3 days in a row",
    icon: "🔥",
    unlockedAt: null,
  },
  {
    id: "streak_7",
    label: "Week Warrior",
    description: "Learned 7 days in a row",
    icon: "⚡",
    unlockedAt: null,
  },
  {
    id: "streak_14",
    label: "Fortnight Focus",
    description: "Learned 14 days in a row",
    icon: "💎",
    unlockedAt: null,
  },
  {
    id: "streak_30",
    label: "Monthly Master",
    description: "30 day learning streak",
    icon: "👑",
    unlockedAt: null,
  },
];

const cloneBadgeTemplates = (): Badge[] =>
  BADGE_MILESTONES.map((badge) => ({ ...badge }));

export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0] ?? "";
};

export const getStreakData = async (): Promise<StreakData> => {
  try {
    const storedStreakData = await getItem<StreakData>(
      STORAGE_KEYS.STREAK_DATA,
    );
    return storedStreakData ?? DEFAULT_STREAK_DATA;
  } catch {
    return DEFAULT_STREAK_DATA;
  }
};

export const getActivityLog = async (): Promise<ActivityLog[]> => {
  try {
    const storedLog = await getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOG);
    return Array.isArray(storedLog) ? storedLog : [];
  } catch {
    return [];
  }
};

export const updateStreak = async (): Promise<StreakData> => {
  const streakData = await getStreakData();
  const todayString = getTodayDateString();

  if (streakData.lastActiveDate === todayString) {
    return streakData;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0] ?? "";

  let currentStreak = 1;
  if (streakData.lastActiveDate === yesterdayString) {
    currentStreak = streakData.currentStreak + 1;
  }

  const nextStreakData: StreakData = {
    currentStreak,
    longestStreak: Math.max(streakData.longestStreak, currentStreak),
    lastActiveDate: todayString,
    totalActiveDays: streakData.totalActiveDays + 1,
  };

  await setItem(STORAGE_KEYS.STREAK_DATA, nextStreakData);
  return nextStreakData;
};

export const logActivity = async (type: "lesson" | "course"): Promise<void> => {
  try {
    const todayString = getTodayDateString();
    const storedLog = await getActivityLog();
    const entryIndex = storedLog.findIndex(
      (entry) => entry.date === todayString,
    );

    let nextLog: ActivityLog[];
    if (entryIndex >= 0) {
      nextLog = storedLog.map((entry, index) => {
        if (index !== entryIndex) {
          return entry;
        }

        return {
          ...entry,
          lessonsCompleted:
            entry.lessonsCompleted + (type === "lesson" ? 1 : 0),
          coursesOpened: entry.coursesOpened + (type === "course" ? 1 : 0),
        };
      });
    } else {
      nextLog = [
        ...storedLog,
        {
          date: todayString,
          lessonsCompleted: type === "lesson" ? 1 : 0,
          coursesOpened: type === "course" ? 1 : 0,
        },
      ];
    }

    await setItem(STORAGE_KEYS.ACTIVITY_LOG, nextLog.slice(-30));
  } catch {
    return;
  }
};

const buildBadgeTemplates = (existingBadges: Badge[]): Badge[] => {
  return cloneBadgeTemplates().map((badge) => {
    const existingBadge = existingBadges.find((item) => item.id === badge.id);
    return existingBadge ? existingBadge : badge;
  });
};

const shouldUnlockBadge = (
  badgeId: string,
  streakData: StreakData,
): boolean => {
  switch (badgeId) {
    case "streak_3":
      return streakData.currentStreak >= 3;
    case "streak_7":
      return streakData.currentStreak >= 7;
    case "streak_14":
      return streakData.currentStreak >= 14;
    case "streak_30":
      return streakData.currentStreak >= 30;
    default:
      return false;
  }
};

export const checkAndAwardBadges = async (
  streakData: StreakData,
): Promise<Badge[]> => {
  try {
    const storedBadges = await getItem<Badge[]>(STORAGE_KEYS.BADGES_EARNED);
    const existingBadges = Array.isArray(storedBadges)
      ? storedBadges
      : cloneBadgeTemplates();

    const mergedBadges = buildBadgeTemplates(existingBadges).map((badge) => {
      const alreadyUnlocked = badge.unlockedAt !== null;
      const qualifiesNow = shouldUnlockBadge(badge.id, streakData);

      if (alreadyUnlocked || !qualifiesNow) {
        return badge;
      }

      void notificationService.scheduleBadgeUnlockedNotification(
        badge.icon,
        badge.label,
        badge.description,
      );

      return {
        ...badge,
        unlockedAt: Date.now(),
      };
    });

    await setItem(STORAGE_KEYS.BADGES_EARNED, mergedBadges);
    return mergedBadges;
  } catch {
    return cloneBadgeTemplates();
  }
};
