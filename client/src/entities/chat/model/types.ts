export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content?: string;
  mediaKey?: string;
  mediaContentType?: string;
  mediaType?: "image" | "video" | "audio";
  createdAt: string;
  isRead: boolean;
  sender?: {
    id: string;
    name?: string;
    logoKey?: string;
  };
  receiver?: {
    id: string;
    name?: string;
    logoKey?: string;
  };
}

export interface Conversation {
  userId: string;
  userName?: string;
  userLogoKey?: string;
  lastMessage?: Message;
  unreadCount: number;
}

import { HubConnection } from "@microsoft/signalr";

export interface ChatState {
  connection: HubConnection | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
}
