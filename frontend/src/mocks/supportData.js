// Simulate API delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// FAQ category list for filter tabs
export const FAQ_CATEGORIES = [
  { id: 'all',      label: 'All Topics' },
  { id: 'account',  label: 'Account'    },
  { id: 'payments', label: 'Payments'   },
  { id: 'jobs',     label: 'Jobs'       },
  { id: 'workers',  label: 'Workers'    },
  { id: 'general',  label: 'General'    },
];

// Mock FAQ data with categories and search tags
export const MOCK_FAQS = [
  { id: 1,  category: 'account',  tags: ['profile', 'update', 'account'],                       question: 'How do I update my employer profile?',     answer: 'Click your avatar in the sidebar to open your profile. Update your company name, contact details or photo and save.' },
  { id: 2,  category: 'account',  tags: ['password', 'reset password', 'forgot', 'login'],       question: 'How do I reset my password?',               answer: 'On the login page click "Forgot Password", enter your phone number and verify with the OTP you receive.' },
  { id: 3,  category: 'payments', tags: ['top up wallet', 'top up', 'add money', 'deposit'],     question: 'How do I top up my wallet?',                answer: 'Go to Employer Wallet → "Add Money". Choose Bank Transfer (BOC) or Card. Bank transfers take up to 24 hours.' },
  { id: 4,  category: 'payments', tags: ['payment issue', 'pending', 'payment', 'pay worker'],   question: 'Why is my payment showing as Pending?',     answer: 'Payments stay Pending until you confirm them in the Pay Workers screen. Once confirmed the status updates to Completed.' },
  { id: 5,  category: 'payments', tags: ['refund', 'refund request', 'cancel', 'money back'],    question: 'Can I get a refund?',                       answer: 'Yes. If a worker cancels before starting, the amount returns to your wallet within 1–2 business days.' },
  { id: 6,  category: 'jobs',     tags: ['post job', 'new job', 'create job'],                   question: 'How do I post a new job?',                  answer: 'Click "Post Job" in the sidebar, fill in the details and submit. Your job goes live immediately.' },
  { id: 7,  category: 'jobs',     tags: ['edit job', 'delete job', 'remove job', 'update job'],  question: 'How do I edit or delete a posted job?',     answer: 'Go to My Jobs, find the job card and click the pencil icon to edit or trash icon to delete.' },
  { id: 8,  category: 'jobs',     tags: ['job status', 'in progress', 'completed'],              question: 'Why does my job status show In Progress?',  answer: 'A job moves to In Progress once you hire a worker. Update it to Completed from My Jobs when the work is done.' },
  { id: 9,  category: 'workers',  tags: ['verified', 'badge', 'trusted', 'verification'],        question: 'What does the Verified badge mean?',        answer: 'Verified workers have had their NIC and background checked by WorkID for added trust.' },
  { id: 10, category: 'workers',  tags: ['hire a worker', 'hire', 'hiring', 'accept'],            question: 'How do I hire a worker?',                   answer: 'Open the application from the Applications page, review the profile and click "Hire Now".' },
  { id: 11, category: 'general',  tags: ['workid', 'about', 'platform'],                         question: 'What is WorkID?',                           answer: 'WorkID connects employers with skilled daily workers across Sri Lanka — job posting, hiring and payments in one place.' },
  { id: 12, category: 'general',  tags: ['secure', 'security', 'data', 'privacy', 'ssl'],        question: 'Is my data secure?',                        answer: 'Yes. WorkID uses 256-bit SSL encryption. Payment details are never stored on our servers.' },
];

// Quick search link shortcuts shown in the hero section
export const QUICK_LINKS = [
  'Top Up Wallet', 'Reset Password', 'Payment Issue',
  'Hire a Worker', 'Delete Job',     'Refund Request',
];

// Initial bot greeting message for the chat widget
export const INITIAL_BOT_MESSAGE = {
  id:   1,
  from: 'bot',
  text: "Hi there! 👋 I'm the WorkID support assistant. How can I help you today?",
};

