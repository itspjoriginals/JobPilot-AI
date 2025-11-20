import type { Job, Resume, ApplicationLog, AdminDashboardData, User } from './types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/user1/100/100',
  applyStrategy: 'Balanced',
  dailyApplyLimit: 20,
  linkedInSessionStatus: 'active',
  savedAnswers: [
    {
      pattern: 'How many years of experience do you have with React?',
      generatedAnswer: '5 years',
      updatedAt: new Date().toISOString(),
    },
    {
      pattern: 'What is your expected salary?',
      generatedAnswer: '$120,000 per year',
      updatedAt: new Date().toISOString(),
    },
  ],
};

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    companyName: 'TechCorp',
    location: 'San Francisco, CA',
    remoteType: 'Remote',
    seniorityLevel: 'Senior',
    jobScore: 92,
    applyMethod: 'easy_apply',
    description: 'Lead the development of our next-generation user interface. Requires 5+ years of React experience.',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    source: 'LinkedIn',
    datePosted: '2024-07-28',
  },
  {
    id: 'job-2',
    title: 'Backend Developer',
    companyName: 'DataSolutions',
    location: 'New York, NY',
    remoteType: 'Hybrid',
    seniorityLevel: 'Mid-Senior',
    jobScore: 85,
    applyMethod: 'external',
    description: 'Design and build scalable APIs and services. Experience with Node.js and AWS is a must.',
    skills: ['Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    source: 'Indeed',
    datePosted: '2024-07-27',
  },
  {
    id: 'job-3',
    title: 'Product Manager',
    companyName: 'Innovate LLC',
    location: 'Austin, TX',
    remoteType: 'On-site',
    seniorityLevel: 'Mid-Senior',
    jobScore: 78,
    applyMethod: 'email',
    description: 'Define product strategy and roadmap for our B2B SaaS platform.',
    skills: ['Product Management', 'Agile', 'JIRA', 'Market Research'],
    source: 'AngelList',
    datePosted: '2024-07-29',
  },
    {
    id: 'job-4',
    title: 'UI/UX Designer',
    companyName: 'CreativeMinds',
    location: 'Remote',
    remoteType: 'Remote',
    seniorityLevel: 'Entry-level',
    jobScore: 65,
    applyMethod: 'easy_apply',
    description: 'Create intuitive and beautiful user experiences for our mobile app.',
    skills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
    source: 'LinkedIn',
    datePosted: '2024-07-26',
  },
];

export const mockResumes: Resume[] = [
  {
    id: 'resume-1',
    name: 'Frontend Focused Resume',
    fileUrl: '/resumes/frontend.pdf',
    createdAt: '2024-07-01',
    parsedData: {
      skills: {
        technical: ['React', 'TypeScript', 'Next.js', 'JavaScript'],
        tools: ['Webpack', 'Babel', 'Git'],
        soft: ['Teamwork', 'Communication'],
      },
      experience: [
        {
          title: 'Senior Frontend Engineer',
          company: 'PreviousTech',
          startDate: '2020-01-01',
          endDate: '2024-01-01',
          description: 'Developed and maintained web applications.',
        },
      ],
      projects: [
        { name: 'Portfolio Site', description: 'Personal portfolio website.', tags: ['React'] },
      ],
    },
  },
  {
    id: 'resume-2',
    name: 'Full-Stack General Resume',
    fileUrl: '/resumes/fullstack.pdf',
    createdAt: '2024-06-15',
    parsedData: {
      skills: {
        technical: ['React', 'Node.js', 'Python', 'SQL'],
        tools: ['Docker', 'AWS', 'Git'],
        soft: ['Problem Solving', 'Leadership'],
      },
      experience: [
        {
          title: 'Software Engineer',
          company: 'AnotherCompany',
          startDate: '2018-06-01',
          endDate: '2020-01-01',
          description: 'Worked on both frontend and backend systems.',
        },
      ],
      projects: [
        { name: 'E-commerce Platform', description: 'Full-stack e-commerce site.', tags: ['React', 'Node.js'] },
      ],
    },
  },
];

export const mockApplicationLogs: ApplicationLog[] = [
  {
    id: 'log-1',
    jobId: 'job-prev-1',
    jobTitle: 'Software Engineer',
    companyName: 'Old Company',
    status: 'Success',
    timestamp: '2024-07-28T10:00:00Z',
  },
  {
    id: 'log-2',
    jobId: 'job-prev-2',
    jobTitle: 'DevOps Engineer',
    companyName: 'Cloud Services Inc.',
    status: 'Failed',
    errorType: 'CAPTCHA_DETECTED',
    timestamp: '2024-07-28T11:30:00Z',
    screenshotUrl: 'https://picsum.photos/seed/error1/600/400',
  },
  {
    id: 'log-3',
    jobId: 'job-prev-3',
    jobTitle: 'Data Analyst',
    companyName: 'Analytics Firm',
    status: 'Skipped',
    errorType: 'LOW_MATCH_SCORE',
    timestamp: '2024-07-27T14:00:00Z',
  },
];

export const mockAdminData: AdminDashboardData = {
  scraperHealth: [
    { source: 'LinkedIn', status: 'online', lastRun: new Date().toISOString() },
    { source: 'Indeed', status: 'online', lastRun: new Date().toISOString() },
    { source: 'Naukri', status: 'error', lastRun: new Date(Date.now() - 3600 * 1000 * 3).toISOString() },
  ],
  automationSuccessRate: 88,
  proxyPerformance: [
    { proxy: 'proxy-us-1', successRate: 99, avgLatency: 120 },
    { proxy: 'proxy-eu-1', successRate: 92, avgLatency: 250 },
    { proxy: 'proxy-us-2', successRate: 75, avgLatency: 400 },
  ],
  sessionExpiryAlerts: 3,
  highRejectionAlerts: 1,
};
