import React from 'react';
import { useLocation } from 'react-router-dom';
import WorkerSidebar from './components/layout/WorkerSidebar';
import EmployerSidebar from './components/layout/EmployerSidebar';
import Footer from './components/layout/Footer';
import DashboardHeader from './components/layout/DashboardHeader';
import { useAuth } from '@/lib/AuthContext';

import './components/layout/sidebar.css';
import './components/layout/footer.css';

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const { user } = useAuth();

    // Pages that don't need the full layout (no sidebar, no footer)
    const authPages = ['/login', '/signup-employer', '/signup-worker'];
    const landingPage = '/landing';
    const isFullPage = authPages.includes(location.pathname) || location.pathname === landingPage;

    if (isFullPage) {
        return <div>{children}</div>;
    }

    // Determine which sidebar to show based on user role or route
    const isEmployerRoute = location.pathname.startsWith('/employer') || (user?.role === 'Employer');
    const isWorkerRoute = location.pathname.startsWith('/worker') || (user?.role !== 'Employer');

    const Sidebar = isEmployerRoute ? EmployerSidebar : WorkerSidebar;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar - Worker or Employer based on route */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 main-content-with-sidebar bg-slate-50/50">
                    {/* Header - Unified Global Header */}
                    {isWorkerRoute && (
                        <DashboardHeader
                            subtitle="Here's what's happening with your work today!"
                            showAvailability={true}
                        />
                    )}
                    {isEmployerRoute && (
                        <DashboardHeader
                            subtitle="Manage your job postings and applicants."
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
                <Footer />
            </div>
        </div>
    );
}