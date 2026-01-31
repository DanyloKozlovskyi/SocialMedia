import axios from 'axios';
import { Message, Conversation } from '../model/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const chatApi = {
  async getConversations(token: string): Promise<Conversation[]> {
    const response = await axios.get(`${API_URL}/api/messages/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getConversation(otherUserId: string, token: string): Promise<Message[]> {
    const response = await axios.get(`${API_URL}/api/messages/conversation/${otherUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
