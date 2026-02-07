import { useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Backdrop, Box, Slide } from "@mui/material";
import { createPost } from "@entities/blog-post";
import CloseIcon from "@assets/shared/close.svg";
import UploadFile from "@shared/ui/upload-file";
import TextArea from "@shared/ui/text-area";
import { useFileUpload } from "@shared/lib/hooks/useFileUpload";
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
  const [postError, setPostError] = useState<string | null>(null);
  const intl = useIntl();

  const {
    file,
    previewUrl,
    fileType,
    isUploading,
    error,
    handleFileSelect,
    uploadFile,
    clearState,
  } = useFileUpload({
    onUploadComplete: async (result) => {
      try {
        await createPost({
          description,
          mediaKey: result.mediaKey,
          mediaType: result.mediaType,
          mediaContentType: result.mediaContentType,
          parentId,
        });
        handleClose();
      } catch (err) {
        let errorMessage = "Failed to create post";
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
        setPostError(errorMessage);
        console.error(err);
      }
    },
  });

  const handleClose = () => {
    setDescription("");
    setPostError(null);
    clearState();
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!file) return;
    setPostError(null);
    await uploadFile();
  };

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
                onUpload={handleFileSelect}
                previewUrl={previewUrl}
                setPreviewUrl={() => {}}
                setFile={() => {}}
                fileType={fileType}
              />
              {(error || postError) && (
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
                  {error || postError}
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
