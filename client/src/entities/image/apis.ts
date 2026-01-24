import api, { ENDPOINTS } from "@shared/api";
import axios from "axios";
import { UploadUrlModel } from "./interfaces";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!;

async function getSignedImageUrl(key: string): Promise<string> {
  const url = `${BASE}/images/download-url?key=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error fetching signed URL: ${res.status}`);
  const { url: signedUrl } = await res.json();
  return signedUrl;
}

async function fetchImageAsBlobURL(key: string): Promise<string> {
  const signedUrl = await getSignedImageUrl(key);
  const res = await fetch(signedUrl);
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

const getUploadUrl = async (fileName: string): Promise<UploadUrlModel> => {
  const response = await api.get(`${ENDPOINTS.IMAGES}/upload-url`, {
    params: { fileName },
  });
  return response?.data;
};

const getUploadLogoUrl = async (fileName: string): Promise<UploadUrlModel> => {
  const response = await api.get(`${ENDPOINTS.IMAGES}/upload-url/logo`, {
    params: { fileName },
  });
  return response?.data;
};

async function saveFileIntoBlob(
  file: File,
  uploadUrl: string,
  contentType: string
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });
}

export { fetchImageAsBlobURL, getUploadUrl, saveFileIntoBlob, getUploadLogoUrl };
