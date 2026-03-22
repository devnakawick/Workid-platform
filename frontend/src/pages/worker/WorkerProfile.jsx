import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Briefcase, Calendar, CheckCircle2, ShieldCheck, Mail, Edit3 } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import workerService from '@/services/workerService';
import { toast } from 'sonner';

const mock = {
  experience: '5 Years Experience',
  phone: '077-1234567',
  location: 'Colombo 07',
  badges: [
    { text: 'ID Verified', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-blue-50', textColor: 'text-blue-700' },
    { text: 'Skill Verified', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-orange-50', textColor: 'text-orange-700' },
    { text: 'Safety Trained', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-emerald-50', textColor: 'text-emerald-700' }
  ],
  reputation: { rating: 4.8, jobsCompleted: 42, onTime: '97%', trust: '92%' },
  reviews: [
    { reviewer: 'S. Fernando', rating: 5.0, text: 'The work was completed on time and exceeded my expectations. Very professional.' },
    { reviewer: 'T. Perera', rating: 4.9, text: 'Very professional and friendly. Highly recommended for any home repair tasks.' },
    { reviewer: 'N. Silva', rating: 4.7, text: 'Quick and reliable service. Knew exactly what needed to be done.' }
  ]
};

export default function WorkerProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileRes = await workerService.getWorkerProfile();
      const statsRes = await workerService.getWorkerStats();
      
      const profileInfo = {
        ...profileRes.data,
        stats: statsRes.data
      };
      
      setProfileData(profileInfo);
      
      // Update AuthContext with profile data to sync with navbar
      const updatedUserData = {
        name: profileInfo.data?.full_name || profileInfo.data?.name || user?.name,
        phone: profileInfo.data?.phone_number || profileInfo.data?.phone || user?.phone,
        location: profileInfo.data?.city || profileInfo.data?.location || user?.location,
        email: profileInfo.data?.email || user?.email,
        avatar: profileInfo.data?.profile_photo || user?.avatar,
        role: profileInfo.data?.role || user?.role
      };
      
      updateUser(updatedUserData);
      
      // Also update localStorage for persistence
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      toast.error('Failed to load profile data');
      // Fallback to mock data if backend fails
      setProfileData(mock);
    } finally {
      setLoading(false);
    }
  };

  const data = profileData || mock;
  const name = user?.name || data.name || 'John Doe';
  const role = user?.role || data.role || 'Plumber';
  const phone = user?.phone || data.phone || '077-1234567';
  const location = user?.location || data.location || 'Colombo 07';
  const email = user?.email || data.email || 'john.doe@gmail.com';
  const experience = data.experience || '5 Years Experience';
  // Use avatar from user context first (synced from backend), then fallback to data
  const avatar = user?.avatar || data.avatar || data.profile_photo;
  const badges = data.badges || mock.badges;
  const reputation = data.stats || mock.reputation;
  const reviews = data.reviews || mock.reviews;
  const skills = data.skills || ['Professional Plumbing', 'Pipe Installation', 'Leak Repair', 'Bathroom Fitting', 'Emergency Repairs', 'Water Heater Maintenance'];

  // Helper function to check if field has actual data
  const hasData = (field) => field && field !== "" && field !== "Not specified";

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-5"></div>

            <div className="relative pt-4">
              <div className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-md overflow-hidden bg-white">
                {avatar ? (
                  <img src={avatar} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=ffadad`}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">{name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 text-gray-500 font-medium">
                <Briefcase size={16} />
                <span>{role} • {experience}</span>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {mock.badges.map((b, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${b.color} ${b.textColor}`}>
                    {b.icon}
                    {b.text}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4 text-left">
                {hasData(phone) && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-blue-600">
                      <Phone size={16} />
                    </div>
                    <span className="text-sm font-medium">{phone}</span>
                  </div>
                )}
                {hasData(location) && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-blue-600">
                      <MapPin size={16} />
                    </div>
                    <span className="text-sm font-medium">{location}</span>
                  </div>
                )}
                {hasData(email) && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-blue-600">
                      <Mail size={16} />
                    </div>
                    <span className="text-sm font-medium">{email}</span>
                  </div>
                )}
              </div>

              <Button
                onClick={() => navigate('/worker/settings')}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
              >
                <Edit3 size={18} />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Verification Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Strength</h3>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs font-bold text-gray-500">85% Complete</p>
          </div>
        </div>

        {/* Right Column: Details & Reviews */}
        <div className="lg:col-span-2 space-y-6">

          {/* Reputation Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Reputation Overview</h3>
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                <span className="text-xl font-bold text-orange-700">{reputation.rating || 4.8}</span>
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 text-center">
                <div className="text-3xl font-extrabold text-gray-900">{reputation.total_jobs_completed || reputation.jobsCompleted || 42}</div>
                <div className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">Jobs Completed</div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 text-center">
                <div className="text-3xl font-extrabold text-gray-900">{reputation.on_time_rate || reputation.onTime || '97%'}</div>
                <div className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">On-Time Rate</div>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 text-center">
                <div className="text-3xl font-extrabold text-blue-600">{reputation.trust_score || reputation.trust || '92%'}</div>
                <div className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">Trust Score</div>
              </div>
            </div>
          </div>

          {/* Verified Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary font-bold">Verified Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <div key={i} className="px-5 py-3 rounded-xl bg-blue-50/30 border border-blue-100 text-blue-800 text-sm font-bold transition-all hover:bg-blue-100/50 cursor-default">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Employer Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-8">What Employers Say</h3>
            <div className="space-y-6">
              {(showAllReviews ? reviews : reviews.slice(0, 2)).map((r, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                        {r.reviewer?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{r.reviewer || 'Anonymous'}</h4>
                        <div className="flex items-center gap-1 text-orange-400">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-bold">{r.rating || 5.0}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '2 weeks ago'}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">" {r.text || r.comment || 'Great work!'} "</p>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-6 text-blue-600 font-bold hover:bg-blue-50 rounded-xl py-6"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? "Show Less" : "View All Reviews"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
