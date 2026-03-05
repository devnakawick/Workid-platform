import React, { useState } from 'react';
import { User, Bell, Shield, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { mockUser } from '@/lib/mockData';

export default function Settings() {
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        full_name: mockUser.name || '',
        email: mockUser.email || '',
        phone: mockUser.phone || '',
        location: mockUser.location || '',
        bio: mockUser.bio || '',
        language_preference: i18n.language || 'en',
        notification_preferences: {
            email_notifications: true,
            sms_notifications: true,
            job_alerts: true,
            application_updates: true
        }
    });

    const handleSave = () => {
        // Local storage mock - in standalone mode
        toast.success(t('settings.saveChanges') + ' ✓');
    };

    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
        setFormData({ ...formData, language_preference: value });
        toast.success(t('settings.languageUpdated'));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings.title')}</h1>
                    <p className="text-gray-600">{t('settings.subtitle')}</p>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="account" className="gap-2">
                            <User className="w-4 h-4" />
                            {t('settings.account')}
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="w-4 h-4" />
                            {t('settings.notifications')}
                        </TabsTrigger>
                        <TabsTrigger value="language" className="gap-2">
                            <Globe className="w-4 h-4" />
                            {t('settings.language')}
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="gap-2">
                            <Shield className="w-4 h-4" />
                            {t('settings.privacy')}
                        </TabsTrigger>
                    </TabsList>

                    {/* Account Tab */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('settings.accountInfo')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('settings.fullName')}</Label>
                                        <Input
                                            id="name"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('settings.email')}</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('settings.phone')}</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">{t('settings.location')}</Label>
                                        <Input
                                            id="location"
                                            placeholder={t('settings.locationPlaceholder')}
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">{t('settings.bio')}</Label>
                                    <Input
                                        id="bio"
                                        placeholder={t('settings.bioPlaceholder')}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                                    {t('settings.saveChanges')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('settings.notifications')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { key: 'email_notifications', label: t('settings.emailNotifications'), desc: t('settings.emailNotificationsDesc') },
                                    { key: 'sms_notifications', label: t('settings.smsNotifications'), desc: t('settings.smsNotificationsDesc') },
                                    { key: 'job_alerts', label: t('settings.jobAlerts'), desc: t('settings.jobAlertsDesc') },
                                    { key: 'application_updates', label: t('settings.applicationUpdates'), desc: t('settings.applicationUpdatesDesc') }
                                ].map((pref) => (
                                    <div key={pref.key} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{pref.label}</p>
                                            <p className="text-sm text-gray-600">{pref.desc}</p>
                                        </div>
                                        <Switch
                                            checked={formData.notification_preferences[pref.key]}
                                            onCheckedChange={(checked) =>
                                                setFormData({
                                                    ...formData,
                                                    notification_preferences: {
                                                        ...formData.notification_preferences,
                                                        [pref.key]: checked
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                ))}

                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                                    {t('settings.savePreferences')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Language Tab */}
                    <TabsContent value="language">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('settings.languagePreference')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{t('settings.selectLanguage')}</Label>
                                    <Select
                                        value={i18n.language}
                                        onValueChange={handleLanguageChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">{t('languages.english')}</SelectItem>
                                            <SelectItem value="si">{t('languages.sinhala')}</SelectItem>
                                            <SelectItem value="ta">{t('languages.tamil')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        {t('settings.languageDescription')}
                                    </p>
                                </div>

                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                                    {t('settings.saveLanguage')}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('settings.privacyAndSecurity')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                    <p className="text-sm text-blue-900">
                                        <strong>{t('settings.dataSecure')}</strong> {t('settings.encryptionInfo')}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <h4 className="font-semibold text-gray-900">{t('settings.dataPrivacy')}</h4>
                                    <p className="text-sm text-gray-600">
                                        {t('settings.profileVisibility')}
                                    </p>

                                    <h4 className="font-semibold text-gray-900 pt-4">{t('settings.accountSecurity')}</h4>
                                    <p className="text-sm text-gray-600">
                                        {t('settings.2faRecommendation')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}