import { getItem } from "@services/storage";
import { STORAGE_KEYS } from "@utils/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, StreakData } from "../../types/course.types";
import {
  checkAndAwardBadges,
  getStreakData,
  logActivity,
  updateStreak,
} from "./streakService";

interface UseStreakResult {
  streakData: StreakData;
  badges: Badge[];
  recordActivity: (type: "lesson" | "course") => Promise<StreakData>;
  isLoading: boolean;
}

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: "",
  totalActiveDays: 0,
};

const DEFAULT_BADGES: Badge[] = [
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

const normalizeBadges = (value: Badge[] | null): Badge[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_BADGES;
  }

  return DEFAULT_BADGES.map((badge) => {
    const existingBadge = value.find((item) => item.id === badge.id);
    return existingBadge ?? badge;
  });
};

export const useStreak = (): UseStreakResult => {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedStreak, storedBadges] = await Promise.all([
          getStreakData(),
          getItem<Badge[]>(STORAGE_KEYS.BADGES_EARNED),
        ]);

        if (!isMountedRef.current) {
          return;
        }

        setStreakData(storedStreak);
        setBadges(normalizeBadges(storedBadges));
      } catch {
        if (isMountedRef.current) {
          setStreakData(DEFAULT_STREAK_DATA);
          setBadges(DEFAULT_BADGES);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const recordActivity = useCallback(
    async (type: "lesson" | "course"): Promise<StreakData> => {
      const nextStreak = await updateStreak();
      await logActivity(type);
      const nextBadges = await checkAndAwardBadges(nextStreak);

      if (isMountedRef.current) {
        setStreakData(nextStreak);
        setBadges(nextBadges);
      }

      return nextStreak;
    },
    [],
  );

  return { streakData, badges, recordActivity, isLoading };
};
