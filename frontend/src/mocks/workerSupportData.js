// Simulate API delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const FAQ_CATEGORIES = [
    { id: 'all', label: 'All Topics' },
    { id: 'account', label: 'Account' },
    { id: 'payments', label: 'Payments' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'workers', label: 'Profile' },
    { id: 'general', label: 'General' },
];

export const MOCK_FAQS = [
    { id: 101, category: 'account', tags: ['profile', 'skills'], question: 'How do I update my skills?', answer: 'Go to "Learning & Skills" in the sidebar to add new skills or take badges.' },
    { id: 102, category: 'account', tags: ['password', 'reset'], question: 'I forgot my password.', answer: 'Use the "Forgot Password" link on the login page to reset via SMS OTP.' },
    { id: 103, category: 'payments', tags: ['withdraw', 'bank'], question: 'How do I withdraw my earnings?', answer: 'Go to Wallet → Withdraw. Enter your bank details. Funds arrive in 24 hours.' },
    { id: 104, category: 'payments', tags: ['payment', 'paid'], question: 'When do I get paid?', answer: 'Payment is released to your wallet immediately after the employer marks the job as Completed.' },
    { id: 105, category: 'jobs', tags: ['apply', 'find'], question: 'How do I find jobs?', answer: 'Go to "Find Jobs" and click "Apply" on jobs that match your skills.' },
    { id: 106, category: 'jobs', tags: ['hired'], question: 'How do I know if I am hired?', answer: 'You will get a notification, and the job will appear in "My Active Jobs".' },
    { id: 107, category: 'workers', tags: ['verify', 'badge'], question: 'How do I get Verified?', answer: 'Upload your NIC and Police Report in the "Documents" page. Verification takes 48 hours.' },
    { id: 108, category: 'general', tags: ['safety', 'insurance'], question: 'Is there insurance?', answer: 'WorkID provides basic accident coverage for verified workers while on active jobs.' },
];

export const WORKER_QUICK_LINKS = [
    'Withdraw Money', 'Reset Password', 'Payment Issue',
    'Verification Badge', 'Job Status', 'Update Skills',
];

export const INITIAL_BOT_MESSAGE = {
    id: 1, from: 'bot', text: "Hi there! 👋 I'm your WorkID assistant. Need help finding a job or getting paid?",
};

// Chat rules for Workers
const CHAT_RULES = [
    { keywords: ['hi', 'hello'], replies: ['Hello! 👋 Ready to find some work today?'] },
    { keywords: ['withdraw', 'cash out'], replies: ['You can withdraw funds from the "Wallet" page. It takes about 24 hours to reach your bank.'] },
    { keywords: ['payment', 'paid'], replies: ['You get paid as soon as the employer marks the job as "Completed".'] },
    { keywords: ['job', 'apply'], replies: ['Check the "Find Jobs" page to see what is available near you.'] },
    { keywords: ['verify', 'badge'], replies: ['Upload your NIC in the "Documents" section to get the blue verified badge!'] },
    { keywords: ['thank', 'thanks'], replies: ["You're welcome! Happy working! 🛠️"] },
];

// Mock support tickets
export const mockTickets = [
    { id: 'TKT-8821', category: 'payment', subject: 'Withdrawal not received', message: 'Requested withdrawal yesterday.', status: 'open', createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
];

// API: Get FAQs
export const getFAQsAPI = async (category = 'all') => {
    await delay(400);
    const data = category === 'all'
        ? [...MOCK_FAQS]
        : MOCK_FAQS.filter(f => f.category === category);
    return { success: true, data };
};

// API: Submit Ticket
export const submitTicketAPI = async ({ subject, category, message }) => {
    await delay(800);
    if (!subject?.trim() || !message?.trim()) return { success: false, error: 'Required fields missing' };

    const newTicket = {
        id: `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
        category: category || 'other',
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        createdAt: new Date().toISOString(),
    };
    mockTickets.unshift(newTicket);
    return { success: true, data: newTicket, message: `Ticket ${newTicket.id} submitted!` };
};

// API: Chat Bot
export const sendChatMessageAPI = async (userMessage) => {
    await delay(1000);
    if (!userMessage?.trim()) return { success: false, error: 'Empty message' };

    let reply = "I'm not sure. Could you give more details or open a ticket? 🤔";
    const msg = userMessage.toLowerCase().trim();

    for (const rule of CHAT_RULES) {
        if (rule.keywords.some(k => msg.includes(k))) {
            reply = rule.replies[Math.floor(Math.random() * rule.replies.length)];
            break;
        }
    }

    return {
        success: true,
        data: { id: Date.now(), from: 'bot', text: reply },
    };
};