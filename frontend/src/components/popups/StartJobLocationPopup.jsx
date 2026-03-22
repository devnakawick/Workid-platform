import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle } from 'lucide-react';

const StartJobLocationPopup = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative border-[6px] border-white shadow-sm">
                    <MapPin size={36} />
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white rounded-full p-1.5 border-[3px] border-white shadow-sm">
                        <AlertTriangle size={14} />
                    </div>
                </div>

                <h3 className="text-xl font-black text-center text-gray-900 mb-3 tracking-tight">Location Sharing Required</h3>
                <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed font-medium px-2">
                    By starting this job, your live location will be shared with the employer while the job is active. This helps them track your progress relative to the destination.
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="py-6 font-bold border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className="py-6 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl"
                    >
                        Start Sharing
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StartJobLocationPopup;
