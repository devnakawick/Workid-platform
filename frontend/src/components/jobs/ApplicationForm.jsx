import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from 'lucide-react';

export default function ApplicationForm({ job, isOpen, onClose, onSubmit, isLoading }) {
    if (!job) return null;

    const [coverMessage, setCoverMessage] = useState('');
    const [proposedRate, setProposedRate] = useState(job.salary || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ cover_message: coverMessage, proposed_rate: proposedRate });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Apply for {job.title}</DialogTitle>
                    <p className="text-sm text-gray-600 mt-1">{job.employer_name} • {job.location}</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="message">Why are you a good fit for this job?</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell the employer about your experience..."
                            value={coverMessage}
                            onChange={(e) => setCoverMessage(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rate">Your Proposed Rate (LKR)</Label>
                        <Input
                            id="rate"
                            type="number"
                            placeholder={job.salary ? `Employer offers: ${job.salary}` : 'Enter your rate'}
                            value={proposedRate}
                            onChange={(e) => setProposedRate(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                            You can propose your own rate or accept the employer's offer
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                            ) : (
                                <><Send className="w-4 h-4 mr-2" /> Submit Application</>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
