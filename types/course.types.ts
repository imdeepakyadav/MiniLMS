export interface Instructor {
  login: { uuid: string; username: string };
  name: { first: string; last: string };
  picture: { medium: string };
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  instructorName: string;
  instructorAvatar: string;
  isBookmarked: boolean;
  isEnrolled: boolean;
}

export interface RawProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

export type RawUser = any;

export interface CourseDetailPayload {
  type: 'COURSE_DATA';
  payload: {
    courseId: string;
    title: string;
    instructor: string;
  };
}

export interface WebViewMessage {
  type: 'COURSE_COMPLETED';
  courseId: string;
}
