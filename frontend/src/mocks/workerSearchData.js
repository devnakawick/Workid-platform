// Simulate API delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Mock worker profiles with skills, reviews and availability
export const mockWorkers = [
  {
    id: 'worker_001',
    name: 'Saman Perera', initials: 'SP', verified: true,
    location: 'Colombo 03', age: 29, memberSince: '2022',
    rating: 4.6, jobs: 34, completionRate: 97, responseTime: '< 1hr',
    availability: 'available', rate: '2,200',
    bio: 'Experienced cleaning professional with 6 years in commercial and residential deep cleaning. Reliable, punctual and detail-oriented with a proven track record.',
    skills: ['Cleaning', 'Gardening', 'Sanitizing', 'Floor Care'],
    category: 'Cleaning',
    reviews: [
      { id: 1, employer: 'Kamal Enterprises', initials: 'KE', rating: 5, date: 'Jan 2026', comment: 'Excellent worker, very punctual and thorough. Would definitely hire again.' },
      { id: 2, employer: 'Silva Holdings',    initials: 'SH', rating: 5, date: 'Dec 2025', comment: 'Did a fantastic job. Went above and beyond what was expected.' },
      { id: 3, employer: 'Perera & Sons',     initials: 'PS', rating: 4, date: 'Nov 2025', comment: 'Good work overall. Completed the task on time.' },
    ],
  },
  {
    id: 'worker_002',
    name: 'Nimal Silva', initials: 'NS', verified: true,
    location: 'Nugegoda', age: 34, memberSince: '2023',
    rating: 4.2, jobs: 18, completionRate: 91, responseTime: '< 2hr',
    availability: 'available', rate: '2,200',
    bio: 'Passionate about creating beautiful outdoor spaces. Skilled in lawn care, hedge trimming and seasonal planting with an eye for design.',
    skills: ['Gardening', 'Landscaping', 'Pruning', 'Irrigation'],
    category: 'Gardening',
    reviews: [
      { id: 1, employer: 'Sunshine Residences', initials: 'SR', rating: 5, date: 'Jan 2026', comment: 'Transformed our garden beautifully. Very creative and hardworking.' },
      { id: 2, employer: 'Lanka Villas',        initials: 'LV', rating: 4, date: 'Nov 2025', comment: 'Good landscaping skills. Finished on schedule.' },
    ],
  },
  {
    id: 'worker_003',
    name: 'Kasun Fernando', initials: 'KF', verified: false,
    location: 'Kelaniya', age: 27, memberSince: '2021',
    rating: 4.8, jobs: 52, completionRate: 99, responseTime: '< 30min',
    availability: 'busy', rate: '3,500',
    bio: 'Strong and dependable warehouse worker with experience handling heavy machinery and coordinating logistics teams across multiple sites.',
    skills: ['Heavy Lifting', 'Logistics', 'Forklift', 'Inventory'],
    category: 'Delivery',
    reviews: [
      { id: 1, employer: 'MAS Holdings',     initials: 'MH', rating: 5, date: 'Feb 2026', comment: 'Exceptional worker. Handled the forklift with great precision.' },
      { id: 2, employer: 'DHL Sri Lanka',     initials: 'DL', rating: 5, date: 'Jan 2026', comment: 'One of the best warehouse staff we have hired.' },
      { id: 3, employer: 'Hayleys Logistics', initials: 'HL', rating: 5, date: 'Dec 2025', comment: 'Outstanding performance throughout a very demanding project.' },
    ],
  },
  {
    id: 'worker_004',
    name: 'Priya Jayawardena', initials: 'PJ', verified: true,
    location: 'Maharagama', age: 31, memberSince: '2024',
    rating: 3.9, jobs: 11, completionRate: 85, responseTime: '< 3hr',
    availability: 'available', rate: '2,200',
    bio: 'Hardworking cleaner with strong attention to detail. Looking for stable daily cleaning work in professional office environments.',
    skills: ['Cleaning', 'Organizing', 'Ironing'],
    category: 'Cleaning',
    reviews: [
      { id: 1, employer: 'Softlogic Office', initials: 'SO', rating: 4, date: 'Jan 2026', comment: 'Did a decent job cleaning the office. A few areas were missed but overall acceptable.' },
      { id: 2, employer: 'BT Options',       initials: 'BT', rating: 4, date: 'Nov 2025', comment: 'Showed up on time and worked hard.' },
    ],
  },
  {
    id: 'worker_005',
    name: 'Amara De Silva', initials: 'AD', verified: false,
    location: 'Battaramulla', age: 24, memberSince: '2024',
    rating: 4.1, jobs: 9, completionRate: 88, responseTime: '< 2hr',
    availability: 'available', rate: '1,800',
    bio: 'Enthusiastic catering assistant with hotel experience. Familiar with food safety standards and high-volume event service.',
    skills: ['Cooking', 'Service', 'Food Safety', 'Bartending'],
    category: 'Cleaning',
    reviews: [
      { id: 1, employer: 'Cinnamon Grand', initials: 'CG', rating: 4, date: 'Jan 2026', comment: 'Great attitude and energy during our event.' },
      { id: 2, employer: 'Jetwing Hotels', initials: 'JH', rating: 4, date: 'Nov 2025', comment: 'Quick learner and very presentable.' },
    ],
  },
  {
    id: 'worker_006',
    name: 'Ruwan Bandara', initials: 'RB', verified: true,
    location: 'Galle', age: 38, memberSince: '2020',
    rating: 4.9, jobs: 78, completionRate: 100, responseTime: '< 1hr',
    availability: 'available', rate: '5,000',
    bio: 'Master electrician with 15 years of experience in residential and commercial wiring. Certified and licensed. Safety-first approach.',
    skills: ['Electrical Wiring', 'Panel Installation', 'Fault Finding', 'Solar Systems'],
    category: 'Electrical',
    reviews: [
      { id: 1, employer: 'Galle Fort Hotel', initials: 'GF', rating: 5, date: 'Feb 2026', comment: 'Perfect work. Fixed a complex fault nobody else could.' },
      { id: 2, employer: 'Lanka Cement',     initials: 'LC', rating: 5, date: 'Jan 2026', comment: 'Very professional and knowledgeable. Completed ahead of schedule.' },
      { id: 3, employer: 'Sunshine Homes',   initials: 'SH', rating: 5, date: 'Dec 2025', comment: 'Installed our solar system flawlessly. Highly recommend.' },
    ],
  },
  {
    id: 'worker_007',
    name: 'Dinesh Kumara', initials: 'DK', verified: true,
    location: 'Kandy', age: 42, memberSince: '2019',
    rating: 4.7, jobs: 63, completionRate: 96, responseTime: '< 2hr',
    availability: 'busy', rate: '4,500',
    bio: 'Skilled mason and construction worker with over 20 years of experience. Specialised in brickwork, plastering and concrete construction.',
    skills: ['Brickwork', 'Plastering', 'Concrete', 'Scaffolding'],
    category: 'Construction',
    reviews: [
      { id: 1, employer: 'Kandy Constructions', initials: 'KC', rating: 5, date: 'Feb 2026', comment: 'Exceptional masonry work. Very experienced and professional.' },
      { id: 2, employer: 'Hill Top Villas',     initials: 'HT', rating: 5, date: 'Jan 2026', comment: 'Built our retaining wall perfectly. Great attention to detail.' },
    ],
  },
  {
    id: 'worker_008',
    name: 'Lakshmi Wijesinghe', initials: 'LW', verified: false,
    location: 'Negombo', age: 26, memberSince: '2023',
    rating: 4.3, jobs: 15, completionRate: 93, responseTime: '< 1hr',
    availability: 'available', rate: '2,800',
    bio: 'Professional painter specialising in interior and exterior painting. Experienced with all paint types and surface preparation techniques.',
    skills: ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Surface Prep'],
    category: 'Painting',
    reviews: [
      { id: 1, employer: 'Negombo Beach Hotel', initials: 'NB', rating: 4, date: 'Jan 2026', comment: 'Great painting work. Clean finish and no mess left behind.' },
      { id: 2, employer: 'Coastal Residences',  initials: 'CR', rating: 5, date: 'Nov 2025', comment: 'Beautiful work on our villa exterior. Very happy with the result.' },
    ],
  },
];

// Get all workers
export const getAllWorkersAPI = async () => {
  await delay();
  return { success: true, data: [...mockWorkers] };
};

// Get single worker by ID
export const getWorkerByIdAPI = async (workerId) => {
  await delay(400);
  const worker = mockWorkers.find(w => w.id === workerId);
  if (worker) return { success: true, data: { ...worker } };
  return { success: false, error: 'Worker not found' };
};