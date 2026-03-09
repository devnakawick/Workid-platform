import React from 'react';
import { Bell, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

const DashboardHeader = ({
    subtitle = "Here's what's happening today!",
    hideHeaderInfo = false,
    hideIcons = false,
    showAvailability = false
}) => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const name = user?.name || 'User';
    const role = user?.role || 'Member';
    const avatarSeed = name;
    const isAvailable = user?.isAvailable ?? true;

    const toggleAvailability = () => {
        const nextState = !isAvailable;
        updateUser({ isAvailable: nextState });
        toast.info(`Status updated to ${nextState ? 'Available' : 'Unavailable'}`);
    };

    return (
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white border-b border-gray-100 sticky top-0 z-50 gap-4">
            {!hideHeaderInfo ? (
                <div className="w-full md:w-auto">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">Welcome back, {name}</h1>
                    <p className="text-gray-500 text-xs md:text-sm mt-0.5 truncate">{subtitle}</p>
                </div>
            ) : <div />}

            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-6 overflow-x-auto pb-1 md:pb-0">
                {/* Icons */}
                {!hideIcons && (
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => navigate('/Notifications')}
                        >
                            <Bell size={20} />
                            {(user?.notificationsCount > 0) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                        <button
                            className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => navigate('/Messages')}
                        >
                            <Mail size={20} />
                            {(user?.messagesCount > 0) && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-gray-100 min-w-max">
                    {/* Availability Toggle - Only for Workers */}
                    {showAvailability && (
                        <button
                            onClick={toggleAvailability}
                            className={`flex items-center gap-2 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full border transition-all ${isAvailable
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : 'bg-gray-50 border-gray-200 text-gray-500'
                                }`}
                        >
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                {isAvailable ? (
                                    <span className="inline md:inline">Available</span>
                                ) : (
                                    <span className="inline md:inline">Unavailable</span>
                                )}
                            </span>
                        </button>
                    )}

                    <div className="text-right ml-1 md:ml-2">
                        <p className="text-xs md:text-sm font-bold text-gray-900 truncate max-w-[80px] md:max-w-none">{name}</p>
                        <p className="text-[10px] md:text-xs text-gray-500">{role}</p>
                    </div>
                    <div className="relative flex-shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={name}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                            />
                        ) : (
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=ffadad`}
                                alt={name}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 border border-gray-100"
                            />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
