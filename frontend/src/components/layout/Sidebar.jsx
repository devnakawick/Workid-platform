import React from 'react';
import { Home, Briefcase, Settings, HelpCircle, LogOut, User } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] hidden lg:flex flex-col py-6">
            <div className="flex-1 space-y-1 px-3">
                <SidebarLink icon={<Home size={20} />} label="Dashboard" active />
                <SidebarLink icon={<User size={20} />} label="Profile" />
                <SidebarLink icon={<Briefcase size={20} />} label="My Work" />
                <SidebarLink icon={<Settings size={20} />} label="Settings" />
            </div>

            <div className="px-3 border-t pt-4 mt-auto">
                <SidebarLink icon={<HelpCircle size={20} />} label="Help Center" />
                <SidebarLink icon={<LogOut size={20} />} label="Sign Out" color="text-red-500 hover:bg-red-50" />
            </div>
        </aside>
    );
};

const SidebarLink = ({ icon, label, active = false, color = "text-gray-600 hover:bg-gray-50" }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : color
        }`}>
        {icon} {label}
    </button>
);

export default Sidebar;