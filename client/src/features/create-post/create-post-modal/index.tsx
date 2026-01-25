import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { Modal, Backdrop, Box, Slide } from "@mui/material";
import { createPost } from "@entities/blog-post";
import CloseIcon from "@assets/shared/close.svg";
import UploadFile from "@shared/ui/upload-file";
import TextArea from "@shared/ui/text-area";
import { getUploadUrl, saveFileIntoBlob } from "@entities/image";
import {
  startVideoUpload,
  completeVideoUpload,
  uploadVideoToR2,
  validateVideoFile,
  ALLOWED_CONTENT_TYPE,
} from "@entities/video";
import Button from "@shared/ui/buttons/button";
import classes from "./create-post-modal.module.scss";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeout?: number;
  isClosing?: boolean;
  parentId?: string | null;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  timeout = 1000,
  isClosing = false,
  parentId = null,
}: CreatePostModalProps) => {
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intl = useIntl();

  const handleClose = () => {
    setDescription("");
    setFile(null);
    setFileType(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onClose?.();
  };
  const fetchUploadParams = async (fileName: string) => {
    const { uploadUrl, key, contentType } = await getUploadUrl(fileName);
    return { uploadUrl, key, contentType };
  };

  const uploadToBlob = async (
    file: File,
    uploadUrl: string,
    contentType: string,
  ) => {
    await saveFileIntoBlob(file, uploadUrl, contentType);
  };

  const uploadFileIntoBlob = async () => {
    if (!file) return { mediaKey: null, mediaContentType: null };

    const { uploadUrl, key, contentType } = await fetchUploadParams(file.name);
    await uploadToBlob(file, uploadUrl, contentType);

    return { mediaKey: key, mediaContentType: contentType };
  };

  const uploadVideoFile = async () => {
    if (!file)
      return {
        mediaKey: null,
        mediaType: "video" as const,
        mediaContentType: null,
      };

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

    return {
      mediaKey: storageKey,
      mediaType: "video" as const,
      mediaContentType,
    };
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      if (fileType === "video") {
        const { mediaKey, mediaType, mediaContentType } =
          await uploadVideoFile();
        await createPost({
          description,
          mediaKey,
          mediaType,
          mediaContentType,
          parentId,
        });
      } else if (fileType === "image") {
        const { mediaKey, mediaContentType } = await uploadFileIntoBlob();
        await createPost({
          description,
          mediaKey,
          mediaType: "image",
          mediaContentType,
          parentId,
        });
      }

      handleClose();
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!selectedFile) {
      setFile(null);
      setFileType(null);
      setPreviewUrl(null);
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
        setFile(null);
        setFileType(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      setFileType("video");
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setError("Please select an image or MP4 video");
      setFile(null);
      setFileType(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: timeout,
            sx: {
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              backdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
              WebkitBackdropFilter: isClosing ? "blur(0px)" : "blur(2px)",
            },
          },
        }}
        disableScrollLock={true}
      >
        <div>
          <Slide in={isOpen && !isClosing} direction="up" timeout={timeout}>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                margin: "auto",
                width: "400px",
                height: "100vh",
                bgcolor: "white",
                boxShadow: 24,
                p: 3,
                overflowY: "auto",
              }}
            >
              <CloseIcon
                className={classes.closeIcon}
                width={24}
                height={24}
                onClick={handleClose}
              />
              <UploadFile
                className={classes.uploadFile}
                onUpload={handleUpload}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                setFile={setFile}
                fileType={fileType}
              />
              {error && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#fee",
                    border: "1px solid #fcc",
                    borderRadius: "6px",
                    color: "#c33",
                    fontSize: "0.875rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}
              <div
                className={`${classes.wrapper} ${classes.textAreaContainer}`}
              >
                <label className={classes.label}>
                  {intl.formatMessage({
                    id: "add-post-modal.description",
                  })}
                </label>
                <TextArea
                  inputClassName={classes.textArea}
                  value={description || ""}
                  label="Enter description"
                  setValue={setDescription}
                />
              </div>
              <div className={classes.buttonRow}>
                <Button
                  disabled={!description.trim() || !file || isUploading}
                  onClick={handleSubmit}
                >
                  {isUploading
                    ? intl.formatMessage({
                        id: "add-post-modal.uploading",
                        defaultMessage: "Uploading...",
                      })
                    : intl.formatMessage({
                        id: "add-post-modal.enter",
                      })}
                </Button>{" "}
              </div>
            </Box>
          </Slide>
        </div>
      </Modal>
    </div>
  );
};

export { CreatePostModal };
