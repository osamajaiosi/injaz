import api from './apiConfig';

/**
 * Student Messages API Services
 */
export const studentMessagesApi = {
  /**
   * Get all messages for the student
   * @returns {Promise} Promise with student messages
   */
  getMessages: async () => {
    const response = await api.get('/studentMessages');
    return response.data.messages;
  },

  /**
   * Get unread messages count
   * @returns {Promise<number>} Promise with unread messages count
   */
  getUnreadCount: async () => {
    const response = await api.get('/studentMessages');
    return response.data.messages.filter(msg => !msg.isRead).length;
  },

  /**
   * Mark a message as read
   * @param {string} messageId - ID of the message
   * @returns {Promise} Promise with response
   */
  markAsRead: async (messageId) => {
    // In a real API, we would update just the one message
    // This is a mock implementation
    return api.put('/studentMessages', { 
      messageId,
      operation: 'markAsRead' 
    });
  },

  /**
   * Send a new message
   * @param {Object} messageData - Message data
   * @returns {Promise} Promise with response
   */
  sendMessage: async (messageData) => {
    return api.post('/studentMessages', { message: messageData });
  }
};