import { HubConnection } from "@microsoft/signalr";

export interface Message {
  id: string;
  senderId: string;
  conversationId: string;
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
}

export interface ConversationParticipant {
  userId: string;
  name?: string;
  logoKey?: string;
  logoContentType?: string;
}

export interface Conversation {
  conversationId: string;
  lastMessage?: Message;
  participants: ConversationParticipant[];
  unreadCount: number;
}

export interface ChatState {
  connection: HubConnection | null;
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isConnected: boolean;
  isLoading: boolean;
}
