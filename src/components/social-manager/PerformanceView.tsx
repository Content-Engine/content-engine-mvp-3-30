
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Share, 
  DollarSign,
  Globe,
  Users,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface PerformanceViewProps {
  currentCampaign: string;
}

const PerformanceView = ({ currentCampaign }: PerformanceViewProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [viewType, setViewType] = useState<'campaign' | 'global'>('campaign');

  // Mock data - replace with real data fetching
  const platformData = [
    { name: 'TikTok', impressions: 120000, engagement: 8500, ctr: 4.2 },
    { name: 'Instagram', impressions: 85000, engagement: 6200, ctr: 3.8 },
    { name: 'YouTube', impressions: 95000, engagement: 4800, ctr: 2.9 },
    { name: 'Facebook', impressions: 60000, engagement: 3200, ctr: 2.1 }
  ];

  const performanceData = [
    { date: 'Jan 1', views: 15000, engagement: 1200, saves: 450 },
    { date: 'Jan 8', views: 18500, engagement: 1450, saves: 520 },
    { date: 'Jan 15', views: 22000, engagement: 1800, saves: 680 },
    { date: 'Jan 22', views: 19500, engagement: 1650, saves: 590 },
    { date: 'Jan 29', views: 25000, engagement: 2100, saves: 750 }
  ];

  const topContent = [
    { id: '1', title: 'Summer Dance Trend', platform: 'TikTok', views: 45600, engagement: 4.8, roi: 320 },
    { id: '2', title: 'Product Showcase', platform: 'Instagram', views: 32400, engagement: 3.9, roi: 285 },
    { id: '3', title: 'Behind the Scenes', platform: 'YouTube', views: 28900, engagement: 3.2, roi: 240 }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewType === 'campaign' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewType('campaign')}
            className="text-white/70 hover:text-white"
          >
            Campaign View
          </Button>
          <Button
            variant={viewType === 'global' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewType('global')}
            className="text-white/70 hover:text-white"
          >
            Global View
          </Button>
        </div>

        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-white/70 hover:text-white"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">360K</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Engagement Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4.2%</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Boost ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">285%</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +45% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/70">Active Platforms</CardTitle>
            <Globe className="h-4 w-4 text-white/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">4</div>
            <p className="text-xs text-white/50">TikTok, IG, YouTube, FB</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000aa', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Bar dataKey="impressions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff70" />
                <YAxis stroke="#ffffff70" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000000aa', 
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }} 
                />
                <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-white/50 font-mono text-sm">#{index + 1}</div>
                  <div>
                    <div className="font-medium text-white">{content.title}</div>
                    <div className="text-sm text-white/50">{content.platform}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-white font-medium">{content.views.toLocaleString()}</div>
                    <div className="text-xs text-white/50">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-medium">{content.engagement}%</div>
                    <div className="text-xs text-white/50">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-medium">{content.roi}%</div>
                    <div className="text-xs text-white/50">ROI</div>
                  </div>
                  <Button size="sm" variant="outline" className="text-white border-white/20">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceView;
