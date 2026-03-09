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
    { path: '/worker/dashboard', icon: Grid, labelKey: 'nav.dashboard', fallback: 'Dashboard' },
    { path: '/Jobs', icon: Briefcase, labelKey: 'nav.findJobs', fallback: 'Job Listings' },
    { path: '/Profile', icon: User, labelKey: 'nav.profile', fallback: 'Profile' },
    { path: '/Learning', icon: Award, labelKey: 'nav.learning', fallback: 'Learning & Skills' },
    { path: '/worker/wallet', icon: Wallet, labelKey: 'nav.wallet', fallback: 'Wallet' },
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
                        <img src={logo} alt="WorkID" className="sidebar-logo h-12 w-auto rounded-lg" />
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
                    {workerMenuItems.slice(0, 5).map(({ path, icon: Icon, labelKey, fallback }) => {
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

export default WorkerSidebar;
