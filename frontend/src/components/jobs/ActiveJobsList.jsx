import React from 'react';
import ActiveJobCard from './ActiveJobCard';

const ActiveJobsList = ({ jobs, title = "Active Jobs", basePath }) => {
    if (!jobs || jobs.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <p className="text-gray-500 font-medium tracking-wide">No active jobs found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 px-2">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {jobs.map(job => (
                    <ActiveJobCard key={job.id} job={job} basePath={basePath} />
                ))}
            </div>
        </div>
    );
};

export default ActiveJobsList;
