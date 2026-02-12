import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Clock, Briefcase, Building, ArrowLeft, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function JobDetails({ job, onBack, onApply }) {
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
                    Back to Jobs
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                            <Building className="w-5 h-5" />
                            <span className="font-medium">{job.company}</span>
                            <span>•</span>
                            <span className="text-gray-500">{job.location}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="secondary" className="text-sm px-3 py-1">
                                {job.job_type}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200">
                                <DollarSign className="w-3 h-3 mr-1 inline" />
                                LKR {job.salary?.toLocaleString()}
                            </Badge>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                                <Clock className="w-3 h-3 mr-1 inline" />
                                Posted {format(new Date(job.posted_date), 'MMM d, yyyy')}
                            </Badge>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={() => onApply(job)}
                    >
                        Apply Now
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                                <p className="text-gray-700 leading-relaxed">
                                    {job.requirements}
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                Job Overview
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Category</span>
                                    <span className="font-medium text-gray-900 capitalize">{job.category}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Type</span>
                                    <span className="font-medium text-gray-900">{job.job_type}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Rate</span>
                                    <span className="font-medium text-gray-900">LKR {job.salary?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Applied</span>
                                    <span className="font-medium text-gray-900">{job.applications_count || 0} Applicants</span>
                                </div>
                            </div>
                        </div>

                        {job.skills_required && job.skills_required.length > 0 && (
                            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills_required.map((skill, index) => (
                                        <Badge key={index} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
