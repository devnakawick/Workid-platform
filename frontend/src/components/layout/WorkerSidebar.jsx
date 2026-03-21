/**
 *  WORKER SIDEBAR + MOBILE BOTTOM NAV
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
    Grid,
    User,
    Wallet,
    HelpCircle,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/images/logo.jpeg';
import { useTranslation } from 'react-i18next';


const workerMenuItems = [
    { path: '/worker/dashboard', icon: Grid, labelKey: 'nav.dashboard', fallback: 'Dashboard', mobileLabel: 'Home' },
    { path: '/worker/current-jobs', icon: Briefcase, labelKey: 'nav.myJobs', fallback: 'My Active Jobs', mobileLabel: 'My Jobs' },
    { path: '/Jobs', icon: Briefcase, labelKey: 'nav.findJobs', fallback: 'Find Jobs', mobileLabel: 'Find Jobs' },
    { path: '/Profile', icon: User, labelKey: 'nav.profile', fallback: 'Profile', mobileLabel: 'Profile' },
    { path: '/Documents', icon: FolderOpen, labelKey: 'nav.documents', fallback: 'Documents', mobileLabel: 'Docs' },
    { path: '/Learning', icon: Award, labelKey: 'nav.learning', fallback: 'Learning & Skills', mobileLabel: 'Learning' },
    { path: '/worker/wallet', icon: Wallet, labelKey: 'nav.wallet', fallback: 'Wallet', mobileLabel: 'Wallet' },
    { path: '/worker/support', icon: HelpCircle, labelKey: 'nav.support', fallback: 'Support', mobileLabel: 'Support' },
    { path: '/Settings', icon: Settings, labelKey: 'nav.settings', fallback: 'Settings', mobileLabel: 'Settings' },
];

const NavLink = ({ path, icon: Icon, label, active }) => {
    return (
        <Link to={path} className={`sidebar-link ${active ? 'active' : ''}`}>
            <Icon className="sidebar-icon" />
            <span className="sidebar-label">{label}</span>
        </Link>
    );
};

const WorkerSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
            <aside className="sidebar">

                {/* Logo Branding */}
                <div className="p-6">
                    <button type="button" onClick={() => navigate('/landing')} className="brand-wrap flex items-center gap-3" aria-label="WorkID">
                        <div className="bg-white p-0.5 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-white/10 overflow-hidden">
                            <img src={logo} alt="WorkID" className="h-12 w-auto object-contain scale-110" />
                        </div>
                        <div className="text-left">
                            <h2 className="brand-name text-white font-extrabold text-xl m-0 leading-tight">WorkID</h2>
                            <p className="text-white/80 text-[10px] m-0 font-medium">Where work meets trust</p>
                        </div>
                    </button>
                </div>

                {/* Separator between brand and nav */}
                <div className="sidebar-separator" aria-hidden="true" />

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="space-y-1">
                        {workerMenuItems.map(({ path, icon, labelKey, fallback }) => {
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
            </aside>

            {/* ── MOBILE BOTTOM NAVBAR ─────────────────────────── */}
            <nav className="mobile-bottom-nav">
                <div className="mobile-nav-inner">
                    {workerMenuItems.map(({ path, icon: Icon, labelKey, fallback, mobileLabel }) => {
                        const isJobs = path === '/Jobs';
                        const active = isJobs
                            ? location.pathname === '/Jobs' || location.pathname === '/'
                            : location.pathname === path;

                        return (
                            <Link key={path} to={path} className={`mobile-link ${active ? 'active' : ''}`}>
                                <div className={`mobile-icon-wrapper ${active ? 'active' : ''}`}>
                                    <Icon className="mobile-icon" />
                                </div>
                                <span className="mobile-label">{mobileLabel || t(labelKey, fallback)}</span>
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

export default WorkerSidebar;