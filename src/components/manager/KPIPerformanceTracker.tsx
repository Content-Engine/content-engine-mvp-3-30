
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, MousePointer, Hash, Upload } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const KPIPerformanceTracker = () => {
  // Mock data for weekly views
  const weeklyViewsData = [
    { day: "Mon", views: 12400, engagement: 850 },
    { day: "Tue", views: 15200, engagement: 920 },
    { day: "Wed", views: 18900, engagement: 1150 },
    { day: "Thu", views: 14300, engagement: 890 },
    { day: "Fri", views: 21500, engagement: 1380 },
    { day: "Sat", views: 25800, engagement: 1650 },
    { day: "Sun", views: 23200, engagement: 1420 },
  ];

  // Mock data for top performing clips
  const topClips = [
    { title: "Morning Workout Routine", platform: "TikTok", views: 45200, ctr: 4.2, editor: "Sarah K." },
    { title: "Healthy Recipe Tutorial", platform: "Instagram", views: 38900, ctr: 3.8, editor: "Mike D." },
    { title: "Product Showcase", platform: "YouTube", views: 32100, ctr: 3.1, editor: "Alex R." },
    { title: "Behind the Scenes", platform: "Facebook", views: 28500, ctr: 2.9, editor: "Emma L." },
  ];

  // CTR by platform
  const platformCTR = [
    { platform: "TikTok", ctr: 4.1, change: 0.3 },
    { platform: "Instagram", ctr: 3.7, change: -0.1 },
    { platform: "YouTube", ctr: 3.2, change: 0.2 },
    { platform: "Facebook", ctr: 2.8, change: -0.2 },
  ];

  // Hashtag performance
  const hashtagPerformance = [
    { hashtag: "#fitness", usage: 45, avgViews: 18200, trending: true },
    { hashtag: "#recipe", usage: 38, avgViews: 15800, trending: false },
    { hashtag: "#tutorial", usage: 32, avgViews: 14300, trending: true },
    { hashtag: "#lifestyle", usage: 28, avgViews: 12100, trending: false },
  ];

  // Editor upload speed
  const editorStats = [
    { name: "Sarah K.", uploadsPerDay: 8.5, trend: "up" },
    { name: "Mike D.", uploadsPerDay: 7.2, trend: "stable" },
    { name: "Alex R.", uploadsPerDay: 6.8, trend: "down" },
    { name: "Emma L.", uploadsPerDay: 9.1, trend: "up" },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">131.3K</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold">3.45%</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.2%
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8 this week
                </p>
              </div>
              <Upload className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">8.26K</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3%
                </p>
              </div>
              <Hash className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Views & Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyViewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform CTR */}
        <Card>
          <CardHeader>
            <CardTitle>Platform CTR Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformCTR}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ctr" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Clips */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Clips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClips.map((clip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{clip.title}</p>
                    <p className="text-xs text-muted-foreground">{clip.platform} • {clip.editor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{clip.views.toLocaleString()} views</p>
                    <p className="text-xs text-green-600">{clip.ctr}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Editor Upload Speed */}
        <Card>
          <CardHeader>
            <CardTitle>Editor Upload Speed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {editorStats.map((editor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {editor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-sm">{editor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{editor.uploadsPerDay}/day</span>
                    {getTrendIcon(editor.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hashtag Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {hashtagPerformance.map((hashtag, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-600">{hashtag.hashtag}</span>
                  {hashtag.trending && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Used {hashtag.usage} times</p>
                <p className="text-sm font-medium">{hashtag.avgViews.toLocaleString()} avg views</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIPerformanceTracker;
