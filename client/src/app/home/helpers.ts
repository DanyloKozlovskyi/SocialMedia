import { getPosts, Blog } from "@entities/blog-post";

export const fetchPosts = async (
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const posts = await getPosts(page, pageSize);
  return posts;
};
