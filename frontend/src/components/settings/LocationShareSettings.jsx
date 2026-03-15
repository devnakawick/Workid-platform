import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Shield, MapPin } from 'lucide-react';

const LocationShareSettings = ({ job, onSave }) => {
    const [setting, setSetting] = useState('when_traveling');

    const handleSave = () => {
        onSave(setting);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Shield size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Location Settings</h3>
            </div>

            <div className="space-y-4 mb-6 relative">
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${setting === '1_hour_before' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}>
                    <input
                        type="radio"
                        name="location_setting"
                        value="1_hour_before"
                        checked={setting === '1_hour_before'}
                        onChange={() => setSetting('1_hour_before')}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        <p className="font-bold text-gray-900">1 hour before job</p>
                        <p className="text-sm text-gray-500 mt-1">Start tracking the worker's location 1 hour before the scheduled start time.</p>
                    </div>
                </label>

                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${setting === '30_min_before' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}>
                    <input
                        type="radio"
                        name="location_setting"
                        value="30_min_before"
                        checked={setting === '30_min_before'}
                        onChange={() => setSetting('30_min_before')}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        <p className="font-bold text-gray-900">30 minutes before job</p>
                        <p className="text-sm text-gray-500 mt-1">Start tracking the worker's location 30 minutes before the scheduled start time.</p>
                    </div>
                </label>

                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${setting === 'when_traveling' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}>
                    <input
                        type="radio"
                        name="location_setting"
                        value="when_traveling"
                        checked={setting === 'when_traveling'}
                        onChange={() => setSetting('when_traveling')}
                        className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        <p className="font-bold text-gray-900">When worker starts traveling</p>
                        <p className="text-sm text-gray-500 mt-1">Only track location when the worker manually clicks "Start Travel". Recommended for privacy.</p>
                    </div>
                </label>
            </div>

            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-blue-200">
                <Settings className="w-4 h-4 mr-2" /> Save Location Settings
            </Button>
        </div>
    );
};

export default LocationShareSettings;
