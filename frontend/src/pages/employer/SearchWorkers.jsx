import { useState, useEffect } from 'react';
import { Users, Star, CheckCircle2, UserCheck, Search as SearchIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

// Components
import WorkerCard from '../../components/employer/WorkerCard';
import WorkerFilters from '../../components/employer/WorkerFilters';
import WorkerProfileModal from '../../components/employer/WorkerProfileModal';
import InviteModal from '../../components/employer/InviteModal';

// API Services
import { employerService } from '../../services/employerService';
import { aiService } from '../../services/aiService';

const SearchWorkers = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  // Worker Data
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecommendationMode, setIsRecommendationMode] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetJobId = queryParams.get('jobId');

  // Job Data (Needed for Invite Modal)
  const [jobs, setJobs] = useState([]);

  // Modal State
  const [selectedWorker, setSelectedWorker] = useState(null); // For Profile Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false); // For Invite Modal
  const [workerToInvite, setWorkerToInvite] = useState(null); // Worker being invited

  // Filter Criteria
  const [filters, setFilters] = useState({
    searchQuery: '',
    availability: 'all',
    category: 'all',
    location: 'all',
    minRating: 'all',
    verified: 'all',
  });

  useEffect(() => {
    fetchWorkers();
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, workers]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      let res;
      if (targetJobId) {
        setIsRecommendationMode(true);
        res = await aiService.getRecommendedWorkers(targetJobId);
      } else {
        res = await employerService.searchWorkers();
      }

      const mapped = (res.data?.workers || res.data || []).map(w => {
        const name = w.name || `${w.first_name || ''} ${w.last_name || ''}`.trim() || 'Worker';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return {
          id: w.id || w.user_id,
          name,
          initials,
          verified: w.is_verified ?? w.verified ?? false,
          availability: w.availability || 'available',
          location: w.city || w.location || '',
          age: w.age || '',
          memberSince: w.created_at ? new Date(w.created_at).getFullYear() : '',
          rating: w.rating ?? 0,
          jobs: w.completed_jobs ?? w.jobs ?? 0,
          bio: w.bio || w.description || '',
          skills: w.skills || [],
          category: w.category || (w.skills && w.skills[0]) || '',
          completionRate: w.completion_rate ?? 0,
          responseTime: w.response_time || 'N/A',
          avatar: w.avatar || null,
        };
      });
      setWorkers(mapped);
      setFilteredWorkers(mapped);
    } catch {
      toast.error(t('searchWorkers.errors.fetchFailed') || "Failed to load workers");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await employerService.getMyJobs();
      const mapped = (res.data || []).map(j => ({
        id: j.id,
        title: j.title,
        description: j.description || '',
        location: j.city || '',
        budget: j.budget,
        salary: j.budget,
        duration: j.duration || '',
      }));
      setJobs(mapped);
    } catch (error) {
      console.error("Failed to load jobs for invite", error);
    }
  };

  const applyFilters = () => {
    let f = [...workers];

    // Filter by specific dropdowns
    if (filters.availability !== 'all') f = f.filter(w => w.availability === filters.availability);
    if (filters.category !== 'all') f = f.filter(w => w.category === filters.category);
    if (filters.location !== 'all') f = f.filter(w => w.location.includes(filters.location));
    if (filters.minRating !== 'all') f = f.filter(w => w.rating >= Number(filters.minRating));
    if (filters.verified !== 'all') f = f.filter(w => String(w.verified) === filters.verified);

    // Filter by search text (Name, Skill, Location, Category)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      f = f.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q)) ||
        w.location.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      );
    }
    setFilteredWorkers(f);
  };

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const clearAllFilters = () => setFilters({
    searchQuery: '', availability: 'all', category: 'all',
    location: 'all', minRating: 'all', verified: 'all'
  });

  const handleInviteClick = (worker) => {
    setWorkerToInvite(worker);
    setInviteModalOpen(true);
  };

  const handleSendInvite = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !workerToInvite) return;

    toast.loading("Sending invite...", { id: 'invite' });

    // Save mock message to local storage so Messages.jsx can read it
    const storedMessages = JSON.parse(localStorage.getItem('mock_messages')) || [];
    const messageText = `Hello ${workerToInvite.name.split(' ')[0]},

Based on your excellent profile and experience, I would like to officially invite you to apply for my open position: ${job.title}.

We are currently looking for a skilled professional to help us with this project, which is located in ${job.location} and is expected to take around ${job.duration || 'a reasonable timeframe'} to complete.

Job Description:
${job.description || 'Please review the attached job card for a complete overview of the work required.'}

We are offering Rs. ${job.budget || job.salary} for this work. If you are available and interested in taking this on, please accept this invitation below. Once accepted, we can discuss the exact dates, address, and any specific requirements in detail.

I look forward to hearing from you!

Best regards,
${user?.name || "Employer"}`;

    const newMessageObj = {
        id: Date.now(),
        text: messageText,
        sender: user?.name || "Employer",
        time: "Just now",
        sent: false,
        isJobInvite: true,
        jobDetails: {
            id: job.id,
            title: job.title,
            budget: job.budget,
            location: job.location
        }
    };

    const newChatId = Date.now();
    const newMessage = {
       id: newChatId,
       sender: user?.name || "Employer",
       preview: `Invitation to job: ${job.title}`,
       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
       unread: true,
       messages: [newMessageObj]
    };
    
    // Check if a conversation with this Employer already exists
    const existingIndex = storedMessages.findIndex(m => m.sender === (user?.name || "Employer"));
    if (existingIndex > -1) {
        // Append to existing conversation
        storedMessages[existingIndex].messages.push({ ...newMessageObj, time: newMessage.time });
        storedMessages[existingIndex].preview = `Invitation to job: ${job.title}`;
        storedMessages[existingIndex].unread = true;
        storedMessages[existingIndex].time = newMessage.time;
    } else {
        storedMessages.unshift(newMessage);
    }

    localStorage.setItem('mock_messages', JSON.stringify(storedMessages));
    
    updateUser({ messagesCount: (user?.messagesCount || 0) + 1 });
    
    toast.success("Invitation sent successfully!", { id: 'invite' });
    handleCloseInvite();
  };

  const handleCloseInvite = () => {
    setInviteModalOpen(false);
    setWorkerToInvite(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Toaster position="top-right" />

        {/* --- HEADER & STATS --- */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <SearchIcon className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
              {isRecommendationMode ? 'AI Recommended Workers' : (t('searchWorkers.title') || "Find Workers")}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {isRecommendationMode ? 'Here are the best matches for your job based on their skills and reputation.' : (t('searchWorkers.subtitle') || "Browse and invite top talent for your jobs")}
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><Users className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Total</p><p className="text-xl font-bold">{workers.length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><UserCheck className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Available</p><p className="text-xl font-bold">{workers.filter(w => w.availability === 'available').length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Verified</p><p className="text-xl font-bold">{workers.filter(w => w.verified).length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600"><Star className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Top Rated</p><p className="text-xl font-bold">{workers.filter(w => w.rating >= 4.5).length}</p></div>
            </div>
          </div>

          <WorkerFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            workersCount={filteredWorkers.length}
            totalWorkersCount={workers.length}
          />
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">{t('searchWorkers.loading') || "Loading..."}</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('searchWorkers.empty.title') || "No workers found"}</h3>
            <p className="text-gray-500 mb-6">{t('searchWorkers.empty.subtitle') || "Try adjusting your filters"}</p>
            <button onClick={clearAllFilters} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkers.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onViewProfile={setSelectedWorker}
                onInvite={() => handleInviteClick(worker)}
              />
            ))}
          </div>
        )}
      </div>

      {/*MODALS*/}

      {selectedWorker && (
        <WorkerProfileModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onInvite={() => {
            setSelectedWorker(null);
            handleInviteClick(selectedWorker);
          }}
        />
      )}

      {workerToInvite && (
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={handleCloseInvite}
          worker={workerToInvite}
          jobs={jobs}
          onSend={handleSendInvite}
        />
      )}
    </>
  );
};

export default SearchWorkers;