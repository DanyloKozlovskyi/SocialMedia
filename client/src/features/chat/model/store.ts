import { create } from "zustand";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatState, Message, chatApi } from "@entities/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ChatStore extends ChatState {
  initializeConnection: (token: string) => Promise<void>;
  disconnectConnection: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  startConversation: (otherUserId: string) => Promise<string | null>;
  sendMessage: (
    conversationId: string,
    content?: string,
    mediaKey?: string,
    mediaContentType?: string,
    mediaType?: string,
  ) => Promise<void>;
  loadConversations: () => Promise<void>;
  receiveMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  connection: null,
  conversations: [],
  activeConversationId: null,
  messages: [],
  isConnected: false,
  isLoading: false,

  initializeConnection: async (token: string) => {
    const { connection } = get();

    if (connection) {
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/hubs/chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    newConnection.on("ReceiveMessage", (message: Message) => {
      get().receiveMessage(message);
    });

    try {
      await newConnection.start();
      set({ connection: newConnection, isConnected: true });
    } catch (error) {
      console.error("SignalR connection error:", error);
    }
  },

  disconnectConnection: async () => {
    const { connection } = get();
    if (connection) {
      await connection.stop();
      set({ connection: null, isConnected: false });
    }
  },

  selectConversation: async (conversationId: string) => {
    set({ isLoading: true, activeConversationId: conversationId });
    try {
      const messages = await chatApi.getMessages(conversationId);
      set({ messages, isLoading: false });
    } catch (error) {
      console.error("Error loading conversation:", error);
      set({ isLoading: false });
    }
  },

  startConversation: async (otherUserId: string) => {
    try {
      const result = await chatApi.startConversation(otherUserId);
      await get().loadConversations();
      return result.conversationId;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    }
  },

  sendMessage: async (
    conversationId: string,
    content?: string,
    mediaKey?: string,
    mediaContentType?: string,
    mediaType?: string,
  ) => {
    const { connection } = get();
    if (!connection) {
      console.error("No connection established");
      return;
    }

    try {
      await connection.invoke(
        "SendMessage",
        conversationId,
        content,
        mediaKey,
        mediaContentType,
        mediaType,
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  loadConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await chatApi.getConversations();
      set({ conversations, isLoading: false });
    } catch (error) {
      console.error("Error loading conversations:", error);
      set({ isLoading: false });
    }
  },

  receiveMessage: (message: Message) => {
    const { activeConversationId, messages } = get();

    if (message.conversationId === activeConversationId) {
      set({ messages: [...messages, message] });
    }

    set((state) => {
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.conversationId === message.conversationId) {
          return {
            ...conv,
            lastMessage: message,
            unreadCount: conv.unreadCount + 1,
          };
        }
        return conv;
      });
      return { conversations: updatedConversations };
    });
  },
}));
