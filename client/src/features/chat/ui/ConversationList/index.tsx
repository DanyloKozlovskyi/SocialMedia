import React from "react";
import { ConversationItem } from "@entities/chat/ui/ConversationItem";
import { Conversation } from "@entities/chat";
import classes from "./ConversationList.module.scss";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => {
  return (
    <div className={classes.conversationList}>
      <div className={classes.header}>Messages</div>

      <div className={classes.list}>
        {conversations.length === 0 ? (
          <div className={classes.empty}>No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation.conversationId}
              conversation={conversation}
              isActive={conversation.conversationId === activeConversationId}
              onClick={() => onSelectConversation(conversation.conversationId)}
            />
          ))
        )}
      </div>
    </div>
  );
};
