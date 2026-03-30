import { apiGet } from "@services/api";
import { Course } from "../../types/course.types";

interface RawProduct {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
}

interface RawUser {
  name?: {
    first?: string;
    last?: string;
  };
  picture?: {
    medium?: string;
  };
}

const extractList = <T>(value: any): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (Array.isArray(value?.data)) {
    return value.data as T[];
  }

  if (Array.isArray(value?.data?.data)) {
    return value.data.data as T[];
  }

  return [];
};

export const fetchCourses = async (): Promise<Course[]> => {
  const [productsResponse, usersResponse] = await Promise.all([
    apiGet<any>("api/v1/public/randomproducts?page=1&limit=20"),
    apiGet<any>("api/v1/public/randomusers?page=1&limit=20"),
  ]);

  const products = extractList<RawProduct>(productsResponse);
  const users = extractList<RawUser>(usersResponse);

  return products.map((product, index) => {
    const user = users.length > 0 ? users[index % users.length] : undefined;
    const instructorFirstName = user?.name?.first ?? "Unknown";
    const instructorLastName = user?.name?.last ?? "Instructor";

    return {
      id: String(product.id),
      title: product.title ?? "Untitled course",
      description: product.description ?? "",
      thumbnail: product.thumbnail ?? "",
      price: Number(product.price) || 0,
      instructorName: `${instructorFirstName} ${instructorLastName}`.trim(),
      instructorAvatar: user?.picture?.medium ?? "",
      isBookmarked: false,
      isEnrolled: false,
    };
  });
};
