import React, { useState, useRef, KeyboardEvent } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { getUploadUrl, saveFileIntoBlob } from "@entities/image";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { key, uploadUrl } = await getUploadUrl(file.name);
      await saveFileIntoBlob(file, uploadUrl, file.type);

      const mediaType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "audio";

      onSendMessage(undefined, key, file.type, mediaType);
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
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
          ref={textareaRef}
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
          accept="image/*,video/*"
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
  );
};
