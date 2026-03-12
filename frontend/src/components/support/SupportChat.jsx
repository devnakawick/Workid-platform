import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// Chat data and API from mock data file
import { INITIAL_BOT_MESSAGE, sendChatMessageAPI } from '../../mocks/supportData';

// Chat modal — shows message list and input box
const ChatWidget = ({ onClose }) => {

  // Seed with initial bot greeting
  const [messages, setMessages] = useState([INITIAL_BOT_MESSAGE]);
  const [input,    setInput]    = useState('');
  const [typing,   setTyping]   = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message whenever messages or typing changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // Add user message immediately
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text }]);
    setInput('');
    setTyping(true);

    // Call mock API — returns bot reply after delay
    const result = await sendChatMessageAPI(text);
    setTyping(false);

    if (result.success) {
      setMessages(prev => [...prev, result.data]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col" style={{ height: '560px' }}>

        {/* Chat header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white">WorkID Support</p>
              <div className="flex items-center gap-1.5">
                {/* Online status dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <p className="text-xs text-blue-200">Online · ~2 min wait</p>
              </div>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* User messages — blue right, bot messages — white left */}
              <div
                className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-sm shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing indicator — three bouncing dots while bot is replying */}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'   }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Invisible scroll anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Message input with send button */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Floating chat button — listens for open-support-chat custom event
const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Allow external buttons to open the chat via custom event
  useEffect(() => {
    const handler = () => setIsOpen(true);
    document.addEventListener('open-support-chat', handler);
    return () => document.removeEventListener('open-support-chat', handler);
  }, []);

  return (
    <>
      {/* Floating button — hidden while modal is open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open live chat"
          className="fixed bottom-24 lg:bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-6 h-6" />
          {/* Pulsing ring to draw attention */}
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30 pointer-events-none" />
        </button>
      )}

      {/* Chat modal */}
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default SupportChat;