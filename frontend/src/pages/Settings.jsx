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
import { mockUser } from '@/lib/mockData';

export default function Settings() {
    const [formData, setFormData] = useState({
        full_name: mockUser.name || '',
        email: mockUser.email || '',
        phone: mockUser.phone || '',
        location: mockUser.location || '',
        bio: mockUser.bio || '',
        language_preference: 'english',
        notification_preferences: {
            email_notifications: true,
            sms_notifications: true,
            job_alerts: true,
            application_updates: true
        }
    });

    const handleSave = () => {
        // Local storage mock - in standalone mode
        toast.success('Settings updated successfully!');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your account and preferences</p>
                </div>

                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="bg-white border border-gray-200">
                        <TabsTrigger value="account" className="gap-2">
                            <User className="w-4 h-4" />
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="w-4 h-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="language" className="gap-2">
                            <Globe className="w-4 h-4" />
                            Language
                        </TabsTrigger>
                        <TabsTrigger value="privacy" className="gap-2">
                            <Shield className="w-4 h-4" />
                            Privacy
                        </TabsTrigger>
                    </TabsList>

                    {/* Account Tab */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
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
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="e.g., San Francisco, CA"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        placeholder="Tell employers about yourself..."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>

                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                                    Save Changes
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                                    { key: 'sms_notifications', label: 'SMS Notifications', desc: 'Receive SMS alerts' },
                                    { key: 'job_alerts', label: 'Job Alerts', desc: 'Get notified about new job postings' },
                                    { key: 'application_updates', label: 'Application Updates', desc: 'Updates on your applications' }
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
                                    Save Preferences
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Language Tab */}
                    <TabsContent value="language">
                        <Card>
                            <CardHeader>
                                <CardTitle>Language Preference</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Language</Label>
                                    <Select
                                        value={formData.language_preference}
                                        onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="english">English</SelectItem>
                                            <SelectItem value="spanish">Spanish (Español)</SelectItem>
                                            <SelectItem value="french">French (Français)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-gray-500">
                                        The platform interface will display in your selected language
                                    </p>
                                </div>

                                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
                                    Save Language
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy">
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy & Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                    <p className="text-sm text-blue-900">
                                        <strong>Your data is secure.</strong> We use industry-standard encryption to protect your personal information.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    <h4 className="font-semibold text-gray-900">Data Privacy</h4>
                                    <p className="text-sm text-gray-600">
                                        Your profile is only visible to verified employers. You control what information is shared.
                                    </p>

                                    <h4 className="font-semibold text-gray-900 pt-4">Account Security</h4>
                                    <p className="text-sm text-gray-600">
                                        We recommend enabling two-factor authentication for additional security.
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