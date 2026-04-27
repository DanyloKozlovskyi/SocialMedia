import React, { useState, KeyboardEvent } from "react";
import { Modal, Backdrop } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import LightboxImage from "@shared/ui/lightbox-image";
import VideoPlayer from "@shared/ui/video-player";
import classes from "./MediaPreviewModal.module.scss";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (caption: string) => void;
  previewUrl: string | null;
  fileType: "image" | "video" | null;
  isUploading: boolean;
  error: string | null;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({
  isOpen,
  onClose,
  onSend,
  previewUrl,
  fileType,
  isUploading,
  error,
}) => {
  const [caption, setCaption] = useState("");

  const handleSend = () => {
    onSend(caption.trim());
    setCaption("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setCaption("");
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    >
      <div className={classes.overlay} onClick={handleClose}>
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <div className={classes.header}>
            <span className={classes.title}>
              {fileType === "video" ? "Send Video" : "Send Image"}
            </span>
            <button
              className={classes.closeButton}
              onClick={handleClose}
              type="button"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>

          <div className={classes.previewArea}>
            {previewUrl && fileType === "image" && (
              <LightboxImage
                className={classes.previewImage}
                src={previewUrl}
                alt="Preview"
                width={380}
              />
            )}
            {previewUrl && fileType === "video" && (
              <VideoPlayer
                src={previewUrl}
                className={classes.previewVideo}
              />
            )}
          </div>

          {error && <div className={classes.error}>{error}</div>}

          <div className={classes.footer}>
            <div className={classes.captionWrapper}>
              <textarea
                className={classes.captionInput}
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isUploading}
              />
            </div>
            <div className={classes.actions}>
              <button
                className={classes.cancelButton}
                onClick={handleClose}
                type="button"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className={classes.sendButton}
                onClick={handleSend}
                type="button"
                disabled={isUploading}
              >
                <SendIcon fontSize="small" />
                {isUploading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
