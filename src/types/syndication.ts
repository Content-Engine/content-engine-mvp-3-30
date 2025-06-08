
export interface PaymentTier {
  id: 'basic' | 'pro' | 'executive';
  name: string;
  price: number;
  description: string;
  features: {
    syndicationAccounts: number;
    advancedDashboards: boolean;
    boostedSyndication: boolean;
    teamSeats: number;
    customAddOns: boolean;
  };
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'completed';
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  platforms?: string[];
  goal?: string;
  budget_allocated?: number;
  budget_spent?: number;
}

export interface ContentItem {
  id: string;
  campaign_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  thumbnail_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  campaign_id?: string;
  content_item_id?: string;
  platforms: string[];
  caption: string;
  media_urls?: string[];
  schedule_time: string;
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  boost_enabled?: boolean;
  ayrshare_post_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientToken {
  id: string;
  user_id: string;
  ayrshare_api_key: string;
  ayrshare_user_id: string;
  client_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
