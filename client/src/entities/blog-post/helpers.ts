import { getUserPosts, Blog } from "@entities/blog-post";

export const fetchUserPosts = async (
  page: number,
  pageSize: number,
  userId: string
): Promise<Blog[]> => {
  const posts = await getUserPosts({ id: userId, page, pageSize });
  return posts;
};
