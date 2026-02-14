import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Clock, Briefcase, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const categoryColors = {
    cleaning: "bg-blue-100 text-blue-700",
    construction: "bg-orange-100 text-orange-700",
    plumbing: "bg-cyan-100 text-cyan-700",
    electrical: "bg-yellow-100 text-yellow-700",
    gardening: "bg-green-100 text-green-700",
    cooking: "bg-pink-100 text-pink-700",
    delivery: "bg-purple-100 text-purple-700",
    carpentry: "bg-amber-100 text-amber-700",
    painting: "bg-rose-100 text-rose-700",
    driving: "bg-indigo-100 text-indigo-700",
    other: "bg-gray-100 text-gray-700"
};

const urgencyColors = {
    low: "border-gray-300",
    medium: "border-blue-400",
    high: "border-orange-400",
    urgent: "border-red-500 shadow-md shadow-red-100"
};

export default function JobCard({ job, onApply }) {
    const { t } = useTranslation();
    const {
        id, title, description, urgency, category,
        skills_required = [], location, duration,
        salary, applications_count = 0
    } = job;

    const jobUrl = createPageUrl(`Jobs?id=${id}`);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={`hover:shadow-lg transition-all duration-300 border border-gray-200 ${urgencyColors[urgency]}`}>
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <Link to={jobUrl} className="hover:text-indigo-600 transition-colors">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{t(`mock.jobs.${title}`, title)}</h3>
                            </Link>
                            <p className="text-sm text-gray-600 line-clamp-2">{t(`mock.jobDescriptions.${description}`, description)}</p>
                        </div>
                        {urgency === 'urgent' && (
                            <Badge className="bg-red-500 text-white flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {t('common.urgent')}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge className={categoryColors[category] || categoryColors.other}>
                            {t(`mock.jobs.${category}`, category.replace('_', ' '))}
                        </Badge>

                        <Badge variant="secondary">
                            {t(`common.${job.job_type.toLowerCase().replace('-', '').replace(' ', '')}`, job.job_type)}
                        </Badge>

                        {skills_required.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                                {t(`mock.skills.${skill}`, skill)}
                            </Badge>
                        ))}

                        {skills_required.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                                {t('common.more', { count: skills_required.length - 2 })}
                            </Badge>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{t(`mock.locations.${location}`, location)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{t(`mock.durations.${duration}`, duration)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>{t('common.currency')} {salary?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{t('jobs.applied', { count: applications_count })}</span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={() => onApply(job)}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                        >
                            {t('jobs.quickApply')}
                        </Button>
                        <Button asChild variant="outline">
                            <Link to={jobUrl}>{t('jobs.details')}</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}