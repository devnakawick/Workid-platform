import api from './api';

const BASE_MESSAGES = '/api/messages';

export const messageService = {
    sendMessage: (senderId, receiverId, content, conversationId = null) =>
        api.post(`${BASE_MESSAGES}/send`, {
            sender_id: senderId,
            receiver_id: receiverId,
            content,
            conversation_id: conversationId,
        }),

    getConversations: (userId) =>
        api.get(`${BASE_MESSAGES}/conversations`, {
            params: { user_id: userId },
        }),

    getConversation: (conversationId) =>
        api.get(`${BASE_MESSAGES}/${conversationId}`),
};

export default messageService;
