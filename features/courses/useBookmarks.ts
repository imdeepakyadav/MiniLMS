import notificationService from "@features/notifications/notificationService";
import { getItem, setItem } from "@services/storage";
import { useCourseStore } from "@store/courseStore";
import { STORAGE_KEYS } from "@utils/constants";
import { Course } from "../../types/course.types";

export const useBookmarks = () => {
  const { courses, bookmarks, dispatch } = useCourseStore();

  const toggleBookmark = async (courseId: string) => {
    const isBookmarked = bookmarks.includes(courseId);
    const nextBookmarkCount = isBookmarked
      ? bookmarks.length - 1
      : bookmarks.length + 1;

    dispatch({ type: "TOGGLE_BOOKMARK", payload: courseId });

    if (nextBookmarkCount === 5) {
      const milestoneAlreadyNotified = await getItem<boolean>(
        STORAGE_KEYS.BOOKMARK_MILESTONE_NOTIFIED,
      );

      if (!milestoneAlreadyNotified) {
        const scheduled =
          await notificationService.scheduleBookmarkMilestoneNotification();
        if (scheduled) {
          await setItem(STORAGE_KEYS.BOOKMARK_MILESTONE_NOTIFIED, true);
        }
      }
    }
  };

  const bookmarkedCourses: Course[] = courses.filter((course) =>
    bookmarks.includes(course.id),
  );

  const isBookmarked = (courseId: string) => bookmarks.includes(courseId);

  return {
    toggleBookmark,
    bookmarkedCourses,
    isBookmarked,
  };
};
