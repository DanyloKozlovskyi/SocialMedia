import axios from "axios";
import api, { ENDPOINTS } from "@shared/api";
import { UploadUrlModel } from "./interfaces";

async function getSignedImageUrl(key: string): Promise<string> {
  const response = await api.get(`${ENDPOINTS.IMAGES}/download-url`, {
    params: { key },
  });
  return response.data.url;
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
  contentType: string,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": contentType },
  });
}

async function fetchImageWithFallbacks(basePath: string, extensions: string[]): Promise<string> {
  let lastError: Error | null = null;
  for (const ext of extensions) {
    try {
      return await fetchImageAsBlobURL(`${basePath}.${ext}`);
    } catch (e) {
      lastError = e as Error;
      // Continue to next extension
    }
  }
  throw lastError || new Error("All fallback extensions failed");
}

export {
  fetchImageAsBlobURL,
  getUploadUrl,
  saveFileIntoBlob,
  getUploadLogoUrl,
  fetchImageWithFallbacks,
};
