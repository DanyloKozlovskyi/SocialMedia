import api, { ENDPOINTS } from "@shared/api";
import { UpdateUser, User } from "./interfaces";

const getPersonalInfo = async (): Promise<User> => {
  const response = await api.get(`${ENDPOINTS.ACCOUNT}/GetPersonalInfo`);
  return response?.data;
};

const getUserInfo = async (userId: string): Promise<User> => {
  const response = await api.get(`${ENDPOINTS.ACCOUNT}/GetUserInfo/${userId}`);
  return response?.data;
};

const editProfile = async ({ ...props }: UpdateUser): Promise<User> => {
  const response = await api.post(`${ENDPOINTS.ACCOUNT}/EditProfile`, props);
  return response?.data;
};

const filterUsers = async (
  username: string,
  page: number,
  pageSize: number
): Promise<Array<User>> => {
  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/FilterUsers?query=${username}&page=${page}&pageSize=${pageSize}`
  );
  return response?.data;
};

export { getPersonalInfo, getUserInfo, editProfile, filterUsers };
