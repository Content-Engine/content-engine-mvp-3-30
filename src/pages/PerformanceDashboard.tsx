
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Eye, Heart, Share, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const PerformanceDashboard = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const platformData = [
    { platform: "TikTok", views: 125000, engagement: 8.5, ctr: 3.2, color: "#ff0050" },
    { platform: "Instagram", views: 89000, engagement: 6.8, ctr: 2.8, color: "#E4405F" },
    { platform: "YouTube", views: 67000, engagement: 12.3, ctr: 4.1, color: "#FF0000" },
    { platform: "Facebook", views: 45000, engagement: 4.2, ctr: 1.9, color: "#1877F2" },
  ];

  const timeSeriesData = [
    { date: "Day 1", views: 5000, engagement: 250 },
    { date: "Day 2", views: 12000, engagement: 780 },
    { date: "Day 3", views: 28000, engagement: 1890 },
    { date: "Day 4", views: 45000, engagement: 3200 },
    { date: "Day 5", views: 67000, engagement: 4850 },
    { date: "Day 6", views: 89000, engagement: 6200 },
    { date: "Day 7", views: 125000, engagement: 8500 },
  ];

  const totalViews = platformData.reduce((sum, platform) => sum + platform.views, 0);
  const avgEngagement = platformData.reduce((sum, platform) => sum + platform.engagement, 0) / platformData.length;
  const totalCost = 599; // Mock campaign cost
  const estimatedRevenue = 2400; // Mock revenue
  const roi = ((estimatedRevenue - totalCost) / totalCost * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/campaigns-dashboard')}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 border-0">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Total Views</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-0">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{avgEngagement.toFixed(1)}%</div>
              <div className="text-white/80 text-sm">Avg Engagement</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{roi}%</div>
              <div className="text-white/80 text-sm">ROI</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 border-0">
            <CardContent className="p-6 text-center">
              <Share className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">4.2K</div>
              <div className="text-white/80 text-sm">Total Shares</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Performance */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Views by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="platform" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="views" fill="url(#gradient)" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="views"
                    label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
                  >
                    {platformData.map((entry, index) => (
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

        {/* Time Series Chart */}
        <Card className="bg-white/10 border-white/20 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Performance Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#82ca9d" 
                  strokeWidth={3}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Platform Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformData.map((platform) => (
            <Card
              key={platform.platform}
              className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">{platform.platform}</h4>
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/80">Views</span>
                    <span className="text-white font-semibold">{platform.views.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/80">Engagement</span>
                    <span className="text-white font-semibold">{platform.engagement}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/80">CTR</span>
                    <span className="text-white font-semibold">{platform.ctr}%</span>
                  </div>
                  
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(platform.views / totalViews) * 100}%`,
                        backgroundColor: platform.color
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Breakdown */}
        <Card className="bg-white/10 border-white/20 mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">💰 Campaign ROI Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">${totalCost}</div>
                <div className="text-white/80">Total Spend</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">${estimatedRevenue}</div>
                <div className="text-white/80">Generated Revenue</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{roi}%</div>
                <div className="text-white/80">Return on Investment</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
