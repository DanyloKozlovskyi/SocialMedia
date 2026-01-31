"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "@shared/api";
import { getUserId } from "@entities/user/helpers";
import { useChatStore } from "@features/chat/model/store";
import { ConversationList } from "@features/chat/ui/ConversationList";
import { ChatWindow } from "@features/chat/ui/ChatWindow";
import classes from "./chat.module.scss";

export default function ChatPage() {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const {
    connection,
    conversations,
    activeConversationId,
    messages,
    isLoading,
    initializeConnection,
    disconnectConnection,
    selectConversation,
    sendMessage,
    loadConversations,
  } = useChatStore();

  useEffect(() => {
    const loadAuthData = async () => {
      const accessToken = getCookie("access_token");
      if (accessToken) {
        const tokenValue = accessToken.split(" ")[1];
        setToken(tokenValue);

        const id = await getUserId();
        setUserId(id);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    if (token && !connection) {
      initializeConnection(token);
      loadConversations();
    }

    return () => {
      if (connection) {
        disconnectConnection();
      }
    };
  }, [
    token,
    connection,
    initializeConnection,
    loadConversations,
    disconnectConnection,
  ]);

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
  const otherParticipant = activeConversation?.participants[0];

  return (
    <div className={classes.chatPage}>
      <div className={classes.sidebar}>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className={classes.mainChat}>
        {activeConversationId ? (
          <ChatWindow
            messages={messages}
            currentUserId={userId}
            otherUser={
              otherParticipant
                ? {
                    id: otherParticipant.userId,
                    name: otherParticipant.name,
                    logoKey: otherParticipant.logoKey,
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
