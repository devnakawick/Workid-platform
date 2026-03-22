import React from 'react';
import { useLocation } from 'react-router-dom';
import WorkerSidebar from './components/layout/WorkerSidebar';
import EmployerSidebar from './components/layout/EmployerSidebar';
import WorkerFooter from './components/layout/WorkerFooter';
import EmployerFooter from './components/layout/EmployerFooter';
import DashboardHeader from './components/layout/DashboardHeader';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/AuthContext';

import './components/layout/sidebar.css';
import './components/layout/footer.css';

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useAuth();

    // Pages that don't need the full layout (no sidebar, no footer)
    const authPages = ['/login', '/signup-employer', '/signup-worker'];
    const landingPage = '/landing';
    const isFullPage = authPages.includes(location.pathname) || location.pathname === landingPage;

    if (isFullPage) {
        return <div>{children}</div>;
    }

    // Determine which layout mode to use
    const isEmployerMode = location.pathname.startsWith('/employer') || (user?.role === 'Employer' && !location.pathname.startsWith('/worker') && !['/Profile', '/Jobs', '/Applications', '/Documents', '/Badges', '/Learning'].includes(location.pathname));
    const isWorkerMode = !isEmployerMode;

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
                        />
                    ) : (
                        <DashboardHeader
                            subtitle={t('workerDashboard.profileCompletionDesc')}
                            showAvailability={true}
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
        </div>
    );
}