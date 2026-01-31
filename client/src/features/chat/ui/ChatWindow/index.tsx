import React, { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { UserLogo } from "@core-components/user-logo";
import { MessageBubble } from "@entities/chat/ui/MessageBubble";
import { ChatInput } from "../ChatInput";
import { Message } from "@entities/chat";
import classes from "./ChatWindow.module.scss";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  otherUser?: {
    id: string;
    name?: string;
    logoKey?: string;
  };
  isLoading: boolean;
  onSendMessage: (
    content?: string,
    mediaKey?: string,
    mediaContentType?: string,
    mediaType?: string,
  ) => void;
  onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  currentUserId,
  otherUser,
  isLoading,
  onSendMessage,
  onClose,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classes.chatWindow}>
      {otherUser && (
        <div className={classes.header}>
          <UserLogo
            className={classes.avatar}
            logoKey={otherUser.logoKey || null}
            size={40}
          />

          <div className={classes.userInfo}>
            <div className={classes.userName}>
              {otherUser.name || "Unknown User"}
            </div>
            <div className={classes.status}>Active</div>
          </div>

          {onClose && (
            <button
              className={classes.closeButton}
              onClick={onClose}
              type="button"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      <div className={classes.messagesArea}>
        {isLoading ? (
          <div className={classes.loading}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className={classes.empty}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
                currentUserId={currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <ChatInput onSendMessage={onSendMessage} disabled={!otherUser} />
    </div>
  );
};
