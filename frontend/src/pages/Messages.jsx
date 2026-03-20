import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Search, Send, Clock, Star, MailOpen, Briefcase, MapPin, Banknote, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const initialConversations = [
    {
        id: 1,
        sender: "S. Fernando",
        preview: "The pipe in my bathroom is leaking again. Can you come at 10 AM?",
        time: "10:35 AM",
        unread: true,
        typing: true,
        messages: [
            { id: 1, text: "Hello there! I need a small pipe repair in my bathroom. Are you available today around 11:30 AM?", sender: "Fernando", time: "10:32 AM", sent: false }
        ]
    },
    {
        id: 2,
        sender: "T. Perera",
        preview: "Thank you for the excellent service! I'll leave a review.",
        time: "9:20 AM",
        unread: false,
        messages: [
            { id: 1, text: "Thank you for the excellent service! I'll leave a review.", sender: "Perera", time: "9:20 AM", sent: false }
        ]
    },
    {
        id: 3,
        sender: "N. Silva",
        preview: "How much would you charge for a full kitchen installation?",
        time: "Yesterday",
        unread: true,
        messages: [
            { id: 1, text: "How much would you charge for a full kitchen installation?", sender: "Silva", time: "Yesterday", sent: false }
        ]
    }
];

export default function Messages() {
    const { updateUser } = useAuth();
    
    // Load from local storage
    const getInitialConversations = () => {
        const stored = localStorage.getItem('mock_messages');
        if (stored) {
            try {
                return [...JSON.parse(stored), ...initialConversations];
            } catch (e) { }
        }
        return initialConversations;
    };

    const [conversations, setConversations] = useState(getInitialConversations());
    const [activeChatId, setActiveChatId] = useState(conversations[0]?.id || 1);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Sync unread count with global AuthContext
    useEffect(() => {
        const unreadCount = conversations.filter(c => c.unread).length;
        updateUser({ messagesCount: unreadCount });
    }, [conversations]);

    const activeChat = conversations.find(c => c.id === activeChatId);

    const sendMessage = (text) => {
        if (!text.trim()) return;

        const updatedConversations = conversations.map(c => {
            if (c.id === activeChatId) {
                // Update the original message if it was an invite to show it was responded to? (optional, skip for now)
                
                return {
                    ...c,
                    preview: text,
                    messages: [
                        ...c.messages,
                        {
                            id: Date.now(),
                            text: text,
                            sender: "Me",
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            sent: true
                        }
                    ]
                };
            }
            return c;
        });

        setConversations(updatedConversations);
        
        // Update local storage
        localStorage.setItem('mock_messages', JSON.stringify(updatedConversations));
        
        setNewMessage('');
        toast.success("Message sent!");

        // Simulate a reply after 2 seconds
        setTimeout(() => {
            setConversations(prev => {
                const nextConvos = prev.map(c => {
                    if (c.id === activeChatId) {
                        return {
                            ...c,
                            typing: false,
                            messages: [
                                ...c.messages,
                                {
                                    id: Date.now(),
                                    text: "Thanks for the response! I'll get back to you soon.",
                                    sender: c.sender,
                                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    sent: false
                                }
                            ]
                        };
                    }
                    return c;
                });
                localStorage.setItem('mock_messages', JSON.stringify(nextConvos));
                return nextConvos;
            });
        }, 2000);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        sendMessage(newMessage);
    };

    const handleInviteResponse = (msgId, action) => {
        // Mark the invite message as responded to
        setConversations(prev => {
            const nextConvos = prev.map(c => {
                if (c.id === activeChatId) {
                    return {
                        ...c,
                        messages: c.messages.map(m => m.id === msgId ? { ...m, inviteResponded: true } : m)
                    };
                }
                return c;
            });
            localStorage.setItem('mock_messages', JSON.stringify(nextConvos));
            return nextConvos;
        });

        const reply = action === 'accept'
            ? "I accept your invitation! Let's discuss the details."
            : "Thank you for the invitation, but I am currently unavailable.";
            
        setTimeout(() => sendMessage(reply), 100);
    };

    const handleChatSelect = (id) => {
        setActiveChatId(id);
        setConversations(conversations.map(c =>
            c.id === id ? { ...c, unread: false } : c
        ));
    };

    const filteredConversations = conversations.filter(c =>
        c.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] flex gap-6 pb-10">
            {/* Sidebar - Contacts List */}
            <div className="w-96 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-50 bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                    {filteredConversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={`p-6 flex gap-4 cursor-pointer transition-all hover:bg-blue-50/20 group relative ${chat.unread ? 'bg-blue-50/10' : ''} ${activeChatId === chat.id ? 'bg-blue-50/30' : ''}`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center font-bold text-orange-700 uppercase shrink-0">
                                {chat.sender.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-bold truncate tracking-tight transition-colors ${chat.unread || activeChatId === chat.id ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {chat.sender}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chat.time}</span>
                                </div>
                                <p className={`text-sm truncate leading-relaxed ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500 font-normal'}`}>
                                    {chat.typing ? (
                                        <span className="text-blue-600 animate-pulse font-bold italic tracking-wide">Typing...</span>
                                    ) : chat.preview}
                                </p>
                            </div>
                            {chat.unread && (
                                <div className="absolute right-4 bottom-6 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative group">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-50 bg-white flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 uppercase">
                            {activeChat?.sender.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 tracking-tight">{activeChat?.sender}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                Online
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
                    <div className="flex justify-center mb-4">
                        <span className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase text-gray-400 tracking-widest shadow-sm">Conversation started</span>
                    </div>

                    {activeChat?.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.sent ? 'ml-auto flex-row-reverse' : ''} group/msg`}>
                            {!msg.sent && (
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center font-bold text-orange-700 uppercase text-xs shrink-0 self-end mb-1">
                                    {activeChat.sender.charAt(0)}
                                </div>
                            )}
                            <div className={`p-5 rounded-2xl shadow-sm relative transition-all ${msg.sent ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-100 rounded-bl-none'}`}>
                                <p className={`text-sm leading-relaxed ${msg.sent ? 'font-bold' : 'text-gray-700 font-medium whitespace-pre-line'}`}>{msg.text}</p>
                                
                                {msg.isJobInvite && (
                                    <div className="mt-4 p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                                            <Briefcase size={16} />
                                            <span>{msg.jobDetails?.title}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-1.5 text-gray-600 flex-wrap">
                                                <MapPin size={14} className="flex-shrink-0" />
                                                <span className="truncate max-w-[80px]" title={msg.jobDetails?.location}>{msg.jobDetails?.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 flex-wrap">
                                                <Banknote size={14} className="flex-shrink-0 text-emerald-600" />
                                                <span className="font-bold text-gray-900 truncate">Rs. {msg.jobDetails?.budget}</span>
                                            </div>
                                        </div>
                                        
                                        {!msg.inviteResponded ? (
                                            <div className="flex gap-2 pt-3 border-t border-gray-200 mt-3">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleInviteResponse(msg.id, 'accept'); }}
                                                    className="flex-1 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle2 size={14} /> Accept
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleInviteResponse(msg.id, 'reject'); }}
                                                    className="flex-1 py-1.5 bg-gray-200 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <XCircle size={14} /> Decline
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="pt-3 border-t border-gray-200 mt-3 text-[10px] font-bold uppercase text-gray-400 text-center tracking-widest">
                                                Invitation Responded
                                            </div>
                                        )}
                                    </div>
                                )}

                                <span className={`absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-0 group-hover/msg:opacity-100 transition-opacity ${msg.sent ? 'right-0 text-right' : 'left-0'}`}>
                                    {msg.time} {msg.sent ? '• Delivered' : ''}
                                </span>
                            </div>
                        </div>
                    ))}

                    {activeChat?.typing && (
                        <div className="flex gap-3 items-center text-blue-600 font-bold italic text-sm animate-pulse tracking-wide ml-12">
                            {activeChat.sender} is typing...
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-50 flex items-center gap-4 sticky bottom-0 z-10">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full pl-6 pr-12 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none font-medium"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-100/50 rounded-xl transition-all">
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
