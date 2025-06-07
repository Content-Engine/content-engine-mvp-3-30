
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter,
  Share2,
  Target,
  Zap,
  MessageSquare,
  BarChart3,
  Edit,
  Flag,
  Calendar
} from "lucide-react";

interface SyndicationViewProps {
  currentCampaign: string;
}

interface SyndicationContent {
  id: string;
  title: string;
  platform: string;
  syndicationType: 'meme_page' | 'topic_page' | 'fan_page' | 'official';
  funnelStage: 'awareness' | 'retention' | 'conversion';
  boostsApplied: string[];
  status: 'scheduled' | 'live' | 'completed';
  scheduledDate: string;
  views: number;
  engagement: number;
  editor: string;
}

const SyndicationView = ({ currentCampaign }: SyndicationViewProps) => {
  const [filters, setFilters] = useState({
    platform: 'all',
    syndicationType: 'all',
    funnelStage: 'all',
    status: 'all'
  });

  // Mock data - replace with real data fetching
  const content: SyndicationContent[] = [
    {
      id: '1',
      title: 'Summer Vibes Dance Trend',
      platform: 'TikTok',
      syndicationType: 'meme_page',
      funnelStage: 'awareness',
      boostsApplied: ['Echo Clone', 'Comment Seeding'],
      status: 'live',
      scheduledDate: '2024-01-15T14:00:00Z',
      views: 45600,
      engagement: 2300,
      editor: 'Sarah J.'
    },
    {
      id: '2',
      title: 'Product Launch Announcement',
      platform: 'Instagram',
      syndicationType: 'official',
      funnelStage: 'conversion',
      boostsApplied: ['Premium Boost'],
      status: 'scheduled',
      scheduledDate: '2024-01-16T18:00:00Z',
      views: 0,
      engagement: 0,
      editor: 'Mike C.'
    },
    {
      id: '3',
      title: 'Behind the Scenes Content',
      platform: 'YouTube Shorts',
      syndicationType: 'fan_page',
      funnelStage: 'retention',
      boostsApplied: [],
      status: 'completed',
      scheduledDate: '2024-01-14T12:00:00Z',
      views: 12800,
      engagement: 890,
      editor: 'Emma D.'
    }
  ];

  const getSyndicationTypeColor = (type: string) => {
    switch (type) {
      case 'meme_page': return 'bg-purple-500/20 text-purple-400';
      case 'topic_page': return 'bg-blue-500/20 text-blue-400';
      case 'fan_page': return 'bg-pink-500/20 text-pink-400';
      case 'official': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getFunnelStageColor = (stage: string) => {
    switch (stage) {
      case 'awareness': return 'bg-yellow-500/20 text-yellow-400';
      case 'retention': return 'bg-blue-500/20 text-blue-400';
      case 'conversion': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500/20 text-green-400';
      case 'scheduled': return 'bg-purple-500/20 text-purple-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'TikTok': return '🎵';
      case 'Instagram': return '📷';
      case 'YouTube Shorts': return '📺';
      case 'Facebook Reels': return '👥';
      default: return '📱';
    }
  };

  const filteredContent = content.filter(item => {
    return (
      (filters.platform === 'all' || item.platform === filters.platform) &&
      (filters.syndicationType === 'all' || item.syndicationType === filters.syndicationType) &&
      (filters.funnelStage === 'all' || item.funnelStage === filters.funnelStage) &&
      (filters.status === 'all' || item.status === filters.status)
    );
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Content Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Platform</label>
              <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube Shorts">YouTube Shorts</SelectItem>
                  <SelectItem value="Facebook Reels">Facebook Reels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Syndication Type</label>
              <Select value={filters.syndicationType} onValueChange={(value) => setFilters({...filters, syndicationType: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meme_page">Meme Page</SelectItem>
                  <SelectItem value="topic_page">Topic Page</SelectItem>
                  <SelectItem value="fan_page">Fan Page</SelectItem>
                  <SelectItem value="official">Official</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Funnel Stage</label>
              <Select value={filters.funnelStage} onValueChange={(value) => setFilters({...filters, funnelStage: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="awareness">Awareness</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Syndication Dashboard
              <Badge className="bg-white/10 text-white/70">{filteredContent.length} items</Badge>
            </CardTitle>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Share2 className="h-4 w-4 mr-2" />
              Syndicate Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Content</TableHead>
                <TableHead className="text-white/70">Platform</TableHead>
                <TableHead className="text-white/70">Syndication</TableHead>
                <TableHead className="text-white/70">Funnel Stage</TableHead>
                <TableHead className="text-white/70">Boosts</TableHead>
                <TableHead className="text-white/70">Performance</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{item.title}</div>
                      <div className="text-sm text-white/50">by {item.editor}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPlatformEmoji(item.platform)}</span>
                      <span className="text-white">{item.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getSyndicationTypeColor(item.syndicationType)}>
                      {item.syndicationType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getFunnelStageColor(item.funnelStage)}>
                      <Target className="h-3 w-3 mr-1" />
                      {item.funnelStage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.boostsApplied.length > 0 ? (
                        item.boostsApplied.map((boost) => (
                          <Badge key={boost} className="bg-orange-500/20 text-orange-400 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            {boost}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-white/50 text-sm">No boosts</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <BarChart3 className="h-3 w-3" />
                        <span className="text-white">{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-white">{item.engagement.toLocaleString()}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-white border-white/20">
                        <Calendar className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-white border-white/20">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-white border-white/20">
                        <Flag className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SyndicationView;
