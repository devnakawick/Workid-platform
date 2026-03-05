import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Navigation from './components/layout/Navigation';
import './components/layout/sidebar.css';
import './components/layout/footer.css';
import './components/layout/navigation.css';

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    
    // Pages that don't need the full layout (no sidebar, no footer)
    const authPages = ['/login', '/signup-employer', '/signup-worker'];
    const landingPage = '/landing';
    const isFullPage = authPages.includes(location.pathname) || location.pathname === landingPage;
    
    if (isFullPage) {
        return <div>{children}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="flex flex-1">
                {/* Sidebar - now contains logo and all navigation */}
                <Sidebar />
                
                {/* Main Content Area */}
                <main className="flex-1 main-content-with-sidebar">
                    {/* Navigation/Breadcrumb */}
                    <Navigation currentPath={location.pathname} />
                    
                    {/* Page Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}