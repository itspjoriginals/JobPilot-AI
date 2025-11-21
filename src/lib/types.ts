export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  applyStrategy: 'Aggressive' | 'Balanced' | 'Targeted';
  dailyApplyLimit: number;
  linkedInSessionStatus: 'active' | 'expired' | 'none';
  savedAnswers: {
    pattern: string;
    generatedAnswer: string;
  }[];
};

export type Job = {
  id: string;
  title: string;
  companyName: string;
  location: string;
  remoteType: 'Remote' | 'On-site' | 'Hybrid';
  seniorityLevel: 'Internship' | 'Entry-level' | 'Mid-Senior' | 'Senior' | 'Lead';
  jobScore: number;
  applyMethod: 'easy_apply' | 'external' | 'email';
  description: string;
  skills: string[];
  source: string;
  datePosted: string;
};

export type ParsedResume = {
    skills: {
      technical: string[];
      tools: string[];
      soft: string[];
    };
    experience: {
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      description: string;
    }[];
    projects: {
      name: string;
      description: string;
      tags: string[];
    }[];
}

export type Resume = {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  parsedData: ParsedResume;
};

export type ApplicationLog = {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: 'Success' | 'Failed' | 'Skipped';
  errorType?: string;
  timestamp: string;
  screenshotUrl?: string;
};

export type AdminDashboardData = {
  scraperHealth: {
    source: string;
    status: 'online' | 'offline' | 'error';
    lastRun: string;
  }[];
  automationSuccessRate: number;
  proxyPerformance: {
    proxy: string;
    successRate: number;
    avgLatency: number;
  }[];
  sessionExpiryAlerts: number;
  highRejectionAlerts: number;
};
