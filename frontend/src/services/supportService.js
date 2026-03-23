import api from './api';

const BASE_SUPPORT = '/api/support';

export const supportService = {
    createTicket: (userId, subject, message) =>
        api.post(`${BASE_SUPPORT}/tickets`, null, {
            params: { user_id: userId, subject, message },
        }),

    getTickets: (userId) =>
        api.get(`${BASE_SUPPORT}/tickets`, {
            params: { user_id: userId },
        }),

    updateTicket: (ticketId, status) =>
        api.put(`${BASE_SUPPORT}/tickets/${ticketId}`, null, {
            params: { status },
        }),
};

export default supportService;
