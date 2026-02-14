import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Briefcase, Building, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function JobDetails({ job, onBack, onApply }) {
    const { t, i18n } = useTranslation();
    if (!job) return null;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:pl-2 transition-all"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t('jobs.backBack')}
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t(`mock.jobs.${job.title}`, job.title)}</h1>
                        <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                            <Building className="w-5 h-5" />
                            <span className="font-medium">{t(`mock.companies.${job.company}`, job.company)}</span>
                            <span>•</span>
                            <span className="text-gray-500">{t(`mock.locations.${job.location}`, job.location)}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                {t(`common.${job.job_type.toLowerCase().replace('-', '').replace(' ', '')}`, job.job_type)}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200">
                                <DollarSign className="w-3 h-3 mr-1 inline" />
                                {t('common.currency')} {job.salary?.toLocaleString()}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                <Clock className="w-3.5 h-3.5 mr-1 inline" />
                                {t('jobs.posted', { date: new Date(job.posted_date).toLocaleDateString(i18n.language) })}
                            </Badge>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={() => onApply(job)}
                    >
                        {t('jobs.applyNow')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('jobs.description')}</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {t(`mock.jobDescriptions.${job.description}`, job.description)}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('jobs.requirements')}</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 italic">
                                {t(`mock.jobRequirements.${job.requirements}`, job.requirements)}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('jobs.skills')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.skills_required?.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                        {t(`mock.skills.${skill}`, skill)}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                {t('jobs.overview')}
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                    <span className="text-gray-500">{t('jobs.category')}</span>
                                    <span className="font-medium text-gray-900">{t(`jobs.categories.${job.category}`, job.category)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                    <span className="text-gray-500">{t('jobs.job_type')}</span>
                                    <span className="font-medium text-gray-900">{t(`common.${job.job_type.toLowerCase().replace('-', '').replace(' ', '')}`, job.job_type)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                                    <span className="text-gray-500">{t('jobs.rate')}</span>
                                    <span className="font-medium text-gray-900">{t('common.currency')} {job.salary?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 shadow-sm">
                            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                {t('jobs.company')}
                            </h3>
                            <p className="font-semibold text-indigo-700 mb-1">{t(`mock.companies.${job.company}`, job.company)}</p>
                            <p className="text-sm text-indigo-600">{t(`mock.locations.${job.location}`, job.location)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
