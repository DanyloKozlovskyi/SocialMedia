"use client";

import React, { useEffect, useState } from "react";
import { getUserId } from "@entities/user/helpers";
import { useChatStore } from "@features/chat/model/store";
import { ConversationList } from "@features/chat/ui/ConversationList";
import { ChatWindow } from "@features/chat/ui/ChatWindow";
import { UserSearch } from "@features/chat/ui/UserSearch";
import { GroupChatCreation } from "@features/chat/ui/GroupChatCreation";
import classes from "./chat.module.scss";

export default function ChatPage() {
  const [userId, setUserId] = useState<string>("");

  const {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    selectConversation,
    sendMessage,
  } = useChatStore();

  useEffect(() => {
    const loadAuthData = async () => {
      const id = await getUserId();
      setUserId(id);
    };

    loadAuthData();
  }, []);

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId);
  };

  const handleSendMessage = (
    content?: string,
    mediaKey?: string,
    mediaContentType?: string,
    mediaType?: string,
  ) => {
    if (activeConversationId) {
      sendMessage(
        activeConversationId,
        content,
        mediaKey,
        mediaContentType,
        mediaType,
      );
    }
  };

  const activeConversation = conversations.find(
    (c) => c.conversationId === activeConversationId,
  );

  const isGroupChat =
    activeConversation && activeConversation.participants.length > 1;
  const otherParticipant = activeConversation?.participants[0];

  const chatTitle = isGroupChat
    ? activeConversation.name ||
      `Group (${activeConversation.participants.length + 1})`
    : otherParticipant?.name || "Unknown User";

  return (
    <div className={classes.chatPage}>
      <div className={classes.sidebar}>
        <UserSearch />
        <GroupChatCreation />
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className={classes.mainChat}>
        {activeConversationId ? (
          <ChatWindow
            key={activeConversationId}
            messages={messages}
            currentUserId={userId}
            otherUser={
              !isGroupChat && otherParticipant
                ? {
                    id: otherParticipant.userId,
                    name: otherParticipant.name,
                    logoKey: otherParticipant.logoKey,
                  }
                : isGroupChat
                  ? {
                      id: "",
                      name: chatTitle,
                      logoKey: undefined,
                    }
                  : undefined
            }
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className={classes.emptyState}>
            <h2>Select a conversation to start chatting</h2>
            <p>Choose a conversation from the list to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
