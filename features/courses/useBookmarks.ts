import { useCourseStore } from "@store/courseStore";
import { Course } from "../../types/course.types";

export const useBookmarks = () => {
  const { courses, bookmarks, dispatch } = useCourseStore();

  const toggleBookmark = (courseId: string) => {
    dispatch({ type: "TOGGLE_BOOKMARK", payload: courseId });
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
