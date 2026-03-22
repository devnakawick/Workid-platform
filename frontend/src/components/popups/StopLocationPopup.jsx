import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPinOff } from 'lucide-react';

const StopLocationPopup = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-emerald-100">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-[6px] border-white shadow-sm">
                    <MapPinOff size={36} />
                </div>

                <h3 className="text-xl font-black text-center text-gray-900 mb-3 tracking-tight">Location Sharing Stopped</h3>
                <p className="text-center text-gray-500 text-sm mb-8 leading-relaxed font-medium px-2">
                    You have finished the job. Your live location is no longer being shared with the employer. Good job!
                </p>

                <Button
                    onClick={onClose}
                    className="w-full py-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl"
                >
                    Got it, thanks!
                </Button>
            </div>
        </div>
    );
};

export default StopLocationPopup;
