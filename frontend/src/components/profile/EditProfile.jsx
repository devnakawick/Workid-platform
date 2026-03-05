import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Camera } from 'lucide-react';

const EditProfile = () => {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-6">General Information</h3>

            <div className="space-y-6">
                {/* Profile Image Upload Placeholder */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-50">
                    <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                            <Camera size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Profile Picture</p>
                        <p className="text-xs text-gray-500 mb-2">JPG, GIF or PNG. Max size of 2MB</p>
                        <Button variant="secondary" className="text-xs py-1.5">Upload New</Button>
                    </div>
                </div>

                {/* Form Fields using your Common Input component */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" defaultValue="Dishan" />
                    <Input label="Last Name" defaultValue="S." />
                </div>

                <Input label="Email Address" type="email" placeholder="dishan@example.com" />

                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Bio</label>
                    <textarea
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm min-h-[100px]"
                        placeholder="Describe your skills and experience..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button className="flex-1">Save Changes</Button>
                    <Button variant="secondary">Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;