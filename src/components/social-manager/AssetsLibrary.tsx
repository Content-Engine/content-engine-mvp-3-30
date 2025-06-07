
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FolderOpen,
  Search,
  Upload,
  Filter,
  Play,
  Music,
  Image,
  Video,
  FileText,
  ExternalLink,
  Replace,
  Grid3X3,
  List
} from "lucide-react";

interface AssetsLibraryProps {
  currentCampaign: string;
}

interface Asset {
  id: string;
  title: string;
  type: 'video' | 'image' | 'audio' | 'document';
  thumbnail: string;
  platforms: string[];
  funnelRole: string;
  song?: string;
  fileSize: string;
  duration?: string;
  uploadDate: string;
  campaign: string;
  driveLink?: string;
}

const AssetsLibrary = ({ currentCampaign }: AssetsLibraryProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    platform: 'all',
    campaign: 'all'
  });

  // Mock data - replace with real data fetching
  const assets: Asset[] = [
    {
      id: '1',
      title: 'Summer Dance Trend Video',
      type: 'video',
      thumbnail: '/placeholder.svg',
      platforms: ['TikTok', 'Instagram'],
      funnelRole: 'Awareness',
      song: 'Summer Beats - DJ Cool',
      fileSize: '24.5 MB',
      duration: '0:45',
      uploadDate: '2024-01-15',
      campaign: 'Summer Boost',
      driveLink: 'https://drive.google.com/example'
    },
    {
      id: '2',
      title: 'Product Showcase Images',
      type: 'image',
      thumbnail: '/placeholder.svg',
      platforms: ['Instagram', 'Facebook'],
      funnelRole: 'Conversion',
      fileSize: '8.2 MB',
      uploadDate: '2024-01-14',
      campaign: 'Product Launch'
    },
    {
      id: '3',
      title: 'Background Music Track',
      type: 'audio',
      thumbnail: '/placeholder.svg',
      platforms: ['TikTok', 'YouTube'],
      funnelRole: 'Retention',
      fileSize: '4.1 MB',
      duration: '2:30',
      uploadDate: '2024-01-13',
      campaign: 'Brand Awareness'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FolderOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500/20 text-purple-400';
      case 'image': return 'bg-blue-500/20 text-blue-400';
      case 'audio': return 'bg-green-500/20 text-green-400';
      case 'document': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || asset.type === filters.type;
    const matchesPlatform = filters.platform === 'all' || asset.platforms.includes(filters.platform);
    const matchesCampaign = filters.campaign === 'all' || asset.campaign === filters.campaign;
    
    return matchesSearch && matchesType && matchesPlatform && matchesCampaign;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="text-white/70 hover:text-white"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-white/70 hover:text-white"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Asset Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">File Type</label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Campaign</label>
              <Select value={filters.campaign} onValueChange={(value) => setFilters({...filters, campaign: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="Summer Boost">Summer Boost</SelectItem>
                  <SelectItem value="Product Launch">Product Launch</SelectItem>
                  <SelectItem value="Brand Awareness">Brand Awareness</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Drive Integration */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Google Drive Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Content Engine Drive</div>
              <div className="text-sm text-white/50">Sync assets from your Google Drive folder</div>
            </div>
            <Button variant="outline" className="text-white border-white/20">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Drive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assets Display */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Content Library
              <Badge className="bg-white/10 text-white/70">{filteredAssets.length} assets</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="relative mb-3">
                      <img
                        src={asset.thumbnail}
                        alt={asset.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={getTypeColor(asset.type)}>
                          {getTypeIcon(asset.type)}
                        </Badge>
                      </div>
                      {asset.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="h-8 w-8 text-white/70" />
                        </div>
                      )}
                      {asset.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {asset.duration}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-white font-medium text-sm line-clamp-2">{asset.title}</h4>
                      
                      <div className="flex flex-wrap gap-1">
                        {asset.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs text-white/70 border-white/20">
                            {platform}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-white/50 space-y-1">
                        <div>Size: {asset.fileSize}</div>
                        <div>Campaign: {asset.campaign}</div>
                        {asset.song && <div>♪ {asset.song}</div>}
                      </div>

                      <div className="flex gap-1 mt-3">
                        <Button size="sm" variant="outline" className="flex-1 text-white border-white/20 text-xs">
                          <Replace className="h-3 w-3 mr-1" />
                          Replace
                        </Button>
                        {asset.driveLink && (
                          <Button size="sm" variant="outline" className="text-white border-white/20">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{asset.title}</div>
                      <div className="text-sm text-white/50">{asset.campaign} • {asset.fileSize}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge className={getTypeColor(asset.type)}>
                      {getTypeIcon(asset.type)}
                      <span className="ml-1">{asset.type}</span>
                    </Badge>
                    
                    <div className="flex flex-wrap gap-1">
                      {asset.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs text-white/70 border-white/20">
                          {platform}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-white border-white/20">
                        <Replace className="h-3 w-3" />
                      </Button>
                      {asset.driveLink && (
                        <Button size="sm" variant="outline" className="text-white border-white/20">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetsLibrary;
