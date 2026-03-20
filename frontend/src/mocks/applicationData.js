// Available jobs for the Invite Modal
export const MOCK_JOBS = [
  { id: 'job_today', title: 'Office Deep Cleaning Service', budget: 45000, status: 'open', location: 'Colombo 03' },
  { id: 'job_3_months', title: 'Complete Garden Landscaping', budget: 12000, status: 'open', location: 'Nugegoda' },
  { id: 'job_last_week', title: 'Kitchen Electrical Wiring Update', budget: 8000, status: 'open', location: 'Kelaniya' },
];


export const MOCK_INVITATIONS = [
  { jobId: 'job_last_week', workerId: 'worker_005', status: 'sent', date: new Date().toISOString() }
];

// Stores active applications (Visible in Review Applications)
export const MOCK_APPLICATIONS = [

  {
    id: 101,
    jobId: 'job_last_week',
    name: 'Ruwan Bandara', initials: 'RB', verified: true,
    status: 'pending', // Pending = Accepted invite, waiting for employer to hire
    job: 'Kitchen Electrical Wiring Update',
    skills: ['Electrical Wiring', 'Panel Installation', 'Fault Finding'],
    rating: 4.9, jobs: 78, rate: '5,000',
    appliedDate: 'Mar 19, 2026', appliedAgo: 'Just now',
    bio: 'I received your invitation. I am available to handle the wiring project.',
    location: 'Galle', age: 38, phone: '+94 77 111 2222',
    completionRate: 100, responseTime: '< 1hr', memberSince: '2020',
    isInvited: true,
    reviews: [
      { id: 1, employer: 'Galle Fort Hotel', initials: 'GF', rating: 5, date: 'Feb 2026', comment: 'Perfect work. Fixed a complex fault.' }
    ],
  },


  {
    id: 1,
    jobId: 'job_today',
    name: 'Saman Perera', initials: 'SP', verified: true,
    status: 'pending',
    job: 'Office Deep Cleaning Service',
    skills: ['Cleaning', 'Gardening', 'Sanitizing', 'Floor Care'],
    rating: 4.6, jobs: 34, rate: '2,200',
    appliedDate: 'Feb 26, 2026', appliedAgo: '2h ago',
    bio: 'Thank you for the invite! I can bring my own equipment for the deep cleaning.',
    location: 'Colombo 03', age: 29, phone: '+94 77 123 4567',
    completionRate: 97, responseTime: '< 1hr', memberSince: '2022',
    isInvited: true, // Triggers purple "Invited" badge
    reviews: [
      { id: 1, employer: 'Kamal Enterprises', initials: 'KE', rating: 5, date: 'Jan 2026', comment: 'Excellent worker, very punctual and thorough.' },
      { id: 2, employer: 'Silva Holdings', initials: 'SH', rating: 5, date: 'Dec 2025', comment: 'Did a fantastic job.' },
    ],
  },

  {
    id: 2, jobId: 'job_3_months',
    name: 'Nimal Silva', initials: 'NS', verified: true, status: 'pending',
    job: 'Complete Garden Landscaping Project',
    skills: ['Gardening', 'Landscaping', 'Pruning', 'Irrigation'],
    rating: 4.2, jobs: 18, rate: '2,200',
    appliedDate: 'Feb 26, 2026', appliedAgo: '5h ago',
    bio: 'Passionate about creating beautiful outdoor spaces. Skilled in lawn care.',
    location: 'Nugegoda', age: 34, phone: '+94 71 234 5678',
    completionRate: 91, responseTime: '< 2hr', memberSince: '2023',
    isInvited: false,
    reviews: [
      { id: 1, employer: 'Sunshine Residences', initials: 'SR', rating: 5, date: 'Jan 2026', comment: 'Transformed our garden beautifully.' },
    ],
  },

  //HIRED WORKER
  {
    id: 3, jobId: 'job_last_week',
    name: 'Kasun Fernando', initials: 'KF', verified: false, status: 'accepted',
    job: 'Kitchen Electrical Wiring Update',
    skills: ['Heavy Lifting', 'Logistics', 'Forklift', 'Inventory'],
    rating: 4.8, jobs: 52, rate: '3,500',
    appliedDate: 'Feb 25, 2026', appliedAgo: '1d ago',
    bio: 'Strong and dependable warehouse worker.',
    location: 'Kelaniya', age: 27, phone: '+94 76 345 6789',
    completionRate: 99, responseTime: '< 30min', memberSince: '2021',
    isInvited: false,
    reviews: [
      { id: 1, employer: 'MAS Holdings', initials: 'MH', rating: 5, date: 'Feb 2026', comment: 'Exceptional worker.' },
    ],
  },

  // REJECTED APPLICANT
  {
    id: 4, jobId: 'job_today',
    name: 'Priya Jayawardena', initials: 'PJ', verified: true, status: 'rejected',
    job: 'Office Deep Cleaning Service',
    skills: ['Cleaning', 'Organizing', 'Ironing'],
    rating: 3.9, jobs: 11, rate: '2,200',
    appliedDate: 'Feb 24, 2026', appliedAgo: '2d ago',
    bio: 'Hardworking cleaner with strong attention to detail.',
    location: 'Maharagama', age: 31, phone: '+94 70 456 7890',
    completionRate: 85, responseTime: '< 3hr', memberSince: '2024',
    isInvited: false,
    reviews: [
      { id: 1, employer: 'Softlogic Office', initials: 'SO', rating: 4, date: 'Jan 2026', comment: 'Did a decent job cleaning the office.' },
    ],
  },


  {
    id: 5, jobId: 'job_last_week',
    name: 'Amara De Silva', initials: 'AD', verified: false, status: 'pending',
    job: 'Kitchen Electrical Wiring Update',
    skills: ['Cooking', 'Service', 'Food Safety', 'Bartending'],
    rating: 4.1, jobs: 9, rate: '1,800',
    appliedDate: 'Feb 26, 2026', appliedAgo: '4h ago',
    bio: 'Enthusiastic catering assistant with hotel experience.',
    location: 'Battaramulla', age: 24, phone: '+94 71 678 9012',
    completionRate: 88, responseTime: '< 2hr', memberSince: '2024',
    isInvited: false,
    reviews: [
      { id: 1, employer: 'Cinnamon Grand', initials: 'CG', rating: 4, date: 'Jan 2026', comment: 'Great attitude.' },
    ],
  },
];

// Helper to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const sendInviteAPI = async (jobId, worker) => {
  await delay(800);

  MOCK_INVITATIONS.push({
    jobId,
    workerId: worker.id,
    status: 'sent',
    date: new Date().toISOString()
  });

  return { success: true, message: 'Invite sent! Waiting for worker to accept.' };
};

// Fetch all applications
export const getAllApplicationsAPI = async () => {
  await delay();
  return { success: true, data: [...MOCK_APPLICATIONS] };
};

// Fetch applications for a specific job
export const getApplicationsByJobAPI = async (jobId) => {
  await delay();
  const data = jobId
    ? MOCK_APPLICATIONS.filter(a => a.jobId === jobId)
    : [...MOCK_APPLICATIONS];
  return { success: true, data };
};

// Update application status (e.g. Hire or Reject)
export const updateApplicationStatusAPI = async (id, newStatus) => {
  await delay();
  const app = MOCK_APPLICATIONS.find(a => a.id === id);
  if (app) {
    app.status = newStatus;
    return { success: true, data: app };
  }
  return { success: false, error: 'Application not found' };
};