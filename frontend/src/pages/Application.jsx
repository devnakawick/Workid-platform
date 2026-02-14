import React, { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { mockApplications } from '@/lib/mockData';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    reviewed: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200'
};

export default function Applications() {
    const { t, i18n } = useTranslation();
    const [applications, setApplications] = useState(mockApplications);
    const [activeTab, setActiveTab] = useState('all');

    const handleWithdraw = (id) => {
        setApplications(applications.filter(app => app.id !== id));
        toast.success(t('applications.withdraw_success'));
    };

    const filteredApplications = applications.filter(app => {
        if (activeTab === 'all') return true;
        return app.status === activeTab;
    });

    const stats = {
        all: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        rejected: applications.filter(a => a.status === 'rejected').length
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('applications.title')}</h1>
                    <p className="text-gray-600">{t('applications.subtitle')}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                    {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                        <Card key={status} className="shadow-sm border-gray-200">
                            <CardContent className="p-5 text-center">
                                <p className="text-3xl font-bold text-gray-900">{stats[status]}</p>
                                <p className="text-sm font-medium text-gray-600 capitalize mt-1">
                                    {t(`applications.${status}`)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="all">{t('applications.all')} ({stats.all})</TabsTrigger>
                        <TabsTrigger value="pending">{t('applications.pending')} ({stats.pending})</TabsTrigger>
                        <TabsTrigger value="reviewed">{t('applications.reviewed')} ({stats.reviewed})</TabsTrigger>
                        <TabsTrigger value="accepted">{t('applications.accepted')} ({stats.accepted})</TabsTrigger>
                        <TabsTrigger value="rejected">{t('applications.rejected')} ({stats.rejected})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab}>
                        {filteredApplications.length === 0 ? (
                            <Card>
                                <CardContent className="py-20 text-center">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('applications.noApps')}</h3>
                                    <p className="text-gray-600">{t('applications.startApplying')}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredApplications.map((app, idx) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900">{t(`mock.jobs.${app.job_title}`, app.job_title)}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">{t(`mock.companies.${app.company}`, app.company)}</p>
                                                    </div>
                                                    <Badge className={STATUS_COLORS[app.status]} variant="outline">
                                                        {t(`applications.${app.status}`)}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {t('applications.appliedDate', { date: new Date(app.applied_date).toLocaleDateString(i18n.language) })}
                                                </p>
                                                {app.cover_message && (
                                                    <div className="mt-3">
                                                        <p className="text-sm font-medium text-gray-700 mb-1">{t('applications.coverMessage')}</p>
                                                        <p className="text-sm text-gray-600 line-clamp-2">{t(`mock.coverMessages.${app.cover_message}`, app.cover_message)}</p>
                                                    </div>
                                                )}
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleWithdraw(app.id)}
                                                    disabled={app.status === 'accepted' || app.status === 'rejected'}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    {t('applications.withdraw')}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}