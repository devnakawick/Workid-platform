export const categories = [
  'Construction', 'Electrical', 'Plumbing', 'Carpentry',
  'Painting', 'Cleaning', 'Gardening', 'Delivery',
  'Masonry', 'Welding', 'Other'
];

export const jobStatuses = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

const getRecentDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockJobs = [
  {
    id: 'job_today',
    title: 'Office Deep Cleaning Service',
    description: 'Professional deep cleaning for 3-floor office building. Includes floor cleaning, window washing, carpet shampooing, and sanitization.',
    category: 'Cleaning',
    location: 'Colombo 09, Sri Lanka',
    salary: 2200,
    salaryPeriod: 'daily',
    duration: '5 days',
    workersNeeded: 4,
    requirements: [
      'Experience with commercial cleaning',
      'Own cleaning equipment preferred',
      'Attention to detail',
      'Reliable and punctual'
    ],
    status: 'open',
    postedDate: getRecentDate(0),
    applicationsCount: 3, 
    
  },
  {
    id: 'job_last_week',
    title: 'Kitchen Electrical Wiring Update',
    description: 'Complete rewiring of kitchen electrical system including new outlets, lighting fixtures, and safety upgrades. Must comply with local electrical codes.',
    category: 'Electrical',
    location: 'Nugegoda, Sri Lanka',
    salary: 7500,
    salaryPeriod: 'daily',
    duration: '3 days',
    workersNeeded: 1,
    requirements: [
      'Electrical certification required',
      'Experience with residential wiring',
      'Knowledge of Sri Lankan electrical codes'
    ],
    status: 'in-progress',
    postedDate: getRecentDate(5),
    applicationsCount: 2, 
    
  },
  {
    id: 'job_3_months',
    title: 'Complete Garden Landscaping Project',
    description: 'Full garden transformation for 2000 sq ft area. Includes lawn installation, flower bed creation, pathway construction with pavers, and plant selection/installation.',
    category: 'Gardening',
    location: 'Galle, Sri Lanka',
    salary: 2500,
    salaryPeriod: 'daily',
    duration: '2 weeks',
    workersNeeded: 3,
    requirements: [
      'Gardening and landscaping experience',
      'Knowledge of tropical plants',
      'Ability to operate basic garden equipment',
      'Creative design sense'
    ],
    status: 'completed',
    postedDate: getRecentDate(60),
    applicationsCount: 1, // ← matches app_006 in applicationData.js
    
  },
  {
    id: 'job_1_year_old',
    title: 'Experienced Mason Needed for House Construction',
    description: 'We are looking for an experienced mason to work on a residential house construction project. The work includes brick laying, plastering, and concrete work.',
    category: 'Masonry',
    location: 'Colombo 09, Sri Lanka',
    salary: 2500,
    salaryPeriod: 'daily',
    duration: '2 months',
    workersNeeded: 2,
    requirements: [
      'Minimum 3 years experience in masonry',
      'Own basic tools (trowel, level, etc.)',
      'Valid national ID required',
      'Physically fit for construction work'
    ],
    status: 'completed',
    postedDate: getRecentDate(400),
    applicationsCount: 0, // ← no applications in applicationData.js
    
  }
];

const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const createJobAPI = async (jobData) => {
  await delay();
  const newJob = {
    id: `job_${Date.now()}`,
    ...jobData,
    status: 'open',
    postedDate: new Date().toISOString(),
    applicationsCount: 0,
    assignedTo: null
  };
  mockJobs.unshift(newJob);
  return { success: true, data: newJob, message: 'Job posted successfully!' };
};

export const getAllJobsAPI = async () => {
  await delay(600);
  return { success: true, data: [...mockJobs] };
};

export const getJobByIdAPI = async (jobId) => {
  await delay(400);
  const job = mockJobs.find(j => j.id === jobId);
  if (job) return { success: true, data: { ...job } };
  return { success: false, error: 'Job not found' };
};

export const updateJobAPI = async (jobId, updatedData) => {
  await delay(700);
  const jobIndex = mockJobs.findIndex(j => j.id === jobId);
  if (jobIndex !== -1) {
    mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...updatedData, id: jobId, updatedDate: new Date().toISOString() };
    return { success: true, data: mockJobs[jobIndex], message: 'Job updated successfully!' };
  }
  return { success: false, error: 'Job not found' };
};

export const deleteJobAPI = async (jobId) => {
  await delay(500);
  const jobIndex = mockJobs.findIndex(j => j.id === jobId);
  if (jobIndex !== -1) {
    mockJobs.splice(jobIndex, 1);
    return { success: true, message: 'Job deleted successfully!' };
  }
  return { success: false, error: 'Job not found' };
};

export const updateJobStatusAPI = async (jobId, newStatus) => {
  await delay(500);
  const validStatuses = ['open', 'in-progress', 'completed'];
  if (!validStatuses.includes(newStatus)) return { success: false, error: 'Invalid status value' };
  const jobIndex = mockJobs.findIndex(j => j.id === jobId);
  if (jobIndex !== -1) {
    mockJobs[jobIndex].status = newStatus;
    mockJobs[jobIndex].statusUpdatedDate = new Date().toISOString();
    return { success: true, data: mockJobs[jobIndex], message: `Job status changed to ${newStatus}!` };
  }
  return { success: false, error: 'Job not found' };
};

export const getJobStatsAPI = async () => {
  await delay(300);
  const stats = {
    total: mockJobs.length,
    open: mockJobs.filter(j => j.status === 'open').length,
    inProgress: mockJobs.filter(j => j.status === 'in-progress').length,
    completed: mockJobs.filter(j => j.status === 'completed').length,
    totalApplications: mockJobs.reduce((sum, job) => sum + (job.applicationsCount || 0), 0)
  };
  return { success: true, data: stats };
};