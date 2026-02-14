import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ApplicationForm({ job, isOpen, onClose, onSubmit, isLoading }) {
    const { t } = useTranslation();
    const [coverMessage, setCoverMessage] = useState('');
    const [proposedRate, setProposedRate] = useState(job?.salary || '');

    if (!job) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ cover_message: coverMessage, proposed_rate: proposedRate });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('jobs.applyNow')} - {t(`mock.jobs.${job.title}`, job.title)}</DialogTitle>
                    <p className="text-sm text-gray-600 mt-1">{t(`mock.companies.${job.company}`, job.company)} • {t(`mock.locations.${job.location}`, job.location)}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">{t('jobs.description')}</Label>
                        <Textarea
                            id="message"
                            placeholder={t('applications.coverMessage')}
                            value={coverMessage}
                            onChange={(e) => setCoverMessage(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rate">{t('jobs.rate')} ({t('common.currency')})</Label>
                        <Input
                            id="rate"
                            type="number"
                            placeholder={job.salary ? `${t('jobs.overview')}: ${job.salary.toLocaleString()}` : t('jobs.rate')}
                            value={proposedRate}
                            onChange={(e) => setProposedRate(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            {t('jobs.subtitle')}
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('applications.pending')}...</>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" /> {t('jobs.applyNow')}</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

