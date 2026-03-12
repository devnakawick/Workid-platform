import React from 'react';
import { Award, Lock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BadgeCard from '@/components/worker/BadgeCard';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { mockBadges, mockWorkerBadges } from '@/lib/mockData';

export default function Badges() {
    const { t } = useTranslation();
    const earnedBadgeIds = new Set(mockWorkerBadges.map(eb => eb.badge_id));
    const earned = mockBadges.filter(b => earnedBadgeIds.has(b.id));
    const locked = mockBadges.filter(b => !earnedBadgeIds.has(b.id));

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('badges.title')}</h1>
                    <p className="text-gray-600">{t('badges.subtitle')}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    {['common', 'rare', 'epic', 'legendary'].map((rarity) => {
                        const count = earned.filter(b => b.rarity === rarity).length;
                        return (
                            <Card key={rarity} className="shadow-sm border-gray-200">
                                <CardContent className="p-5 text-center">
                                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                                    <p className="text-sm font-medium text-gray-600 capitalize mt-1">{t(`badges.rarity.${rarity}`)}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Tabs */}
                <Tabs defaultValue="earned" className="space-y-6">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="earned">
                            {t('badges.earned')} ({earned.length})
                        </TabsTrigger>
                        <TabsTrigger value="locked">
                            {t('badges.locked')} ({locked.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="earned">
                        {earned.length === 0 ? (
                            <Card>
                                <CardContent className="py-20 text-center">
                                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('badges.noBadges')}</h3>
                                    <p className="text-gray-600">{t('badges.completeToEarn')}</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {earned.map((badge, idx) => {
                                    const workerBadge = mockWorkerBadges.find(eb => eb.badge_id === badge.id);
                                    return (
                                        <motion.div
                                            key={badge.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <BadgeCard
                                                badge={badge}
                                                earned_date={workerBadge?.earned_date}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="locked">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {locked.map((badge, idx) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="relative"
                                >
                                    <div className="opacity-50 grayscale">
                                        <BadgeCard badge={badge} />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-gray-900/80 rounded-full p-3">
                                            <Lock className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}