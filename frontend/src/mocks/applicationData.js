// Mock job list — to be replaced with real API data
export const MOCK_JOBS = [];

// Mock applications with worker details, skills and reviews
export const MOCK_APPLICATIONS = [
  {
    id: 1, jobId: 'job_today',
    name: 'Saman Perera', initials: 'SP', verified: true, status: 'pending',
    job: 'Office Deep Cleaning Service',
    skills: ['Cleaning', 'Gardening', 'Sanitizing', 'Floor Care'],
    rating: 4.6, jobs: 34, rate: '2,200',
    appliedDate: 'Feb 26, 2026', appliedAgo: '2h ago',
    bio: 'Experienced cleaning professional with 6 years in commercial and residential deep cleaning. Reliable, punctual and detail-oriented with a proven track record.',
    location: 'Colombo 03', age: 29, phone: '+94 77 123 4567',
    completionRate: 97, responseTime: '< 1hr', memberSince: '2022',
    reviews: [
      { id: 1, employer: 'Kamal Enterprises',  initials: 'KE', rating: 5, date: 'Jan 2026', comment: 'Excellent worker, very punctual and thorough. Would definitely hire again for future projects.' },
      { id: 2, employer: 'Silva Holdings',      initials: 'SH', rating: 5, date: 'Dec 2025', comment: 'Did a fantastic job. Went above and beyond what was expected. Highly recommended.' },
      { id: 3, employer: 'Perera & Sons',       initials: 'PS', rating: 4, date: 'Nov 2025', comment: 'Good work overall. Completed the task on time with minimal supervision.' },
      { id: 4, employer: 'Colombo Logistics',   initials: 'CL', rating: 4, date: 'Oct 2025', comment: 'Reliable and hardworking. Communication could be a bit better but overall satisfied.' },
      { id: 5, employer: 'Green Valley Hotels', initials: 'GV', rating: 3, date: 'Sep 2025', comment: 'Average performance. Completed the work but needed multiple reminders to stay on track.' },
    ],
  },
  {
    id: 2, jobId: 'job_3_months',
    name: 'Nimal Silva', initials: 'NS', verified: true, status: 'pending',
    job: 'Complete Garden Landscaping Project',
    skills: ['Gardening', 'Landscaping', 'Pruning', 'Irrigation'],
    rating: 4.2, jobs: 18, rate: '2,200',
    appliedDate: 'Feb 26, 2026', appliedAgo: '5h ago',
    bio: 'Passionate about creating beautiful outdoor spaces. Skilled in lawn care, hedge trimming and seasonal planting with an eye for design.',
    location: 'Nugegoda', age: 34, phone: '+94 71 234 5678',
    completionRate: 91, responseTime: '< 2hr', memberSince: '2023',
    reviews: [
      { id: 1, employer: 'Sunshine Residences', initials: 'SR', rating: 5, date: 'Jan 2026', comment: 'Transformed our garden beautifully. Very creative and hardworking.' },
      { id: 2, employer: 'Lanka Villas',         initials: 'LV', rating: 4, date: 'Nov 2025', comment: 'Good landscaping skills. Finished on schedule and cleaned up after the job.' },
      { id: 3, employer: 'Galle Fort Hotel',     initials: 'GF', rating: 4, date: 'Sep 2025', comment: 'Solid work on our garden beds. Would hire again for seasonal maintenance.' },
    ],
  },
  {
    id: 3, jobId: 'job_last_week',
    name: 'Kasun Fernando', initials: 'KF', verified: false, status: 'accepted',
    job: 'Kitchen Electrical Wiring Update',
    skills: ['Heavy Lifting', 'Logistics', 'Forklift', 'Inventory'],
    rating: 4.8, jobs: 52, rate: '3,500',
    appliedDate: 'Feb 25, 2026', appliedAgo: '1d ago',
    bio: 'Strong and dependable warehouse worker with experience handling heavy machinery and coordinating logistics teams across multiple sites.',
    location: 'Kelaniya', age: 27, phone: '+94 76 345 6789',
    completionRate: 99, responseTime: '< 30min', memberSince: '2021',
    reviews: [
      { id: 1, employer: 'MAS Holdings',      initials: 'MH', rating: 5, date: 'Feb 2026', comment: 'Exceptional worker. Handled the forklift with great precision and zero incidents.' },
      { id: 2, employer: 'DHL Sri Lanka',      initials: 'DL', rating: 5, date: 'Jan 2026', comment: 'One of the best warehouse staff we have hired. Fast, reliable and very professional.' },
      { id: 3, employer: 'Hayleys Logistics',  initials: 'HL', rating: 5, date: 'Dec 2025', comment: 'Outstanding performance throughout a very demanding project. Highly recommended.' },
      { id: 4, employer: 'Cargills Ceylon',    initials: 'CC', rating: 4, date: 'Oct 2025', comment: 'Very efficient and careful with goods handling. Showed up on time every day.' },
    ],
  },
  {
    id: 4, jobId: 'job_today',
    name: 'Priya Jayawardena', initials: 'PJ', verified: true, status: 'rejected',
    job: 'Office Deep Cleaning Service',
    skills: ['Cleaning', 'Organizing', 'Ironing'],
    rating: 3.9, jobs: 11, rate: '2,200',
    appliedDate: 'Feb 24, 2026', appliedAgo: '2d ago',
    bio: 'Hardworking cleaner with strong attention to detail. Looking for stable daily cleaning work in professional office environments.',
    location: 'Maharagama', age: 31, phone: '+94 70 456 7890',
    completionRate: 85, responseTime: '< 3hr', memberSince: '2024',
    reviews: [
      { id: 1, employer: 'Softlogic Office', initials: 'SO', rating: 4, date: 'Jan 2026', comment: 'Did a decent job cleaning the office. A few areas were missed but overall acceptable.' },
      { id: 2, employer: 'BT Options',       initials: 'BT', rating: 4, date: 'Nov 2025', comment: 'Showed up on time and worked hard. Would consider hiring again.' },
      { id: 3, employer: 'Dialog Axiata',    initials: 'DA', rating: 3, date: 'Sep 2025', comment: 'Work was satisfactory but needed guidance on some tasks. Room for improvement.' },
    ],
  },
  {
    id: 5, jobId: 'job_last_week',
    name: 'Amara De Silva', initials: 'AD', verified: false, status: 'pending',
    job: 'Kitchen Electrical Wiring Update',
    skills: ['Cooking', 'Service', 'Food Safety', 'Bartending'],
    rating: 4.1, jobs: 9, rate: '1,800',
    appliedDate: 'Feb 26, 2026', appliedAgo: '4h ago',
    bio: 'Enthusiastic catering assistant with hotel experience. Familiar with food safety standards and high-volume event service.',
    location: 'Battaramulla', age: 24, phone: '+94 71 678 9012',
    completionRate: 88, responseTime: '< 2hr', memberSince: '2024',
    reviews: [
      { id: 1, employer: 'Cinnamon Grand',     initials: 'CG', rating: 4, date: 'Jan 2026', comment: 'Great attitude and energy during our event. Handled the busy service well.' },
      { id: 2, employer: 'Jetwing Hotels',     initials: 'JH', rating: 4, date: 'Nov 2025', comment: 'Quick learner and very presentable. Guests responded positively.' },
      { id: 3, employer: 'Paradise Road Cafe', initials: 'PR', rating: 4, date: 'Sep 2025', comment: 'Helped out well during a busy weekend. Would invite back for future events.' },
    ],
  },
];

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Get all applications — used by ManageJobs to count per job
export const getAllApplicationsAPI = async () => {
  await delay();
  return { success: true, data: [...MOCK_APPLICATIONS] };
};

// Get applications filtered by jobId — used by ReviewApplications
export const getApplicationsByJobAPI = async (jobId) => {
  await delay();
  const data = jobId
    ? MOCK_APPLICATIONS.filter(a => a.jobId === jobId)
    : [...MOCK_APPLICATIONS];
  return { success: true, data };
};