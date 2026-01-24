import api from "@shared/api";
import { Like } from './interfaces'

const setLike = async ({ userId, blogId }: Like) => {
  const response = await api.put(`blog/${blogId}/SetLike`, userId);
  return response?.data;
};

const getLike = async ({ blogId }: Like) => {
  const response = await api.get(`blog/${blogId}/GetLike`);
  return response?.data;
};

const getLikes = async ({ blogId }: Like) => {
  const response = await api.get(`blog/${blogId}/GetLikes`);
  return response?.data;
};

const getUserLikes = async ({ userId, ...props }: Like) => {
  const response = await api.post(`blog/user/${userId}/GetUserLikes`, {
    ...props,
  });
  return response?.data;
};

export { setLike, getLike, getLikes, getUserLikes };
