import api from "@shared/api/interceptor-api";
import { Message, Conversation } from "../model/types";

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get("/messages/conversations");
    return response.data;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await api.get(`/messages/conversation/${conversationId}`);
    return response.data;
  },

  async startConversation(
    otherUserId: string,
  ): Promise<{ conversationId: string }> {
    const response = await api.post(
      "/messages/conversation/start",
      otherUserId,
    );
    return response.data;
  },

  async createGroupConversation(
    name: string,
    participantIds: string[],
  ): Promise<{ conversationId: string }> {
    const response = await api.post("/messages/conversation/group", {
      name,
      participantIds,
    });
    return response.data;
  },
};
