/**
 *  EMPLOYER SIDEBAR + MOBILE BOTTOM NAV
 */
import React from 'react';
import './sidebar.css';
import {
    Briefcase,
    FileText,
    Users,
    DollarSign,
    Calendar,
    Settings,
    Grid,
    User,
    TrendingUp,
    HelpCircle,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/images/logo.jpeg';
import { useTranslation } from 'react-i18next';


const employerMenuItems = [
    { path: '/employer/dashboard', icon: Grid, labelKey: 'nav.dashboard', fallback: 'Dashboard' },
    { path: '/employer/post-job', icon: Briefcase, labelKey: 'nav.postJob', fallback: 'Post Job' },
    { path: '/employer/jobs', icon: Briefcase, labelKey: 'nav.manageJobs', fallback: 'Manage Jobs' },
    { path: '/employer/applications', icon: FileText, labelKey: 'nav.applications', fallback: 'Applications' },
    { path: '/employer/find-workers', icon: Users, labelKey: 'nav.findWorkers', fallback: 'Find Workers' },
    { path: '/employer/wallet', icon: DollarSign, labelKey: 'nav.wallet', fallback: 'Wallet' },
    { path: '/employer/help', icon: HelpCircle, labelKey: 'nav.support', fallback: 'Support' },
    { path: '/employer/settings', icon: Settings, labelKey: 'nav.settings', fallback: 'Settings' },
];

const NavLink = ({ path, icon: Icon, label, active }) => {
    return (
        <Link to={path} className={`sidebar-link ${active ? 'active' : ''}`}>
            <Icon className="sidebar-icon" />
            <span className="sidebar-label">{label}</span>
        </Link>
    );
};

const EmployerSidebar = () => {
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
                        {employerMenuItems.map(({ path, icon, labelKey, fallback }) => {
                            const active = location.pathname === path;
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
                    {employerMenuItems.map(({ path, icon: Icon, labelKey, fallback }) => {
                        const active = location.pathname === path;

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

export default EmployerSidebar;
