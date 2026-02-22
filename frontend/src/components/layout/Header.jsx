import React from 'react';
import { Briefcase, FileText, FolderOpen, GraduationCap, Award } from 'lucide-react';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header = () => {
    return (
        <header className="border-b bg-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-8">
                {/* Brand Identity */}
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                        <Briefcase size={22} />
                    </div>
                    <span>WorkID</span>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex gap-1">
                    <NavItem icon={<Briefcase size={18} />} label="Find Jobs" active />
                    <NavItem icon={<FileText size={18} />} label="My Applications" />
                    <NavItem icon={<FolderOpen size={18} />} label="Documents" />
                    <NavItem icon={<GraduationCap size={18} />} label="Learning" />
                    <NavItem icon={<Award size={18} />} label="Badges" />
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <LanguageSwitcher /> {/* Multi-language support requirement */}
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    D
                </div>
            </div>
        </header>
    );
};

const NavItem = ({ icon, label, active }) => (
    <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
        }`}>
        {icon} {label}
    </button>
);

export default Header;