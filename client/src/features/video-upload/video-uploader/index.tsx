"use client";

import { useState, useRef } from "react";
import { useIntl } from "react-intl";
import {
  startVideoUpload,
  completeVideoUpload,
  uploadVideoToR2,
  validateVideoFile,
  MAX_FILE_SIZE,
  ALLOWED_CONTENT_TYPE,
} from "@entities/video";
import Button from "@shared/ui/buttons/button";
import classes from "./video-uploader.module.scss";

interface VideoUploaderProps {
  onUploadComplete?: (videoId: string) => void;
  onError?: (error: string) => void;
}

const VideoUploader = ({ onUploadComplete, onError }: VideoUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intl = useIntl();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    const validation = validateVideoFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      setFile(null);
      setPreviewUrl(null);
      onError?.(validation.error || "Invalid file");
      return;
    }

    setFile(selectedFile);
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      setUploadProgress(10);

      const { uploadUrl, storageKey } = await startVideoUpload(
        file.name,
        file.size,
        ALLOWED_CONTENT_TYPE,
      );

      setUploadProgress(30);

      await uploadVideoToR2(file, uploadUrl, ALLOWED_CONTENT_TYPE);

      setUploadProgress(70);

      const { id: videoId } = await completeVideoUpload(
        storageKey,
        title.trim() || undefined,
        description.trim() || undefined,
      );

      setUploadProgress(100);

      setTimeout(() => {
        setFile(null);
        setTitle("");
        setDescription("");
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setUploadProgress(0);
        onUploadComplete?.(videoId);
      }, 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload video";
      setError(errorMessage);
      onError?.(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={classes.container}>
      <div className={classes.uploadArea}>
        {!previewUrl ? (
          <label className={classes.uploadLabel}>
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_CONTENT_TYPE}
              onChange={handleFileSelect}
              disabled={isUploading}
              className={classes.fileInput}
            />
            <div className={classes.uploadContent}>
              <div className={classes.uploadIcon}>📹</div>
              <p className={classes.uploadText}>
                {intl.formatMessage({
                  id: "video-uploader.drag-drop",
                  defaultMessage:
                    "Drag and drop your video here or click to select",
                })}
              </p>
              <p className={classes.uploadSubtext}>
                {intl.formatMessage(
                  {
                    id: "video-uploader.file-requirements",
                    defaultMessage: "MP4 only, max {size}MB",
                  },
                  { size: MAX_FILE_SIZE / (1024 * 1024) },
                )}
              </p>
            </div>
          </label>
        ) : (
          <div className={classes.previewContainer}>
            <video
              src={previewUrl}
              controls
              className={classes.videoPreview}
              preload="metadata"
            />
            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className={classes.removeButton}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {file && (
        <div className={classes.fileInfo}>
          <p className={classes.fileName}>{file.name}</p>
          <p className={classes.fileSize}>
            {formatFileSize(file.size)} / {formatFileSize(MAX_FILE_SIZE)}
          </p>
        </div>
      )}

      {file && (
        <div className={classes.metadataSection}>
          <div className={classes.formGroup}>
            <label className={classes.label}>
              {intl.formatMessage({
                id: "video-uploader.title",
                defaultMessage: "Title (optional)",
              })}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={isUploading}
              className={classes.input}
              maxLength={100}
            />
          </div>

          <div className={classes.formGroup}>
            <label className={classes.label}>
              {intl.formatMessage({
                id: "video-uploader.description",
                defaultMessage: "Description (optional)",
              })}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              disabled={isUploading}
              className={classes.textarea}
              maxLength={500}
              rows={3}
            />
          </div>
        </div>
      )}

      {error && <div className={classes.errorMessage}>{error}</div>}

      {isUploading && (
        <div className={classes.progressContainer}>
          <div className={classes.progressBar}>
            <div
              className={classes.progressFill}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className={classes.progressText}>{uploadProgress}%</p>
        </div>
      )}

      {file && (
        <div className={classes.buttonContainer}>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className={classes.uploadButton}
          >
            {isUploading
              ? intl.formatMessage({
                  id: "video-uploader.uploading",
                  defaultMessage: "Uploading...",
                })
              : intl.formatMessage({
                  id: "video-uploader.upload",
                  defaultMessage: "Upload Video",
                })}
          </Button>
          {!isUploading && (
            <Button onClick={handleRemoveFile} className={classes.cancelButton}>
              {intl.formatMessage({
                id: "video-uploader.cancel",
                defaultMessage: "Cancel",
              })}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export { VideoUploader };
