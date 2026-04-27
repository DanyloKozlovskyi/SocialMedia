export interface StartUploadResponse {
  uploadUrl: string;
  storageKey: string;
}

export interface CompleteUploadResponse {
  id: string;
  storageKey: string;
  mediaType: string;
  mediaContentType: string;
}

export interface VideoPost {
  id: string;
  userId: string;
  storageKey: string;
  contentType: string;
  size: number;
  title?: string;
  description?: string;
  createdAt: string;
}
