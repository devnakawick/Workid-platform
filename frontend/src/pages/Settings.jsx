import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import services based on user role
import workerService from '@/services/workerService';
import employerService from '@/services/employerService';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = React.useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: user?.name || 'John Doe',
        email: user?.email || 'john.doe@gmail.com',
        phone: user?.phone || '077-1234567',
        location: user?.location || 'Colombo 07',
        role: user?.role || 'Plumber',
        experience: user?.experience || '5 Years Experience',
        notifications: user?.notifications || {
            jobAlerts: true,
            appUpdates: true,
            weeklySummary: true,
        },
        language: user?.language || i18n.language || 'en'
    });

    // Load profile data from backend on component mount
    useEffect(() => {
        console.log('Settings component mounted');
        console.log('Initial i18n.language:', i18n.language);
        console.log('Initial user.language:', user?.language);
        console.log('Initial formData.language:', formData.language);
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            let profileData;
            
            if (user?.role === 'worker') {
                profileData = await workerService.getWorkerProfile();
            } else if (user?.role === 'employer') {
                profileData = await employerService.getEmployerProfile();
            }

            if (profileData?.data) {
                setFormData(prev => ({
                    ...prev,
                    full_name: profileData.data.full_name || prev.full_name,
                    email: profileData.data.email || prev.email,
                    phone: profileData.data.phone_number || prev.phone,
                    location: profileData.data.city || prev.location,
                    experience: profileData.data.experience_years ? `${profileData.data.experience_years} Years Experience` : prev.experience,
                }));
                setAvatarPreview(profileData.data.profile_photo || null);
            }
        } catch (error) {
            console.error('Failed to load profile data:', error);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                toast.success(t('common.photoUploaded'));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLanguageChange = (value) => {
        console.log('Language change triggered:', value);
        i18n.changeLanguage(value);
        setFormData(prev => ({ ...prev, language: value }));
        // Save immediately to AuthContext for persistence
        updateUser({
            ...user,
            language: value
        });
        toast.success(t('common.languageChanged'));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // Prepare update data based on user role - only send fields that backend accepts
            const updateData = {
                full_name: formData.full_name,
                city: formData.location,
                experience_years: parseInt(formData.experience) || 0,
            };

            // Call appropriate service based on user role
            if (user?.role === 'worker') {
                await workerService.updateWorkerProfile(updateData);
            } else if (user?.role === 'employer') {
                await employerService.updateEmployerProfile(updateData);
            }

            // Update local auth context with all changes including avatar and notifications
            updateUser({
                name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                experience: formData.experience,
                avatar: avatarPreview,
                notifications: formData.notifications,
                language: formData.language
            });

            toast.success(t('common.changesSaved'));
        } catch (error) {
            console.error('Failed to save profile:', error);
            toast.error('Failed to save changes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* 1. Account Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">{t('settings.account')}</h2>
                        <p className="text-gray-500 text-sm mt-1">{t('settings.manageAccountDesc')}</p>
                    </div>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-sm">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.full_name}&backgroundColor=ffadad`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 rounded-xl"
                                disabled={loading}
                            >
                                Change Photo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setAvatarPreview(null)}
                                className="bg-gray-50 border-gray-100 text-gray-600 font-bold px-6 rounded-xl hover:bg-gray-100"
                                disabled={loading}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <Label htmlFor="full-name" className="text-sm font-bold text-gray-700">{t('settings.fullName')}</Label>
                            <Input
                                id="full-name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className="h-12 border-gray-100 bg-white rounded-lg focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-bold text-gray-700">{t('settings.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 border-gray-100 bg-white rounded-lg focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-bold text-gray-700">{t('settings.phone')}</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="h-12 border-gray-100 bg-white rounded-lg focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-sm font-bold text-gray-700">{t('settings.location')}</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="h-12 border-gray-100 bg-white rounded-lg focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience" className="text-sm font-bold text-gray-700">{t('common.experience')}</Label>
                            <Input
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="h-12 border-gray-100 bg-white rounded-lg focus:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50/50 p-6 flex justify-end border-t border-gray-50/50">
                    <Button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-blue-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {t('common.saving')}...
                            </div>
                        ) : (
                            t('common.saveChanges')
                        )}
                    </Button>
                </div>
            </div>

            {/* 2. Notifications Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{t('settings.notifications')}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t('settings.emailNotificationsDesc')}</p>
                </div>

                <div className="divide-y divide-gray-50">
                    <div className="py-5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-base font-bold text-gray-900">{t('settings.newJobAlerts')}</p>
                            <p className="text-sm text-gray-500">{t('settings.jobAlertsDetail')}</p>
                        </div>
                        <Switch
                            checked={formData.notifications.jobAlerts}
                            onCheckedChange={(checked) => {
                                const newFormData = {
                                    ...formData,
                                    notifications: { ...formData.notifications, jobAlerts: checked }
                                };
                                setFormData(newFormData);
                                // Save immediately to AuthContext for persistence
                                updateUser({
                                    ...user,
                                    notifications: newFormData.notifications
                                });
                            }}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 flex-shrink-0 [&_[data-state=checked]_span]:bg-white [&_[data-state=unchecked]_span]:bg-gray-500 [&_span]:shadow-lg [&_span]:border-2 [&_[data-state=checked]_span]:border-blue-600 [&_[data-state=unchecked]_span]:border-gray-400"
                        />
                    </div>
                    <div className="py-5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-base font-bold text-gray-900">{t('settings.applicationUpdates')}</p>
                            <p className="text-sm text-gray-500">{t('settings.appUpdatesDetail')}</p>
                        </div>
                        <Switch
                            checked={formData.notifications.appUpdates}
                            onCheckedChange={(checked) => {
                                const newFormData = {
                                    ...formData,
                                    notifications: { ...formData.notifications, appUpdates: checked }
                                };
                                setFormData(newFormData);
                                // Save immediately to AuthContext for persistence
                                updateUser({
                                    ...user,
                                    notifications: newFormData.notifications
                                });
                            }}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 flex-shrink-0 [&_[data-state=checked]_span]:bg-white [&_[data-state=unchecked]_span]:bg-gray-500 [&_span]:shadow-lg [&_span]:border-2 [&_[data-state=checked]_span]:border-blue-600 [&_[data-state=unchecked]_span]:border-gray-400"
                        />
                    </div>
                    <div className="py-5 flex items-center justify-between gap-4">
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-base font-bold text-gray-900">{t('settings.weeklySummary')}</p>
                            <p className="text-sm text-gray-500">{t('settings.weeklySummaryDetail')}</p>
                        </div>
                        <Switch
                            checked={formData.notifications.weeklySummary}
                            onCheckedChange={(checked) => {
                                const newFormData = {
                                    ...formData,
                                    notifications: { ...formData.notifications, weeklySummary: checked }
                                };
                                setFormData(newFormData);
                                // Save immediately to AuthContext for persistence
                                updateUser({
                                    ...user,
                                    notifications: newFormData.notifications
                                });
                            }}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 flex-shrink-0 [&_[data-state=checked]_span]:bg-white [&_[data-state=unchecked]_span]:bg-gray-500 [&_span]:shadow-lg [&_span]:border-2 [&_[data-state=checked]_span]:border-blue-600 [&_[data-state=unchecked]_span]:border-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Language & Region Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{t('settings.languageRegion')}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t('settings.languageRegionDesc')}</p>
                </div>

                <div className="max-w-md space-y-2">
                    <Label className="text-sm font-bold text-gray-700">{t('settings.language')}</Label>
                    <Select value={formData.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="h-12 border-gray-100 focus:ring-blue-500">
                            <SelectValue placeholder={t('settings.selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">{t('languages.english')}</SelectItem>
                            <SelectItem value="si">{t('languages.sinhala')}</SelectItem>
                            <SelectItem value="ta">{t('languages.tamil')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
