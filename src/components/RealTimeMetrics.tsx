
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnalyticsService } from "@/services/analyticsService";

interface RealTimeMetricsProps {
  campaignId: string;
}

interface RealTimeData {
  liveViews: number;
  liveEngagement: number;
  activeBoosts: number;
  platformActivity: Array<{
    platform: string;
    activity: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

const RealTimeMetrics = ({ campaignId }: RealTimeMetricsProps) => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const data = await AnalyticsService.fetchRealTimeMetrics(campaignId);
        setRealTimeData(data);
      } catch (error) {
        console.error('Error fetching real-time metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [campaignId]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/10 border-white/20">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-8 bg-white/20 rounded"></div>
              <div className="h-8 bg-white/20 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!realTimeData) return null;

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Live Metrics
          <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realTimeData.liveViews.toLocaleString()}
            </div>
            <div className="text-white/80 text-sm">Views/hour</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realTimeData.liveEngagement}
            </div>
            <div className="text-white/80 text-sm">Engagements/min</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {realTimeData.activeBoosts}
            </div>
            <div className="text-white/80 text-sm">Active Boosts</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white/90">Platform Activity</h4>
          {realTimeData.platformActivity.map((platform) => (
            <div
              key={platform.platform}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center">
                <span className="text-white font-medium">{platform.platform}</span>
                {getTrendIcon(platform.trend)}
              </div>
              <span className="text-white/80">
                {platform.activity} views/min
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMetrics;