// Keyword rules for the chat bot — each rule maps keywords to possible replies
const CHAT_RULES = [
  { keywords: ['hi', 'hello', 'hey'],
    replies:  ['Hello! 👋 How can I help you today?', 'Hi! What can I assist you with?'] },
  { keywords: ['thank', 'thanks'],
    replies:  ["You're welcome! 😊 Anything else I can help with?"] },
  { keywords: ['bye', 'goodbye', 'done'],
    replies:  ['Goodbye! 👋 Have a great day!'] },
  { keywords: ['wallet', 'top up', 'topup', 'add money', 'balance', 'deposit'],
    replies:  ['Go to Employer Wallet → "Add Money". Pay via Bank Transfer (BOC) or Card. Bank transfers take up to 24 hours.'] },
  { keywords: ['payment', 'pay', 'pending', 'pay worker'],
    replies:  ['Payments show as Pending until you confirm them in the Pay Workers screen. Once confirmed the worker is paid instantly.'] },
  { keywords: ['refund', 'cancel', 'money back'],
    replies:  ['Refunds are processed when a worker cancels. The amount returns to your wallet within 1–2 business days.'] },
  { keywords: ['post job', 'new job', 'create job'],
    replies:  ['Click "Post Job" in the sidebar, fill in the details and submit. Your job goes live immediately!'] },
  { keywords: ['edit job', 'delete job', 'remove job', 'update job'],
    replies:  ['Go to My Jobs, find the card and click ✏️ to edit or 🗑️ to delete.'] },
  { keywords: ['hire', 'accept', 'approve'],
    replies:  ['Open the application from the Applications page and click "Hire Now". The worker is notified immediately.'] },
  { keywords: ['verified', 'badge', 'trusted'],
    replies:  ["The Verified badge means the worker's NIC and background have been checked by WorkID."] },
  { keywords: ['password', 'reset', 'forgot', 'login'],
    replies:  ['Click "Forgot Password" on the login page, enter your phone number and verify with the OTP you receive.'] },
  { keywords: ['help', 'support', 'problem', 'issue'],
    replies:  ["I'm here to help! Could you describe your issue in more detail? 😊"] },
];

// Match user message against rules and return a random reply
const getSmartReply = (userMessage) => {
  const msg = userMessage.toLowerCase().trim();
  for (const rule of CHAT_RULES) {
    if (rule.keywords.some(k => msg.includes(k))) {
      return rule.replies[Math.floor(Math.random() * rule.replies.length)];
    }
  }
  return "I'm not sure about that. Could you rephrase, or submit a support ticket for detailed help? 🤔";
};

// Mock support tickets
export const mockTickets = [
  { id: 'TKT-10042', category: 'payment', subject: 'Wallet top-up not reflected', message: 'Bank transfer 2 days ago but balance not updated.', status: 'open',     createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'TKT-10031', category: 'job',     subject: 'Cannot delete completed job',  message: 'Delete button is greyed out on completed job.',     status: 'resolved', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
];

// Get FAQs filtered by category
export const getFAQsAPI = async (category = 'all') => {
  await delay(400);
  const data = category === 'all'
    ? [...MOCK_FAQS]
    : MOCK_FAQS.filter(f => f.category === category);
  return { success: true, data };
};

// Submit a new support ticket
export const submitTicketAPI = async ({ subject, category, message }) => {
  await delay(800);
  if (!subject?.trim() || !message?.trim())
    return { success: false, error: 'Subject and message are required' };

  // Generate a new ticket and add to top of list
  const newTicket = {
    id:        `TKT-${Math.floor(Math.random() * 90000) + 10000}`,
    category:  category || 'other',
    subject:   subject.trim(),
    message:   message.trim(),
    status:    'open',
    createdAt: new Date().toISOString(),
  };
  mockTickets.unshift(newTicket);
  return { success: true, data: newTicket, message: `Ticket ${newTicket.id} submitted!` };
};

// Get all support tickets
export const getTicketsAPI = async () => {
  await delay(500);
  return { success: true, data: [...mockTickets] };
};

// Send chat message — returns a smart bot reply
export const sendChatMessageAPI = async (userMessage) => {
  await delay(1000);
  if (!userMessage?.trim())
    return { success: false, error: 'Message cannot be empty' };
  return {
    success: true,
    data: { id: Date.now(), from: 'bot', text: getSmartReply(userMessage) },
  };
};