import React from 'react';
import './header.css';
import { Briefcase, FileText, FolderOpen, GraduationCap, Award } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const Header = () => {
    const { t } = useTranslation();
    const location = useLocation();

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

                {/* Desktop Navigation Links */}
                <nav className="desktop-nav">
                    <NavItem
                        to="/Jobs"
                        icon={<Briefcase size={18} />}
                        label={t('nav.findJobs', 'Find Jobs')}
                        active={location.pathname === '/Jobs' || location.pathname === '/'}
                    />
                    <NavItem
                        to="/Applications"
                        icon={<FileText size={18} />}
                        label={t('nav.applications', 'My Applications')}
                        active={location.pathname === '/Applications'}
                    />
                    <NavItem
                        to="/Documents"
                        icon={<FolderOpen size={18} />}
                        label={t('nav.documents', 'Documents')}
                        active={location.pathname === '/Documents'}
                    />
                    <NavItem
                        to="/Learning"
                        icon={<GraduationCap size={18} />}
                        label={t('nav.learning', 'Learning')}
                        active={location.pathname === '/Learning'}
                    />
                    <NavItem
                        to="/Badges"
                        icon={<Award size={18} />}
                        label={t('nav.badges', 'Badges')}
                        active={location.pathname === '/Badges'}
                    />
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

const NavItem = ({ to, icon, label, active }) => (
    <Link to={to} className={`nav-item ${active ? 'active' : ''}`}>
        {icon} <span className="nav-label">{label}</span>
    </Link>
);


export default Header;