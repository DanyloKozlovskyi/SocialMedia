import api, { ENDPOINTS } from "@shared/api";
import type {
  UniversityInfo,
  UniversityPeer,
  UniversityStats,
  UpdateUniversityInfoPayload,
} from "./types";

export async function updateUniversityInfo(
  payload: UpdateUniversityInfoPayload,
): Promise<UniversityInfo> {
  const response = await api.post(
    `${ENDPOINTS.ACCOUNT}/UpdateUniversityInfo`,
    payload,
  );
  return response.data;
}

export async function clearUniversityInfo(): Promise<string> {
  const response = await api.delete(`${ENDPOINTS.ACCOUNT}/ClearUniversityInfo`);
  return response.data;
}

export async function getUniversityPeers(
  universityDomain?: string,
  facultyCode?: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<UniversityPeer[]> {
  const params = new URLSearchParams();
  if (universityDomain) params.set("universityDomain", universityDomain);
  if (facultyCode) params.set("facultyCode", facultyCode);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const response = await api.get(
    `${ENDPOINTS.ACCOUNT}/GetUniversityPeers?${params}`,
  );
  return response.data;
}

export async function getUniversityStats(): Promise<UniversityStats> {
  const response = await api.get(`${ENDPOINTS.ACCOUNT}/GetUniversityStats`);
  return response.data;
}

export async function updateInterests(
  interests: string[],
): Promise<{ interests: string[] }> {
  const response = await api.post(`${ENDPOINTS.ACCOUNT}/UpdateInterests`, {
    interests,
  });
  return response.data;
}

export async function getUniversityPosts(
  universityDomain: string,
  facultyCode?: string,
  page: number = 1,
  pageSize: number = 30,
): Promise<unknown[]> {
  const params = new URLSearchParams();
  params.set("universityDomain", universityDomain);
  if (facultyCode) params.set("facultyCode", facultyCode);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  const response = await api.get(`${ENDPOINTS.BLOG}/GetByUniversity?${params}`);
  return response.data;
}
