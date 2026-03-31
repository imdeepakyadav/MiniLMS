import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { getItem, setItem } from "../services/storage";
import { Course, CourseProgress } from "../types/course.types";
import { STORAGE_KEYS } from "../utils/constants";

export interface CourseStoreState {
  courses: Course[];
  bookmarks: string[];
  enrolledCourses: string[];
  progress: Record<string, CourseProgress>;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

type CourseStoreAction =
  | { type: "SET_COURSES"; payload: Course[] }
  | { type: "TOGGLE_BOOKMARK"; payload: string }
  | { type: "ENROLL_COURSE"; payload: string }
  | {
      type: "UPDATE_LESSON_PROGRESS";
      payload: { courseId: string; lessonIndex: number };
    }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "HYDRATE_BOOKMARKS"; payload: string[] }
  | { type: "HYDRATE_ENROLLED_COURSES"; payload: string[] }
  | { type: "REHYDRATE_PROGRESS"; payload: Record<string, CourseProgress> };

interface CourseStoreContextValue extends CourseStoreState {
  dispatch: React.Dispatch<CourseStoreAction>;
}

const initialState: CourseStoreState = {
  courses: [],
  bookmarks: [],
  enrolledCourses: [],
  progress: {},
  searchQuery: "",
  isLoading: true,
  error: null,
};

const DEFAULT_TOTAL_LESSONS = 5;

const normalizeCompletedLessons = (value: unknown): number[] => {
  return Array.isArray(value)
    ? Array.from(
        new Set(
          value.filter(
            (item): item is number => typeof item === "number" && item >= 0,
          ),
        ),
      ).sort((a, b) => a - b)
    : [];
};

const createCourseProgress = (
  courseId: string,
  completedLessons: number[] = [],
): CourseProgress => {
  const normalizedLessons = normalizeCompletedLessons(completedLessons).filter(
    (lessonIndex) => lessonIndex < DEFAULT_TOTAL_LESSONS,
  );

  return {
    courseId,
    totalLessons: DEFAULT_TOTAL_LESSONS,
    completedLessons: normalizedLessons,
    percentage: Math.round(
      (normalizedLessons.length / DEFAULT_TOTAL_LESSONS) * 100,
    ),
    lastUpdated: Date.now(),
  };
};

const normalizeProgressRecord = (
  value: unknown,
): Record<string, CourseProgress> => {
  if (!value || typeof value !== "object") {
    return {};
  }

  return Object.entries(value as Record<string, unknown>).reduce(
    (accumulator, [courseId, progressValue]) => {
      if (!progressValue || typeof progressValue !== "object") {
        return accumulator;
      }

      const progress = progressValue as Partial<CourseProgress>;
      accumulator[courseId] = createCourseProgress(
        courseId,
        progress.completedLessons,
      );
      return accumulator;
    },
    {} as Record<string, CourseProgress>,
  );
};

const normalizeList = (value: unknown): string[] => {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
};

const syncCourseFlags = (
  courses: Course[],
  bookmarks: string[],
  enrolledCourses: string[],
) => {
  return courses.map((course) => ({
    ...course,
    isBookmarked: bookmarks.includes(course.id),
    isEnrolled: enrolledCourses.includes(course.id),
  }));
};

const courseReducer = (
  state: CourseStoreState,
  action: CourseStoreAction,
): CourseStoreState => {
  switch (action.type) {
    case "SET_COURSES":
      return {
        ...state,
        courses: syncCourseFlags(
          action.payload,
          state.bookmarks,
          state.enrolledCourses,
        ),
        isLoading: false,
        error: null,
      };
    case "TOGGLE_BOOKMARK": {
      const isBookmarked = state.bookmarks.includes(action.payload);
      const bookmarks = isBookmarked
        ? state.bookmarks.filter((courseId) => courseId !== action.payload)
        : [...state.bookmarks, action.payload];

      return {
        ...state,
        bookmarks,
        courses: state.courses.map((course) =>
          course.id === action.payload
            ? { ...course, isBookmarked: !isBookmarked }
            : course,
        ),
      };
    }
    case "ENROLL_COURSE": {
      if (state.enrolledCourses.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        enrolledCourses: [...state.enrolledCourses, action.payload],
        courses: state.courses.map((course) =>
          course.id === action.payload
            ? { ...course, isEnrolled: true }
            : course,
        ),
      };
    }
    case "UPDATE_LESSON_PROGRESS": {
      const currentProgress =
        state.progress[action.payload.courseId] ??
        createCourseProgress(action.payload.courseId);
      const completedLessons = Array.from(
        new Set([
          ...currentProgress.completedLessons,
          action.payload.lessonIndex,
        ]),
      ).sort((a, b) => a - b);

      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.courseId]: {
            courseId: action.payload.courseId,
            totalLessons: DEFAULT_TOTAL_LESSONS,
            completedLessons,
            percentage: Math.round(
              (completedLessons.length / DEFAULT_TOTAL_LESSONS) * 100,
            ),
            lastUpdated: Date.now(),
          },
        },
      };
    }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "HYDRATE_BOOKMARKS":
      return {
        ...state,
        bookmarks: action.payload,
        courses: syncCourseFlags(
          state.courses,
          action.payload,
          state.enrolledCourses,
        ),
      };
    case "HYDRATE_ENROLLED_COURSES":
      return {
        ...state,
        enrolledCourses: action.payload,
        courses: syncCourseFlags(
          state.courses,
          state.bookmarks,
          action.payload,
        ),
      };
    case "REHYDRATE_PROGRESS":
      return { ...state, progress: action.payload };
    default:
      return state;
  }
};

export const CourseStoreContext = createContext<
  CourseStoreContextValue | undefined
>(undefined);

export const CourseStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const hydrateStore = async () => {
      try {
        const [bookmarkValues, enrolledValues, progressValues] =
          await Promise.all([
            getItem<string[]>(STORAGE_KEYS.BOOKMARKS),
            getItem<string[]>(STORAGE_KEYS.ENROLLED_COURSES),
            getItem<Record<string, CourseProgress>>(
              STORAGE_KEYS.COURSE_PROGRESS,
            ),
          ]);

        dispatch({
          type: "HYDRATE_BOOKMARKS",
          payload: normalizeList(bookmarkValues),
        });
        dispatch({
          type: "HYDRATE_ENROLLED_COURSES",
          payload: normalizeList(enrolledValues),
        });
        dispatch({
          type: "REHYDRATE_PROGRESS",
          payload: normalizeProgressRecord(progressValues),
        });
      } finally {
        hydratedRef.current = true;
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    void hydrateStore();
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    void setItem(STORAGE_KEYS.BOOKMARKS, state.bookmarks);
  }, [state.bookmarks]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    void setItem(STORAGE_KEYS.ENROLLED_COURSES, state.enrolledCourses);
  }, [state.enrolledCourses]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    void setItem(STORAGE_KEYS.COURSE_PROGRESS, state.progress);
  }, [state.progress]);

  return (
    <CourseStoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CourseStoreContext.Provider>
  );
};

export const useCourseStore = () => {
  const context = useContext(CourseStoreContext);
  if (!context) {
    throw new Error("useCourseStore must be used within a CourseStoreProvider");
  }
  return context;
};
