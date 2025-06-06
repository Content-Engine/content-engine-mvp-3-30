
export interface AnalyticsData {
  views: number;
  engagement: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  platform: string;
  date: string;
}

export interface CampaignMetrics {
  totalViews: number;
  totalEngagement: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  totalRevenue: number;
  roi: number;
  ctr: number;
  conversionRate: number;
  cpm: number;
  platformBreakdown: Array<{
    platform: string;
    views: number;
    engagement: number;
    spend: number;
    color: string;
  }>;
  timeSeriesData: Array<{
    date: string;
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
  }>;
}

export class AnalyticsService {
  // Mock data generator for development - replace with real API calls
  static generateMockData(campaignId: string): CampaignMetrics {
    const platforms = [
      { name: "TikTok", color: "#ff0050", weight: 0.4 },
      { name: "Instagram", color: "#E4405F", weight: 0.3 },
      { name: "YouTube", color: "#FF0000", weight: 0.2 },
      { name: "Facebook", color: "#1877F2", weight: 0.1 },
    ];

    const totalViews = Math.floor(Math.random() * 500000) + 100000;
    const totalClicks = Math.floor(totalViews * (Math.random() * 0.05 + 0.02));
    const totalConversions = Math.floor(totalClicks * (Math.random() * 0.1 + 0.05));
    const totalSpend = Math.floor(Math.random() * 2000) + 500;
    const totalRevenue = Math.floor(totalConversions * (Math.random() * 50 + 20));

    const platformBreakdown = platforms.map(platform => ({
      platform: platform.name,
      views: Math.floor(totalViews * platform.weight * (0.8 + Math.random() * 0.4)),
      engagement: Math.floor(Math.random() * 15000) + 5000,
      spend: Math.floor(totalSpend * platform.weight * (0.8 + Math.random() * 0.4)),
      color: platform.color,
    }));

    const timeSeriesData = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      const dayViews = Math.floor(totalViews / 14 * (0.5 + Math.random()));
      const dayClicks = Math.floor(dayViews * 0.03);
      const dayConversions = Math.floor(dayClicks * 0.08);
      
      return {
        date: date.toISOString().split('T')[0],
        views: dayViews,
        engagement: Math.floor(dayViews * 0.08),
        clicks: dayClicks,
        conversions: dayConversions,
        spend: Math.floor(totalSpend / 14),
        revenue: Math.floor(dayConversions * 35),
      };
    });

    const totalEngagement = platformBreakdown.reduce((sum, p) => sum + p.engagement, 0);
    const roi = totalRevenue > 0 ? ((totalRevenue - totalSpend) / totalSpend * 100) : 0;
    const ctr = totalViews > 0 ? (totalClicks / totalViews * 100) : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;
    const cpm = totalViews > 0 ? (totalSpend / totalViews * 1000) : 0;

    return {
      totalViews,
      totalEngagement,
      totalClicks,
      totalConversions,
      totalSpend,
      totalRevenue,
      roi,
      ctr,
      conversionRate,
      cpm,
      platformBreakdown,
      timeSeriesData,
    };
  }

  static async fetchCampaignMetrics(campaignId: string): Promise<CampaignMetrics> {
    // In production, this would make an API call to your backend
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateMockData(campaignId));
      }, 1000);
    });
  }

  static async fetchRealTimeMetrics(campaignId: string): Promise<{
    liveViews: number;
    liveEngagement: number;
    activeBoosts: number;
    platformActivity: Array<{ platform: string; activity: number; trend: 'up' | 'down' | 'stable' }>;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          liveViews: Math.floor(Math.random() * 1000) + 500,
          liveEngagement: Math.floor(Math.random() * 50) + 25,
          activeBoosts: Math.floor(Math.random() * 5) + 2,
          platformActivity: [
            { platform: "TikTok", activity: Math.floor(Math.random() * 300) + 100, trend: 'up' },
            { platform: "Instagram", activity: Math.floor(Math.random() * 200) + 80, trend: 'stable' },
            { platform: "YouTube", activity: Math.floor(Math.random() * 150) + 60, trend: 'down' },
            { platform: "Facebook", activity: Math.floor(Math.random() * 100) + 40, trend: 'up' },
          ],
        });
      }, 500);
    });
  }
}
