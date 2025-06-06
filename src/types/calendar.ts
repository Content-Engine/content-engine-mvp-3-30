
export interface CalendarContent {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels';
  scheduledDate: string;
  scheduledTime: string;
  thumbnailUrl: string;
  mediaUrl: string;
  editorName: string;
  editorAvatar?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  boostStatus?: 'none' | 'boosted' | 'scheduled';
  boostTier?: 'micro' | 'standard' | 'premium';
  contentType: 'Reel' | 'Ad' | 'Post' | 'Story';
  campaignId: string;
  accountName: string;
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
}

export interface CalendarFilters {
  platform: string;
  contentType: string;
  editor: string;
  boostedOnly: boolean;
}

export interface DayData {
  date: string;
  totalPosts: number;
  pendingQC: number;
  approvedQC: number;
  rejectedQC: number;
  boostedCount: number;
  editors: string[];
  platforms: string[];
  content: CalendarContent[];
}
