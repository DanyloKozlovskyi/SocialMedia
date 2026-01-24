import { getPost, getComments, Blog } from "@entities/blog-post";

export const fetchMainPost = async (id: string): Promise<Blog> => {
  const post = await getPost(id);
  return post;
};

export const fetchSecondaryPosts = async (
  fetchFunction: (id: string) => Promise<Blog[]>,
  id: string
): Promise<Array<Blog>> => {
  const posts = await fetchFunction(id);
  return posts;
};

export const fetchComments = async (
  id: string,
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const posts = await getComments(id, page, pageSize);
  return posts;
};
