import { apiClient } from './apiClient';

export const chatApi = {
  // Get all messages between current user and another user
  getMessages: async (userId) => {
    return apiClient.get(`/chat/messages/${userId}`);
  },

  // Send a message
  sendMessage: async (messageData) => {
    return apiClient.post('/chat/send', messageData);
  },

  // Get all users that the current user has chatted with
  getChatMembers: async () => {
    return apiClient.get('/chat/chat-members');
  },
};
