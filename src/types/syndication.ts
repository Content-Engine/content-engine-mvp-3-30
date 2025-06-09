
export interface PaymentTier {
  id: 'basic' | 'plus' | 'enterprise';
  name: string;
  price: number;
  features: {
    syndicationAccounts: number;
    advancedDashboards: boolean;
    boostedSyndication: boolean;
    teamSeats: number;
    customAddOns: boolean;
  };
  description: string;
}

export interface CycleProfile {
  id: string;
  campaignId: string;
  duration: 7 | 14 | 30;
  frequency: 'daily' | '3x-week' | 'weekly';
  platforms: Platform[];
  accountCount: number;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels';
  enabled: boolean;
  accountsAllocated: number;
}

export interface SyndicationCycle {
  id: string;
  cycleProfileId: string;
  startDate: string;
  endDate: string;
  posts: SyndicationPost[];
  metrics: CycleMetrics;
}

export interface SyndicationPost {
  id: string;
  platform: string;
  accountId: string;
  contentUrl: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'failed';
  metrics: PostMetrics;
}

export interface PostMetrics {
  views: number;
  shares: number;
  ctr: number;
  watchTime: number;
  engagement: number;
}

export interface CycleMetrics {
  totalViews: number;
  totalEngagement: number;
  avgCTR: number;
  bestPerformingPlatform: string;
  roi: number;
}
