import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Bell, CheckCircle2, Info, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const initialNotifications = [
    {
        id: 1,
        title: "New Job Match",
        description: "A new plumbing job in Colombo 07 matches your profile.",
        time: "2 mins ago",
        type: "job",
        unread: true
    },
    {
        id: 2,
        title: "Application Viewed",
        description: "Your application for 'Emergency Pipe Repair' was viewed by the employer.",
        time: "1 hour ago",
        type: "update",
        unread: true
    },
    {
        id: 3,
        title: "Payment Received",
        description: "LKR 5,000.00 has been added to your WorkID Wallet.",
        time: "3 hours ago",
        type: "payment",
        unread: true
    },
    {
        id: 4,
        title: "Security Alert",
        description: "Your password was changed successfully.",
        time: "Yesterday",
        type: "security",
        unread: false
    }
];

export default function Notifications() {
    const { updateUser } = useAuth();
    const [notifs, setNotifs] = useState(initialNotifications);

    // Sync unread count with global AuthContext
    useEffect(() => {
        const unreadCount = notifs.filter(n => n.unread).length;
        updateUser({ notificationsCount: unreadCount });
    }, [notifs]);

    const markAllRead = () => {
        setNotifs(notifs.map(n => ({ ...n, unread: false })));
        toast.success("All notifications marked as read");
    };

    const toggleRead = (id) => {
        setNotifs(notifs.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                        <p className="text-gray-500 text-sm mt-1">Stay updated with your latest activities</p>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                <div className="divide-y divide-gray-50">
                    {notifs.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => toggleRead(notif.id)}
                            className={`p-6 flex gap-4 transition-colors cursor-pointer hover:bg-gray-50/50 ${notif.unread ? 'bg-blue-50/10' : ''}`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'job' ? 'bg-orange-50 text-orange-600' :
                                notif.type === 'payment' ? 'bg-emerald-50 text-emerald-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                {notif.type === 'job' ? <Bell size={20} /> :
                                    notif.type === 'payment' ? <CheckCircle2 size={20} /> :
                                        <Info size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-bold tracking-tight ${notif.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {notif.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                                        <Clock size={12} />
                                        {notif.time}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {notif.description}
                                </p>
                            </div>
                            {notif.unread && (
                                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gray-50/30 text-center border-t border-gray-50">
                    <button
                        onClick={() => toast.info("Check back later for more!")}
                        className="text-sm font-bold text-gray-500 hover:text-gray-700 tracking-wide uppercase"
                    >
                        Load More Notifications
                    </button>
                </div>
            </div>
        </div>
    );
}
