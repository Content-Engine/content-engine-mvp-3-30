
export interface QCContent {
  id: string;
  campaignId: string;
  title: string;
  accountName: string;
  editorName: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels';
  scheduledDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  comments: QCComment[];
  autoApproved: boolean;
  mediaUrl: string;
  thumbnailUrl: string;
  timeToApprove?: number; // hours remaining
  boostStatus?: 'none' | 'boosted' | 'scheduled';
  boostTier?: 'micro' | 'standard' | 'premium';
  boostAmount?: number;
  boostPurchases?: BoostPurchase[];
}

export interface QCComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface BoostPurchase {
  id: string;
  tier: 'micro' | 'standard' | 'premium';
  amount: number;
  purchasedAt: string;
  reach?: number;
  status: 'active' | 'completed' | 'scheduled';
}

export interface QCFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  dateRange: {
    start: string;
    end: string;
  };
  platform: string;
}
