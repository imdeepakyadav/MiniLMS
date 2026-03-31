import Constants from "expo-constants";

let notificationPermissionGranted = false;
let notificationsModule: typeof import("expo-notifications") | null = null;

const canUseNativeNotifications =
  Constants.executionEnvironment !== "storeClient";

const loadNotificationsModule = async () => {
  if (!canUseNativeNotifications) {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = await import("expo-notifications");
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }

  return notificationsModule;
};

export const requestPermissions = async (): Promise<boolean> => {
  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      notificationPermissionGranted = false;
      return false;
    }

    const result = await notifications.requestPermissionsAsync();
    notificationPermissionGranted =
      result.status === notifications.PermissionStatus.GRANTED;
    return notificationPermissionGranted;
  } catch (error) {
    notificationPermissionGranted = false;
    return false;
  }
};

export const scheduleBookmarkMilestoneNotification =
  async (): Promise<boolean> => {
    if (!notificationPermissionGranted) {
      return false;
    }

    try {
      const notifications = await loadNotificationsModule();
      if (!notifications) {
        return false;
      }

      await notifications.scheduleNotificationAsync({
        content: {
          title: "You're on a roll! 🎯",
          body: "You've bookmarked 5 courses. Time to start learning!",
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

export const scheduleReEngagementNotification = async (): Promise<boolean> => {
  if (!notificationPermissionGranted) {
    return false;
  }

  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      return false;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: "Miss you! 👋",
        body: "You haven't visited your courses in a while. Pick up where you left off.",
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const scheduleCourseCompletedNotification = async (
  courseTitle: string,
): Promise<boolean> => {
  if (!notificationPermissionGranted) {
    return false;
  }

  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      return false;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: "Course Completed! 🎓",
        body: `You finished "${courseTitle}". Keep it up!`,
      },
      trigger: null,
    });

    return true;
  } catch {
    return false;
  }
};

export const scheduleBadgeUnlockedNotification = async (
  icon: string,
  label: string,
  description: string,
): Promise<boolean> => {
  if (!notificationPermissionGranted) {
    return false;
  }

  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      return false;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: `Badge Unlocked! ${icon}`,
        body: `You earned '${label}' — ${description}`,
      },
      trigger: null,
    });

    return true;
  } catch {
    return false;
  }
};

export const cancelAllScheduledNotifications = async (): Promise<void> => {
  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      return;
    }

    await notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    return;
  }
};

export const scheduleStreakRecoveryNotification = async (): Promise<void> => {
  if (!notificationPermissionGranted) {
    return;
  }

  try {
    const notifications = await loadNotificationsModule();
    if (!notifications) {
      return;
    }

    await notifications.scheduleNotificationAsync({
      content: {
        title: "Don't break your streak! 🔥",
        body: "You're on a roll — keep your learning streak alive today.",
      },
      trigger: {
        type: notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: 8,
        minute: 0,
        repeats: false,
      },
    });
  } catch {
    return;
  }
};

export default {
  requestPermissions,
  scheduleBookmarkMilestoneNotification,
  scheduleReEngagementNotification,
  scheduleCourseCompletedNotification,
  scheduleBadgeUnlockedNotification,
  cancelAllScheduledNotifications,
  scheduleStreakRecoveryNotification,
};
