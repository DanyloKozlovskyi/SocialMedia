import { useState, useEffect } from "react";
import { getUploadUrl, saveFileIntoBlob } from "@entities/image";
import {
  startVideoUpload,
  completeVideoUpload,
  uploadVideoToR2,
  validateVideoFile,
  ALLOWED_CONTENT_TYPE,
} from "@entities/video";

interface UploadResult {
  mediaKey: string;
  mediaContentType?: string;
  mediaType: "image" | "video";
}

interface UseFileUploadOptions {
  onUploadComplete?: (result: UploadResult) => void;
}

export const useFileUpload = ({
  onUploadComplete,
}: UseFileUploadOptions = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const clearState = () => {
    setFile(null);
    setFileType(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedFile) {
      clearState();
      return;
    }

    if (selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setFileType("image");
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type === "video/mp4") {
      const validation = validateVideoFile(selectedFile);
      if (!validation.valid) {
        setError(validation.error || "Invalid video file");
        clearState();
        return;
      }
      setFile(selectedFile);
      setFileType("video");
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setError("Please select an image or MP4 video");
      clearState();
    }
  };

  const uploadFile = async () => {
    if (!file || !fileType) return;

    setIsUploading(true);
    setError(null);

    try {
      let result: UploadResult;
      if (fileType === "video") {
        const { uploadUrl, storageKey } = await startVideoUpload(
          file.name,
          file.size,
          ALLOWED_CONTENT_TYPE,
        );
        await uploadVideoToR2(file, uploadUrl, ALLOWED_CONTENT_TYPE);
        const { mediaContentType } = await completeVideoUpload(
          storageKey,
          undefined,
          undefined,
        );
        result = {
          mediaKey: storageKey,
          mediaType: "video",
          mediaContentType,
        };
      } else {
        const { uploadUrl, key, contentType } = await getUploadUrl(file.name);
        await saveFileIntoBlob(file, uploadUrl, contentType);
        result = {
          mediaKey: key,
          mediaType: "image",
          mediaContentType: contentType,
        };
      }

      onUploadComplete?.(result);
      clearState();
    } catch (err) {
      let errorMessage = "Upload failed";
      if (err && typeof err === "object") {
        const error = err as Record<string, unknown>;
        if (error.response && typeof error.response === "object") {
          const response = error.response as Record<string, unknown>;
          if (response.data && typeof response.data === "object") {
            const data = response.data as Record<string, unknown>;
            errorMessage = String(data.error) || errorMessage;
          }
        } else if (error.message) {
          errorMessage = String(error.message);
        }
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    file,
    setFile,
    previewUrl,
    setPreviewUrl,
    fileType,
    isUploading,
    error,
    handleFileSelect,
    uploadFile,
    clearState,
  };
};
