import React, { useState, useRef, KeyboardEvent } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { useFileUpload } from "@shared/lib/hooks/useFileUpload";
import { MediaPreviewModal } from "../MediaPreviewModal";
import classes from "./ChatInput.module.scss";

interface ChatInputProps {
  onSendMessage: (
    content?: string,
    mediaKey?: string,
    mediaContentType?: string,
    mediaType?: string,
  ) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [message, setMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const pendingCaptionRef = useRef("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    file,
    previewUrl,
    fileType,
    isUploading,
    error,
    handleFileSelect: handleFileSelectFromHook,
    uploadFile,
    clearState,
  } = useFileUpload({
    onUploadComplete: (result) => {
      onSendMessage(
        pendingCaptionRef.current || undefined,
        result.mediaKey,
        result.mediaContentType,
        result.mediaType,
      );
      pendingCaptionRef.current = "";
      setIsPreviewOpen(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelectFromHook(e);
    if (e.target.files?.[0]) {
      setIsPreviewOpen(true);
    }
  };

  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    clearState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreviewSend = async (caption: string) => {
    pendingCaptionRef.current = caption;
    await uploadFile();
  };

  return (
    <>
      <div className={classes.chatInput}>
        <div className={classes.inputWrapper}>
          <button
            className={classes.attachButton}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            type="button"
          >
            <AttachFileIcon fontSize="small" />
          </button>

          <textarea
            ref={textAreaRef}
            className={classes.textarea}
            placeholder="Type a message..."
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            rows={1}
          />

          <input
            ref={fileInputRef}
            type="file"
            className={classes.fileInput}
            accept="image/*,video/mp4"
            onChange={handleFileSelect}
          />
        </div>

        <button
          className={classes.sendButton}
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          type="button"
        >
          <SendIcon fontSize="small" />
        </button>
      </div>

      <MediaPreviewModal
        isOpen={isPreviewOpen && !!file}
        onClose={handlePreviewClose}
        onSend={handlePreviewSend}
        previewUrl={previewUrl}
        fileType={fileType}
        isUploading={isUploading}
        error={error}
      />
    </>
  );
};
