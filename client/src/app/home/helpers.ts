import { getPosts, Blog } from "@entities/blog-post";
import { getUniversityPosts } from "@entities/university";

export const fetchPosts = async (
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const posts = await getPosts(page, pageSize);
  return posts;
};

export const fetchUniversityPosts = async (
  universityDomain: string,
  facultyCode: string | null,
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const posts = await getUniversityPosts(
    universityDomain,
    facultyCode ?? undefined,
    page,
    pageSize
  );
  return posts as Array<Blog>;
};
