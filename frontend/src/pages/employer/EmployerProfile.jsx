import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Briefcase, Calendar, Edit3, MessageCircle, Share2 } from 'lucide-react';
import employerService from '@/services/employerService';
import { aiService } from '@/services/aiService';
import { toast } from 'sonner';

const mock = {
  name: 'Samantha Perera',
  role: 'Homeowner',
  location: 'Colombo 05',
  contact: '077-9876543',
  ongoing: [
    { id: 1, title: 'Kitchen Faucet Replacement', progress: 60, eta: 'Today, 3:00 PM', note: 'Plumber assigned' },
    { id: 2, title: 'Window Repair', progress: 30, eta: 'Tomorrow, 10:00 AM', note: 'In inspection' }
  ],
  history: [
    { id: 'h1', title: 'Bathroom Re-tiling', summary: 'Completed full bathroom re-tiling and plumbing fixes. Satisfied with outcome.' },
    { id: 'h2', title: 'Ceiling Fan Install', summary: 'Installed 3 ceiling fans and replaced wiring in kitchen.' }
  ],
  rating: 4.6
};

export default function EmployerProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileRes = await employerService.getEmployerProfile(true);
      const statsRes = await employerService.getEmployerStats();
      const jobsRes = await employerService.getMyJobs();
      
      let reputationData = null;
      try {
        const repRes = await aiService.getMyReputation();
        reputationData = repRes.data;
      } catch (err) {
        console.warn('AI Reputation not available yet', err);
      }
      
      const profileInfo = {
        ...profileRes.data,
        stats: statsRes.data,
        jobs: jobsRes.data,
        aiReputation: reputationData
      };
      
      setProfileData(profileInfo);
      
      // Update AuthContext with profile data to sync with navbar
      const updatedUserData = {
        name: profileInfo.full_name || profileInfo.name || user?.name,
        full_name: profileInfo.full_name || user?.full_name,
        phone: profileInfo.phone_number || profileInfo.phone || user?.phone,
        location: profileInfo.city || profileInfo.location || user?.location,
        email: profileInfo.email || user?.email,
        avatar: profileInfo.profile_photo || user?.avatar,
        role: profileInfo.role || user?.role
      };
      
      updateUser(updatedUserData);
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
  const name = user?.name || data.name || 'Samantha Perera';
  const role = data.role || 'Homeowner';
  const location = user?.location || data.location || 'Colombo 05';
  const contact = user?.phone || data.contact || '077-9876543';
  const rating = data.stats?.rating || data.rating || 4.6;
  const trustScore = data.aiReputation?.trust_score || data.aiReputation?.trust || null;
  const ongoingJobs = data.ongoing || data.jobs?.filter(job => job.status === 'active' || job.status === 'in_progress') || mock.ongoing;
  const pastJobs = data.history || data.jobs?.filter(job => job.status === 'completed') || mock.history;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main profile & ongoing jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
                {name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">{name}</div>
                <div className="text-gray-500 mt-1">{role} • {location}</div>
                <div className="text-gray-600 mt-2">Contact: {contact}</div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-1">Rating</div>
                  <div className="flex items-center gap-1 justify-center">
                    <span className="text-2xl font-bold text-gray-900">{rating}</span>
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                {trustScore && (
                  <div className="text-center relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">AI Verified</div>
                    <div className="text-sm text-gray-500 mb-1 mt-2">Trust</div>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-2xl font-bold text-blue-600">{trustScore}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex items-center gap-2">
                <MessageCircle size={16} />
                Message
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 size={16} />
                Share Profile
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ongoing Jobs</h3>
            <div className="space-y-4">
              {ongoingJobs.map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{job.note} • {job.eta}</div>
                    </div>
                    <div className="text-sm font-bold text-blue-600">{job.progress}%</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Past Jobs</h3>
            <div className="space-y-4">
              {pastJobs.map((job) => (
                <div key={job.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="font-semibold text-gray-900">{job.title}</div>
                  <div className="text-gray-600 mt-2">{job.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sidebar summary */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-bold text-gray-900 mb-4">Household Details</div>
            <div className="text-sm text-gray-600 space-y-2">
              <div>Family size: 4</div>
              <div>Preferred hours: Morning & Afternoon</div>
              <div>Payment method: Online</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-bold text-gray-900 mb-4">Contact & Actions</div>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/employer/post-job')}
                className="w-full"
              >
                Create New Job
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/employer/jobs')}
                className="w-full"
              >
                View All Jobs
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
