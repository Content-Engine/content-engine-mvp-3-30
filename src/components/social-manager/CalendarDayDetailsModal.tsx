
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  Target,
  User,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { useCampaignData } from "@/hooks/useCampaignData";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";

interface CalendarDayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

interface DayEvent {
  id: string;
  title: string;
  type: 'post' | 'campaign';
  time: string;
  status: string;
  campaignId?: string;
  campaignName?: string;
  campaignGoal?: string;
  createdBy?: string;
  boosted?: boolean;
  platforms: string[];
}

const CalendarDayDetailsModal = ({ isOpen, onClose, selectedDate }: CalendarDayDetailsModalProps) => {
  const [dayEvents, setDayEvents] = useState<DayEvent[]>([]);
  const { campaigns } = useCampaignData();
  const { posts: scheduledPosts } = useScheduledPosts();

  useEffect(() => {
    if (!isOpen || !selectedDate) return;

    const events: DayEvent[] = [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');

    // Add campaign launch events
    campaigns.forEach(campaign => {
      if (campaign.scheduled_start_date) {
        const campaignDate = format(new Date(campaign.scheduled_start_date), 'yyyy-MM-dd');
        if (campaignDate === dateKey) {
          events.push({
            id: `campaign-${campaign.id}`,
            title: `${campaign.name} Launch`,
            type: 'campaign',
            time: campaign.scheduled_start_time || '09:00',
            status: 'scheduled',
            campaignId: campaign.id,
            campaignName: campaign.name,
            campaignGoal: campaign.goal || 'Not specified',
            createdBy: campaign.created_by || 'System',
            boosted: false,
            platforms: []
          });
        }
      }
    });

    // Add scheduled posts
    scheduledPosts.forEach(post => {
      const postDate = format(new Date(post.schedule_time), 'yyyy-MM-dd');
      if (postDate === dateKey) {
        const campaign = campaigns.find(c => c.id === post.campaign_id);
        events.push({
          id: post.id,
          title: post.caption.length > 50 ? `${post.caption.substring(0, 50)}...` : post.caption,
          type: 'post',
          time: format(new Date(post.schedule_time), 'HH:mm'),
          status: post.status,
          campaignId: post.campaign_id || undefined,
          campaignName: campaign?.name || post.campaign_name || 'Unknown Campaign',
          campaignGoal: campaign?.goal || 'Not specified',
          createdBy: campaign?.created_by || 'Unknown',
          boosted: post.boost_enabled,
          platforms: post.platforms || []
        });
      }
    });

    // Sort events by time
    events.sort((a, b) => a.time.localeCompare(b.time));
    setDayEvents(events);
  }, [isOpen, selectedDate, campaigns, scheduledPosts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'processing': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'posted': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'posted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok': return '🎵';
      case 'instagram': return '📷';
      case 'youtube': return '📺';
      case 'facebook': return '👥';
      default: return '📱';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5" />
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            <Badge variant="outline" className="ml-2 text-white border-white/30">
              {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {dayEvents.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No events scheduled for this day</p>
              <p className="text-sm">Use the schedule content button to add events</p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <Card key={event.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {event.type === 'campaign' ? (
                        <Target className="h-5 w-5 text-orange-400" />
                      ) : (
                        <span className="text-lg">
                          {event.platforms.map(p => getPlatformEmoji(p)).join('')}
                        </span>
                      )}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{event.title}</h3>
                        <p className="text-white/60 text-sm">
                          {event.type === 'campaign' ? 'Campaign Launch' : 'Scheduled Post'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(event.status)} border`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(event.status)}
                          {event.status}
                        </span>
                      </Badge>
                      {event.boosted && (
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <Zap className="h-3 w-3 mr-1" />
                          Boosted
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <Clock className="h-4 w-4" />
                        <span>Scheduled Time: {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <User className="h-4 w-4" />
                        <span>Created by: {event.createdBy}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <Target className="h-4 w-4" />
                        <span>Campaign: {event.campaignName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/70">
                        <span className="font-medium">Goal:</span>
                        <span>{event.campaignGoal}</span>
                      </div>
                    </div>
                  </div>

                  {event.platforms && event.platforms.length > 0 && (
                    <div className="mt-4">
                      <span className="text-white/70 text-sm mr-2">Platforms:</span>
                      <div className="flex gap-1 mt-1">
                        {event.platforms.map((platform, index) => (
                          <Badge key={index} variant="outline" className="text-xs text-white/80 border-white/20">
                            {getPlatformEmoji(platform)} {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="border-t border-white/10 pt-4 mt-4">
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-full text-white border-white/20 hover:bg-white/10"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDayDetailsModal;
