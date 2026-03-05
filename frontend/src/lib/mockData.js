// Mock data for standalone application mode
// This replaces API calls with local data

export const mockJobs = [
    {
        id: '1',
        title: 'Carpentry',
        company: 'Elite Woodworks',
        location: 'Colombo, Western Province',
        job_type: 'Part-time',
        salary: 4500,
        description: 'We are seeking a carpenter to lead custom framing and finish work for high-end residential projects.',
        requirements: 'Experience with custom framing and finish work',
        posted_date: new Date().toISOString(),
        status: 'open',
        category: 'Carpentry'
    },
    {
        id: '2',
        title: 'Electrical',
        company: 'PowerBright Systems',
        location: 'Badulla, Uva Province',
        job_type: 'Contract',
        salary: 8000,
        description: 'Experienced electrician needed for large-scale commercial installations and system upgrades.',
        requirements: 'Electrician License, commercial experience',
        posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'Electrical'
    },
    {
        id: '3',
        title: 'Construction',
        company: 'BuildIt Construction',
        location: 'Kandy, Central Province',
        job_type: 'Temporary',
        salary: 3500,
        description: 'Lead construction projects from planning to completion.',
        requirements: 'PMP certification, 7+ years of construction management',
        posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'Construction'
    },
    {
        id: '4',
        title: 'HVAC',
        company: 'Climate Control Pros',
        location: 'Galle, Southern Province',
        job_type: 'Contract',
        salary: 6000,
        description: 'Install, maintain, and repair heating, ventilation, and air conditioning systems.',
        requirements: 'HVAC Certification, 3+ years field experience, valid driver\'s license',
        posted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'HVAC'
    },
    {
        id: '5',
        title: 'Plumbing',
        company: 'FlowMasters Plumbing',
        location: 'Jaffna, Northern Province',
        job_type: 'On-call',
        salary: 2500,
        description: 'Residential and commercial plumbing repairs and installations.',
        requirements: 'Journeyman License, 4+ years experience, own tools',
        posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        category: 'Plumbing'
    }
];

export const mockCourses = [
    {
        id: '1',
        title: 'Carpentry',
        description: 'Learn framing and fine woodworking skills',
        category: 'trade_skills',
        duration: '12 weeks',
        lesson_count: 48,
        instructor: 'Mike "The Hammer" Wilson',
        image_url: null,
        enrollment_count: 1250
    },
    {
        id: '2',
        title: 'Job Site Communication',
        description: 'Master the art of professional communication on construction sites',
        category: 'soft_skills',
        duration: '4 weeks',
        lesson_count: 16,
        instructor: 'Sarah Johnson',
        image_url: null,
        enrollment_count: 890
    },
    {
        id: '3',
        title: 'Workplace Safety Fundamentals',
        description: 'Essential safety practices for construction sites',
        category: 'safety',
        duration: '2 weeks',
        lesson_count: 8,
        instructor: 'Mike Anderson',
        image_url: null,
        enrollment_count: 650
    },
    {
        id: '4',
        title: 'Business Spanish',
        description: 'Learn Spanish for professional settings',
        category: 'language',
        duration: '8 weeks',
        lesson_count: 32,
        instructor: 'Maria Garcia',
        image_url: null,
        enrollment_count: 420
    },
    {
        id: '5',
        title: 'Blueprint Reading & Estimation',
        description: 'Learn to read detailed plans and estimate material costs accurate',
        category: 'technical_skills',
        duration: '6 weeks',
        lesson_count: 24,
        instructor: 'David Lee',
        image_url: null,
        enrollment_count: 980
    },
    {
        id: '6',
        title: 'Personal Finance Management',
        description: 'Budgeting, investing, and financial planning',
        category: 'financial_literacy',
        duration: '4 weeks',
        lesson_count: 12,
        instructor: 'Emma Wilson',
        image_url: null,
        enrollment_count: 750
    }
];

export const mockEnrollments = [
    {
        id: '1',
        course_id: '1',
        course_title: 'Carpentry',
        worker_id: 'demo_user',
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 65,
        status: 'active'
    },
    {
        id: '2',
        course_id: '3',
        course_title: 'Workplace Safety Fundamentals',
        worker_id: 'demo_user',
        start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 100,
        status: 'completed'
    }
];

export const mockBadges = [
    {
        id: '1',
        name: 'Safety Champion',
        description: 'Completed all safety training courses',
        rarity: 'common',
        image_url: null
    },
    {
        id: '2',
        name: 'Skilled Worker',
        description: 'Completed 5 trade skill courses',
        rarity: 'rare',
        image_url: null
    },
    {
        id: '3',
        name: 'Team Player',
        description: 'Excellent collaboration and communication',
        rarity: 'epic',
        image_url: null
    },
    {
        id: '4',
        name: 'Excellence Award',
        description: 'Outstanding performance across all areas',
        rarity: 'legendary',
        image_url: null
    },
    {
        id: '5',
        name: 'Quick Learner',
        description: 'Completed 3 courses in under 30 days',
        rarity: 'rare',
        image_url: null
    }
];

export const mockWorkerBadges = [
    {
        id: '1',
        badge_id: '1',
        worker_id: 'demo_user',
        earned_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '2',
        badge_id: '5',
        worker_id: 'demo_user',
        earned_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    }
];

export const mockApplications = [
    {
        id: '1',
        job_id: '1',
        job_title: 'Carpentry',
        company: 'Elite Woodworks',
        applied_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        cover_message: 'I am excited to apply for this position...'
    },
    {
        id: '2',
        job_id: '4',
        job_title: 'HVAC',
        company: 'Climate Control Pros',
        applied_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'reviewed',
        cover_message: 'My experience in HVAC systems makes me a great fit...'
    },
    {
        id: '3',
        job_id: '2',
        job_title: 'Electrical',
        company: 'PowerBright Systems',
        applied_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'accepted',
        cover_message: 'I have a strong track record of electrical installations...'
    }
];

export const mockDocuments = [
    {
        id: '1',
        name: 'Resume - Updated 2024',
        type: 'resume',
        file_type: 'pdf',
        size: 245000,
        uploaded_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
    },
    {
        id: '2',
        name: 'Certification - Safety Training',
        type: 'certification',
        file_type: 'pdf',
        size: 180000,
        uploaded_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
    },
    {
        id: '3',
        name: 'Portfolio 2024',
        type: 'portfolio',
        file_type: 'pdf',
        size: 3200000,
        uploaded_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
    },
    {
        id: '4',
        name: 'Driver License',
        type: 'id',
        file_type: 'jpg',
        size: 450000,
        uploaded_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
    }
];

export const mockUser = {
    id: 'demo_user',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+94 77 123 4567',
    location: 'Colombo, Western Province',
    avatar_url: null,
    bio: 'Experienced professional looking for new opportunities'
};
