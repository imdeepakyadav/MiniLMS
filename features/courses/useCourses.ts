import { useCourseStore } from "@store/courseStore";
import { fetchCourses } from "./courseService";

let inFlightFetch: Promise<void> | null = null;

export const useCourses = () => {
  const { courses, searchQuery, isLoading, error, dispatch } = useCourseStore();

  const fetchAndSetCourses = async () => {
    if (inFlightFetch) {
      return inFlightFetch;
    }

    inFlightFetch = (async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const courseList = await fetchCourses();
        dispatch({ type: "SET_COURSES", payload: courseList });
      } catch (err: any) {
        dispatch({
          type: "SET_ERROR",
          payload: err.message || "Failed to load courses",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    })();

    try {
      await inFlightFetch;
    } finally {
      inFlightFetch = null;
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = normalizedQuery
    ? courses.filter((course) => {
        const title = course.title.toLowerCase();
        const instructor = course.instructorName.toLowerCase();
        return (
          title.includes(normalizedQuery) ||
          instructor.includes(normalizedQuery)
        );
      })
    : courses;

  return {
    courses: filteredCourses,
    isLoading,
    error,
    refetch: fetchAndSetCourses,
  };
};
