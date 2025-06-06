
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ComposedChart,
  Area,
  AreaChart
} from "recharts";
import { 
  Eye, 
  Heart, 
  MousePointer, 
  TrendingUp, 
  DollarSign, 
  Target,
  RefreshCw,
  Download
} from "lucide-react";
import { AnalyticsService, CampaignMetrics } from "@/services/analyticsService";
import RealTimeMetrics from "./RealTimeMetrics";

interface AnalyticsDashboardProps {
  campaignId: string;
}

const AnalyticsDashboard = ({ campaignId }: AnalyticsDashboardProps) => {
  const [metrics, setMetrics] = useState<CampaignMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setRefreshing(true);
      const data = await AnalyticsService.fetchCampaignMetrics(campaignId);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching campaign metrics:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [campaignId]);

  const handleExportData = () => {
    if (!metrics) return;
    
    const csvData = [
      ['Metric', 'Value'],
      ['Total Views', metrics.totalViews],
      ['Total Engagement', metrics.totalEngagement],
      ['Total Clicks', metrics.totalClicks],
      ['Total Conversions', metrics.totalConversions],
      ['Total Spend', `$${metrics.totalSpend}`],
      ['Total Revenue', `$${metrics.totalRevenue}`],
      ['ROI', `${metrics.roi.toFixed(1)}%`],
      ['CTR', `${metrics.ctr.toFixed(2)}%`],
      ['Conversion Rate', `${metrics.conversionRate.toFixed(2)}%`],
      ['CPM', `$${metrics.cpm.toFixed(2)}`],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-${campaignId}-analytics.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Campaign Analytics</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            disabled={refreshing}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <RealTimeMetrics campaignId={campaignId} />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border-blue-400/30">
          <CardContent className="p-4 text-center">
            <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{metrics.totalViews.toLocaleString()}</div>
            <div className="text-blue-200 text-xs">Total Views</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-purple-400/30">
          <CardContent className="p-4 text-center">
            <Heart className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{metrics.totalEngagement.toLocaleString()}</div>
            <div className="text-purple-200 text-xs">Engagement</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/30">
          <CardContent className="p-4 text-center">
            <MousePointer className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{metrics.totalClicks.toLocaleString()}</div>
            <div className="text-green-200 text-xs">Total Clicks</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-600/20 border-orange-400/30">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-orange-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{metrics.totalConversions.toLocaleString()}</div>
            <div className="text-orange-200 text-xs">Conversions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border-yellow-400/30">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">${metrics.totalRevenue.toLocaleString()}</div>
            <div className="text-yellow-200 text-xs">Revenue</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border-emerald-400/30">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{metrics.roi.toFixed(1)}%</div>
            <div className="text-emerald-200 text-xs">ROI</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-white">{metrics.ctr.toFixed(2)}%</div>
            <div className="text-white/80 text-sm">Click-Through Rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-white">{metrics.conversionRate.toFixed(2)}%</div>
            <div className="text-white/80 text-sm">Conversion Rate</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-white">${metrics.cpm.toFixed(2)}</div>
            <div className="text-white/80 text-sm">CPM</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-white">
              ${metrics.totalSpend > 0 ? (metrics.totalRevenue / metrics.totalSpend).toFixed(2) : '0.00'}
            </div>
            <div className="text-white/80 text-sm">ROAS</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={metrics.timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#fff" fontSize={12} />
                <YAxis stroke="#fff" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area type="monotone" dataKey="views" fill="url(#viewsGradient)" stroke="#8884d8" />
                <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} />
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.platformBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="views"
                  label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.platformBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Spend Analysis */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Revenue vs Spend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={metrics.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#fff" fontSize={12} />
              <YAxis stroke="#fff" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1" 
                stroke="#82ca9d" 
                fill="url(#revenueGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stackId="2" 
                stroke="#ff7300" 
                fill="url(#spendGradient)" 
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
