import React from "react";
import { UserLogo } from "@core-components/user-logo";
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

  const isGroupChat = conversation.participants.length > 1;
  const otherParticipant = conversation.participants[0];

  const displayName = isGroupChat
    ? conversation.name || `Group (${conversation.participants.length + 1})`
    : otherParticipant?.name || "Unknown User";

  return (
    <div
      className={`${classes.conversationItem} ${isActive ? classes.active : ""}`}
      onClick={onClick}
    >
      {isGroupChat ? (
        <img
          src="/default-group-avatar.png"
          alt={displayName}
          className={classes.avatar}
        />
      ) : (
        <UserLogo
          className={classes.avatar}
          logoKey={otherParticipant?.logoKey || null}
          size={40}
        />
      )}

      <div className={classes.content}>
        <div className={classes.header}>
          <span className={classes.userName}>{displayName}</span>
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
