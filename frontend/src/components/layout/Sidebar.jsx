/**
 *  SIDEBAR + MOBILE BOTTOM NAV
 */
import React from 'react';
import './sidebar.css';
import {
    Briefcase,
    FileText,
    FolderOpen,
    GraduationCap,
    Award,
    Settings,
    LogOut,
    Grid,
    User,
    Wallet,
    HelpCircle,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/Workid.svg';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

const menuItems = [
    { path: '/worker/dashboard', icon: Grid, labelKey: 'nav.dashboard', fallback: 'Dashboard' },
    { path: '/Jobs', icon: Briefcase, labelKey: 'nav.findJobs', fallback: 'Find Jobs' },
    { path: '/Applications', icon: FileText, labelKey: 'nav.applications', fallback: 'My Applications' },
    { path: '/Documents', icon: FolderOpen, labelKey: 'nav.documents', fallback: 'Documents' },
    { path: '/Learning', icon: GraduationCap, labelKey: 'nav.learning', fallback: 'Learning' },
    { path: '/Badges', icon: Award, labelKey: 'nav.badges', fallback: 'Badges' },
    { path: '/Profile', icon: User, labelKey: 'nav.profile', fallback: 'Profile' },
    { path: '/Wallet', icon: Wallet, labelKey: 'nav.wallet', fallback: 'Wallet' },
    { path: '/Support', icon: HelpCircle, labelKey: 'nav.support', fallback: 'Support' },
    { path: '/Settings', icon: Settings, labelKey: 'nav.settings', fallback: 'Settings' },
];

const NavLink = ({ path, icon: Icon, label, active }) => {
    return (
        <Link to={path} className={`sidebar-link ${active ? 'active' : ''}`}>
            <Icon className="sidebar-icon" />
            <span className="sidebar-label">{label}</span>
        </Link>
    );
};

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
            <aside className="sidebar">

                {/* Logo */}
                <div className="p-6">
                    <button type="button" onClick={() => navigate('/landing')} className="brand-wrap flex items-center gap-2" aria-label="WorkID">
                        <img src={logo} alt="WorkID" className="sidebar-logo" />
                        <span className="brand-name">WorkID</span>
                    </button>
                </div>

                {/* Separator between brand and nav */}
                <div className="sidebar-separator" aria-hidden="true" />

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="space-y-1">
                        {menuItems.map(({ path, icon, labelKey, fallback }) => {
                            const isJobs = path === '/Jobs';
                            const active = isJobs
                                ? location.pathname === '/Jobs' || location.pathname === '/' 
                                : location.pathname === path;
                            return (
                                <NavLink
                                    key={path}
                                    path={path}
                                    icon={icon}
                                    label={t(labelKey, fallback)}
                                    active={active}
                                />
                            );
                        })}
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t">
                    <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* User info */}
                <div className="p-4 bg-indigo-50 border-t">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">D</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">John Doe</p>
                                <p className="text-xs text-indigo-600">Pro Member</p>
                            </div>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </div>
            </aside>

            {/* ── MOBILE BOTTOM NAVBAR ─────────────────────────── */}
            <nav className="mobile-bottom-nav">
                <div className="mobile-nav-inner">
                    {menuItems.slice(0, 5).map(({ path, icon: Icon, labelKey, fallback }) => {
                        const isJobs = path === '/Jobs';
                        const active = isJobs
                            ? location.pathname === '/Jobs' || location.pathname === '/'
                            : location.pathname === path;

                        return (
                            <Link key={path} to={path} className={`mobile-link ${active ? 'active' : ''}`}>
                                <div className={`mobile-icon-wrapper ${active ? 'active' : ''}`}>
                                    <Icon className="mobile-icon" />
                                </div>
                                <span className="mobile-label">{t(labelKey, fallback)}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Spacer for mobile nav */}
            <div className="mobile-spacer" />
        </>
    );
};


export default Sidebar;