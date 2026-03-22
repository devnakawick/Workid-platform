import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation, Play, CheckCircle } from 'lucide-react';

const JobActionButtons = ({ status, onStartTravel, onStartJob, onJobDone }) => {
    if (status === 'Finished' || status === 'Waiting Payment') {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {status === 'Accepted' && (
                <Button
                    onClick={onStartTravel}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 py-6 text-base font-bold rounded-xl"
                >
                    <Navigation className="mr-2 h-5 w-5" /> Start Travel
                </Button>
            )}

            {(status === 'Accepted' || status === 'Traveling') && (
                <Button
                    onClick={onStartJob}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-base font-bold rounded-xl shadow-lg shadow-indigo-200"
                >
                    <Play className="mr-2 h-5 w-5" /> Start Job
                </Button>
            )}

            {status === 'In Progress' && (
                <Button
                    onClick={onJobDone}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 py-6 text-base font-bold rounded-xl"
                >
                    <CheckCircle className="mr-2 h-5 w-5" /> Job Done
                </Button>
            )}
        </div>
    );
};

export default JobActionButtons;
