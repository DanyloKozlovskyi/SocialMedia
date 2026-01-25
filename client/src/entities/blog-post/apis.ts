import api, { ENDPOINTS } from "@shared/api";
import { Blog, BlogCreateModel } from "./interfaces";

const getPost = async (id: string): Promise<Blog> => {
  const response = await api.get(`${ENDPOINTS.BLOG}/GetById/${id}`);
  return response?.data;
};

const getPosts = async (
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const response = await api.get(
    `${ENDPOINTS.BLOG}/All?page=${page}&pageSize=${pageSize}`
  );
  return response?.data;
};

const getUserPosts = async ({
  id,
  page,
  pageSize,
}: {
  id: string;
  page: number;
  pageSize: number;
}): Promise<Array<Blog>> => {
  const response = await api.get(
    `${ENDPOINTS.BLOG}/GetByUserId/${id}?page=${page}&pageSize=${pageSize}`
  );
  return response?.data;
};

const getComments = async (
  id: string,
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const response = await api.get(
    `${ENDPOINTS.BLOG}/GetByParentId/${id}?page=${page}&pageSize=${pageSize}`
  );
  return response?.data;
};

const createPost = async ({ ...props }: BlogCreateModel) => {
  const response = await api.post(`${ENDPOINTS.BLOG}/Create`, props);
  return response?.data;
};

const filterPosts = async (
  query: string,
  page: number,
  pageSize: number
): Promise<Array<Blog>> => {
  const response = await api.get(
    `${ENDPOINTS.BLOG}/Filter?query=${query}&page=${page}&pageSize=${pageSize}`
  );
  return response?.data;
};

const getParents = async (id: string): Promise<Array<Blog>> => {
  const response = await api.get(`${ENDPOINTS.BLOG}/GetParents/${id}`);
  return response?.data;
};

export {
  getPost,
  getPosts,
  getUserPosts,
  getComments,
  createPost,
  filterPosts,
  getParents,
};
