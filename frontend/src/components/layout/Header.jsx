import React from 'react';
import './header.css';
import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header = () => {
    return (
        <header className="workid-header">
            <div className="workid-header-left">
                {/* Brand Identity */}
                <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-2xl">
                    <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                        <Briefcase size={22} />
                    </div>
                    <span>WorkID</span>
                </Link>
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

export default Header;