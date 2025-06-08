
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { useAuth } from "@/hooks/useAuth";
import { useCampaignData } from "@/hooks/useCampaignData";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Zap,
  Edit,
  Trash2
} from "lucide-react";
import PostSchedulerModal from "./PostSchedulerModal";

const ContentCalendarView = ({ currentCampaign }: { currentCampaign: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const { posts, loading, error, deletePost } = useScheduledPosts();
  const { userRole } = useAuth();
  const { campaigns } = useCampaignData();
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'posted': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📷';
      case 'youtube': return '📺';
      case 'twitter': return '🐦';
      case 'facebook': return '👥';
      default: return '📱';
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
      toast({
        title: "Post Deleted",
        description: "The scheduled post has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = currentCampaign === "All Campaigns" 
    ? posts 
    : posts.filter(post => {
        const campaign = campaigns.find(c => c.id === post.campaign_id);
        return campaign?.name === currentCampaign;
      });

  const canManagePosts = userRole && ['admin', 'social_media_manager'].includes(userRole);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card-bg/50 border-border-color animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-card-bg/50 border-border-color">
        <CardContent className="p-6 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-main mb-2">Error Loading Posts</h3>
          <p className="text-text-muted">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Content Calendar
          </h2>
          <p className="text-text-muted">Schedule and manage social media posts</p>
        </div>
        {canManagePosts && (
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card-bg/50 border-border-color">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-text-main">{filteredPosts.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg/50 border-border-color">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {filteredPosts.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg/50 border-border-color">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Posted</p>
                <p className="text-2xl font-bold text-green-400">
                  {filteredPosts.filter(p => p.status === 'posted').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card-bg/50 border-border-color">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Failed</p>
                <p className="text-2xl font-bold text-red-400">
                  {filteredPosts.filter(p => p.status === 'failed').length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="bg-card-bg/50 border-border-color">
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-main mb-2">No Posts Scheduled</h3>
              <p className="text-text-muted mb-4">Start by scheduling your first social media post</p>
              {canManagePosts && (
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => {
            const campaign = campaigns.find(c => c.id === post.campaign_id);
            return (
              <Card key={post.id} className="bg-card-bg/50 border-border-color hover:bg-card-bg/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(post.status)}
                        <Badge className={getStatusColor(post.status)}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                        {post.boost_enabled && (
                          <Badge className="bg-orange-500/20 text-orange-400">
                            <Zap className="h-3 w-3 mr-1" />
                            Boosted
                          </Badge>
                        )}
                        {campaign && (
                          <Badge variant="outline" className="border-border-color text-text-muted">
                            {campaign.name}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-text-main mb-2 line-clamp-2">
                        {post.caption}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(post.schedule_time).toLocaleString()}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {post.platforms.map((platform, index) => (
                            <span key={index} className="text-lg">
                              {getPlatformEmoji(platform)}
                            </span>
                          ))}
                          <span className="ml-1">
                            {post.platforms.length} platform{post.platforms.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        {post.media_urls.length > 0 && (
                          <span>{post.media_urls.length} media file{post.media_urls.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    
                    {canManagePosts && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsModalOpen(true);
                          }}
                          className="text-text-muted border-border-color hover:text-text-main"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-400 border-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Post Scheduler Modal */}
      <PostSchedulerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
        existingPost={selectedPost}
      />
    </div>
  );
};

export default ContentCalendarView;
