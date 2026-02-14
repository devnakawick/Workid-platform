import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
    Briefcase, ClipboardList, FileText, GraduationCap, Award,
    Settings, Menu, X, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUser } from '@/lib/mockData';

export default function Layout({ children, currentPageName }) {
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const user = mockUser;

    const navigation = [
        { name: t('nav.findJobs'), href: 'Jobs', icon: Briefcase },
        { name: t('nav.myApplications'), href: 'Applications', icon: ClipboardList },
        { name: t('nav.documents'), href: 'Documents', icon: FileText },
        { name: t('nav.learning'), href: 'Learning', icon: GraduationCap },
        { name: t('nav.badges'), href: 'Badges', icon: Award },
    ];

    const handleLogout = () => {
        // Logout placeholder - standalone mode
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to={createPageUrl('Jobs')} className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    WorkID
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPageName === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.href)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user?.avatar_url} />
                                            <AvatarFallback className="bg-indigo-600 text-white">
                                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to={createPageUrl('Settings')} className="flex items-center cursor-pointer">
                                            <Settings className="w-4 h-4 mr-2" />
                                            {t('settings.title')}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t('nav.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPageName === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.href)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${isActive
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold text-gray-900">WorkID</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                {t('footer.description')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">{t('footer.quickLinks')}</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link to={createPageUrl('Jobs')} className="hover:text-indigo-600">{t('nav.findJobs')}</Link></li>
                                <li><Link to={createPageUrl('Learning')} className="hover:text-indigo-600">{t('learning.allCourses')}</Link></li>
                                <li><Link to={createPageUrl('Documents')} className="hover:text-indigo-600">{t('documents.title')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">{t('footer.support')}</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>{t('footer.helpCenter')}</li>
                                <li>{t('footer.privacyPolicy')}</li>
                                <li>{t('footer.termsOfService')}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
                        <p>© 2026 WorkID. {t('footer.allRightsReserved')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}