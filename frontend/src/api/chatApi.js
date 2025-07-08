import { apiClient } from './apiClient';

export const chatApi = {
  getMessages: async (userId) => {
    const response = await apiClient.get(`/chat/messages/${userId}`);
    return { data: response };
  },

  sendMessage: async (messageData) => {
    const response = await apiClient.post('/chat/send', messageData);
    return { data: response };
  },

  getChatMembers: async () => {
    const response = await apiClient.get('/chat/chat-members');
    return { data: response };
  },
};
