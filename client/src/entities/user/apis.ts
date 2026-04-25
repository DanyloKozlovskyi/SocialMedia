import api, { ENDPOINTS } from "@shared/api";
import { UpdateUser, User, FollowStatus } from "./interfaces";

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
  pageSize: number,
): Promise<Array<User>> => {
  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/FilterUsers?query=${username}&page=${page}&pageSize=${pageSize}`,
  );
  return response?.data;
};

const followUser = async (targetUserId: string): Promise<string> => {
  const response = await api.post(
    `${ENDPOINTS.ACCOUNT}/Follow/${targetUserId}`,
  );
  return response?.data;
};

const unfollowUser = async (targetUserId: string): Promise<string> => {
  const response = await api.delete(
    `${ENDPOINTS.ACCOUNT}/Unfollow/${targetUserId}`,
  );
  return response?.data;
};

const getFollowStatus = async (targetUserId: string): Promise<FollowStatus> => {
  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/GetFollowStatus/${targetUserId}`,
  );
  return response?.data;
};

const getFollowers = async (
  userId: string,
  page: number,
  pageSize: number,
): Promise<Array<User>> => {
  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/GetFollowers/${userId}?page=${page}&pageSize=${pageSize}`,
  );
  return (
    response?.data?.map(
      (f: {
        userId: string;
        userName: string;
        name: string;
        logoKey: string;
        logoContentType: string;
      }) => ({
        id: f.userId,
        userName: f.userName,
        name: f.name,
        logoKey: f.logoKey,
        logoContentType: f.logoContentType,
        description: null,
      }),
    ) ?? []
  );
};

const getFollowing = async (
  userId: string,
  page: number,
  pageSize: number,
): Promise<Array<User>> => {
  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/GetFollowing/${userId}?page=${page}&pageSize=${pageSize}`,
  );
  return (
    response?.data?.map(
      (f: {
        userId: string;
        userName: string;
        name: string;
        logoKey: string;
        logoContentType: string;
      }) => ({
        id: f.userId,
        userName: f.userName,
        name: f.name,
        logoKey: f.logoKey,
        logoContentType: f.logoContentType,
        description: null,
      }),
    ) ?? []
  );
};

export {
  getPersonalInfo,
  getUserInfo,
  editProfile,
  filterUsers,
  followUser,
  unfollowUser,
  getFollowStatus,
  getFollowers,
  getFollowing,
};
