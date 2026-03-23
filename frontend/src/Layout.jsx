import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import WorkerSidebar from './components/layout/WorkerSidebar';
import EmployerSidebar from './components/layout/EmployerSidebar';
import WorkerFooter from './components/layout/WorkerFooter';
import EmployerFooter from './components/layout/EmployerFooter';
import DashboardHeader from './components/layout/DashboardHeader';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/AuthContext';

import './components/layout/sidebar.css';
import './components/layout/footer.css';

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const { t } = useTranslation();
    const { user, role, isLoading } = useAuth();

    // Pages that don't need the full layout (no sidebar, no footer)
    const authPages = ['/login', '/signup-employer', '/signup-worker'];
    const landingPage = '/landing';
    const isFullPage = authPages.includes(location.pathname) || location.pathname === landingPage;

    if (isFullPage) {
        return <div>{children}</div>;
    }

    // Determine which layout mode to use - check both user.user_type and role from AuthContext
    const userType = user?.user_type || user?.role || role;
    const isEmployerMode = location.pathname.startsWith('/employer') || 
        (userType?.toLowerCase() === 'employer' && !location.pathname.startsWith('/worker'));
    const isWorkerMode = !isEmployerMode;

    // Determine if this is a new user (check for signup flag)
    const isNewUser = localStorage.getItem('isNewSignup') === 'true';
    
    // Clear the new signup flag after first render and set hasVisitedBefore
    useEffect(() => {
        if (isNewUser) {
            localStorage.removeItem('isNewSignup');
        }
        localStorage.setItem('hasVisitedBefore', 'true');
    }, [isNewUser]);

    const Sidebar = isEmployerMode ? EmployerSidebar : WorkerSidebar;
    const FooterComponent = isEmployerMode ? EmployerFooter : WorkerFooter;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar - Worker or Employer based on route */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 main-content-with-sidebar bg-slate-50/50">
                    {/* Header - Unified Global Header */}
                    {isEmployerMode ? (
                        <DashboardHeader
                            subtitle={t('employerDashboard.manageJobsSubtitle')}
                            showAvailability={false}
                            isNewUser={isNewUser}
                        />
                    ) : (
                        <DashboardHeader
                            subtitle={t('workerDashboard.profileCompletionDesc')}
                            showAvailability={true}
                            isNewUser={isNewUser}
                        />
                    )}

                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Footer */}
            <div className="main-content-with-sidebar">
                <FooterComponent />
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />
        </div>
    );
}