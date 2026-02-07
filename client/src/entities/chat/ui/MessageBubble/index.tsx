import React from "react";
import { UserLogo } from "@core-components/user-logo";
import LightboxImage from "@shared/ui/lightbox-image";
import VideoPlayer from "@shared/ui/video-player";
import { useMedia } from "@entities/media/lib/useMedia";
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
  const { mediaSrc } = useMedia(
    message.mediaKey || null,
    (message.mediaType as "image" | "video") || null,
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

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
          <LightboxImage
            className={classes.mediaImage}
            src={mediaSrc}
            alt="Shared image"
            width={300}
          />
        )}

        {message.mediaKey && message.mediaType === "video" && mediaSrc && (
          <VideoPlayer src={mediaSrc} className={classes.media} />
        )}

        <div className={classes.timestamp}>{formatTime(message.createdAt)}</div>
      </div>
    </div>
  );
};
