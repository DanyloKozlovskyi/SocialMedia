import React from "react";
import { Conversation } from "../../model/types";
import classes from "./ConversationItem.module.scss";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getMediaUrl = (mediaKey?: string) => {
    if (!mediaKey) return "/default-avatar.png";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${apiUrl}/api/images/${mediaKey}`;
  };

  const otherParticipant = conversation.participants[0];

  return (
    <div
      className={`${classes.conversationItem} ${isActive ? classes.active : ""}`}
      onClick={onClick}
    >
      <img
        src={getMediaUrl(otherParticipant?.logoKey)}
        alt={otherParticipant?.name || "User"}
        className={classes.avatar}
      />

      <div className={classes.content}>
        <div className={classes.header}>
          <span className={classes.userName}>
            {otherParticipant?.name || "Unknown User"}
          </span>
          <span className={classes.time}>
            {formatTime(conversation.lastMessage?.createdAt)}
          </span>
        </div>

        <div className={classes.lastMessage}>
          {conversation.lastMessage?.content || "No messages yet"}
        </div>
      </div>

      {conversation.unreadCount > 0 && (
        <span className={classes.unreadBadge}>{conversation.unreadCount}</span>
      )}
    </div>
  );
};
