import React, { useEffect, useMemo, useRef, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { UserLogo } from "@core-components/user-logo";
import { MessageBubble } from "@entities/chat/ui/MessageBubble";
import { ChatInput } from "../ChatInput";
import { DateSeparator } from "../DateSeparator";
import { CalendarModal } from "../CalendarModal";
import { Message } from "@entities/chat";
import { groupMessagesByDate } from "../../lib/groupMessagesByDate";
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
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const chatItems = useMemo(() => groupMessagesByDate(messages), [messages]);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const prevMessageCount = useRef(0);
  const userHasScrolled = useRef(false);

  const handleScroll = () => {
    const container = messagesAreaRef.current;
    if (!container || !isLayoutReady) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom > 50) {
      if (!userHasScrolled.current) {
        console.log(
          `DEBUG: User scrolled away from bottom. Distance: ${distanceFromBottom}`,
        );
      }
      userHasScrolled.current = true;
    } else {
      userHasScrolled.current = false;
    }
  };

  useEffect(() => {
    const container = messagesAreaRef.current;
    if (!container || messages.length === 0) return;

    console.log(
      `DEBUG: useEffect triggered. messages.length=${messages.length}, prevCount=${prevMessageCount.current}, userHasScrolled=${userHasScrolled.current}`,
    );

    if (prevMessageCount.current === 0) {
      let lastHeight = 0;
      let stableCount = 0;

      const finalize = () => {
        console.log(
          `DEBUG: finalize() called. scrollHeight=${container.scrollHeight}`,
        );
        container.scrollTop = container.scrollHeight;
        setIsLayoutReady(true);
      };

      const intervalId = setInterval(() => {
        if (container.scrollHeight === lastHeight) {
          stableCount++;
        } else {
          stableCount = 0;
          lastHeight = container.scrollHeight;
        }

        if (stableCount >= 3) {
          clearInterval(intervalId);
          finalize();
        }
      }, 50);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        finalize();
      }, 2000);

      prevMessageCount.current = messages.length;

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }

    if (messages.length > prevMessageCount.current) {
      console.log(
        `DEBUG: New message detected. userHasScrolled=${userHasScrolled.current}`,
      );
      if (!userHasScrolled.current) {
        console.log("DEBUG: Scrolling to bottom for new message.");
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      } else {
        console.log("DEBUG: Skipping scroll — user has scrolled away.");
      }
    }

    prevMessageCount.current = messages.length;
  }, [messages, isLayoutReady]);

  const handleDateSelect = (selectedDate: Dayjs) => {
    setIsLayoutReady(true);
    setCalendarOpen(false);

    requestAnimationFrame(() => {
      const targetMessage = messages.find((m) => {
        const messageDate = dayjs(m.createdAt);
        return !messageDate.isBefore(selectedDate, "day");
      });

      if (targetMessage) {
        const element = messageRefs.current.get(targetMessage.id);
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const container = messagesAreaRef.current;
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    });
  };

  return (
    <div className={classes.chatWindow}>
      <CalendarModal
        open={isCalendarOpen}
        onClose={() => setCalendarOpen(false)}
        onDateSelect={handleDateSelect}
      />
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

      <div
        className={classes.messagesArea}
        ref={messagesAreaRef}
        onScroll={handleScroll}
      >
        {isLoading ? (
          <div className={classes.loading}>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className={classes.empty}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {!isLayoutReady && (
              <div className={classes.loading}>Loading messages...</div>
            )}
            <div style={{ visibility: isLayoutReady ? "visible" : "hidden" }}>
              {chatItems.map((item, index) => {
                if ("type" in item && item.type === "date-separator") {
                  return (
                    <DateSeparator
                      key={`date-${index}`}
                      date={item.date}
                      onClick={() => setCalendarOpen(true)}
                    />
                  );
                }
                const message = item as Message;
                return (
                  <div
                    key={message.id}
                    ref={(el) => {
                      messageRefs.current.set(message.id, el);
                    }}
                  >
                    <MessageBubble
                      message={message}
                      isOwn={message.senderId === currentUserId}
                      currentUserId={currentUserId}
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ChatInput onSendMessage={onSendMessage} disabled={!otherUser} />
    </div>
  );
};
