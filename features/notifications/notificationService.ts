import Constants from "expo-constants";

let notificationPermissionGranted = false;
let notificationsModule: typeof import("expo-notifications") | null = null;

const canUseNativeNotifications =
  Constants.appOwnership === "standalone" ||
  Constants.executionEnvironment === "bare";

const loadNotificationsModule = async () => {
  if (!canUseNativeNotifications) {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = await import("expo-notifications");
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
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
        seconds: 5,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  requestPermissions,
  scheduleBookmarkMilestoneNotification,
  scheduleReEngagementNotification,
};
