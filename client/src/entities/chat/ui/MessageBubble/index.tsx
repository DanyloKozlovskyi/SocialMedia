import React, { useState, useEffect } from "react";
import { UserLogo } from "@core-components/user-logo";
import { fetchImageAsBlobURL } from "@entities/image";
import { getSignedVideoUrl } from "@entities/video";
import { Message } from "../../model/types";
import classes from "./MessageBubble.module.scss";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
}) => {
  const [mediaSrc, setMediaSrc] = useState<string | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (!message.mediaKey || !message.mediaType) {
      setMediaSrc(null);
      return;
    }

    if (message.mediaType === "video") {
      getSignedVideoUrl(message.mediaKey)
        .then((url: string) => {
          setMediaSrc(url);
        })
        .catch((err) => {
          console.error("Failed to load video URL:", err);
          setMediaSrc(null);
        });
    } else if (message.mediaType === "image") {
      fetchImageAsBlobURL(message.mediaKey)
        .then((url: string) => {
          setMediaSrc(url);
        })
        .catch((err) => {
          console.error("Failed to load image:", err);
          setMediaSrc(null);
        });
    }

    return () => {
      if (mediaSrc && message.mediaType === "image") {
        URL.revokeObjectURL(mediaSrc);
      }
    };
  }, [message.mediaKey, message.mediaType]);

  return (
    <div
      className={`${classes.messageContainer} ${isOwn ? classes.outgoing : classes.incoming}`}
    >
      {!isOwn && message.sender?.logoKey && (
        <UserLogo
          className={classes.avatar}
          logoKey={message.sender.logoKey}
          size={32}
        />
      )}

      <div
        className={`${classes.bubble} ${isOwn ? classes.outgoing : classes.incoming}`}
      >
        {message.content && (
          <div className={classes.content}>{message.content}</div>
        )}

        {message.mediaKey && message.mediaType === "image" && mediaSrc && (
          <div className={classes.media}>
            <img src={mediaSrc} alt="Shared image" />
          </div>
        )}

        {message.mediaKey && message.mediaType === "video" && mediaSrc && (
          <div className={classes.media}>
            <video controls src={mediaSrc} />
          </div>
        )}

        <div className={classes.timestamp}>{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
};
