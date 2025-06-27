import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
  Zap,
  Plus,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCampaignData } from "@/hooks/useCampaignData";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import PostSchedulerModal from "./PostSchedulerModal";
import BoostPurchaseModal from "@/components/BoostPurchaseModal";
import CampaignDetailsModal from "./CampaignDetailsModal";
import CalendarDayDetailsModal from "./CalendarDayDetailsModal";

interface SocialCalendarViewProps {
  currentCampaign: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels';
  status: 'scheduled' | 'posted' | 'failed' | 'processing';
  editor: string;
  time: string;
  views?: number;
  engagement?: number;
  boosted?: boolean;
  type: 'post' | 'campaign';
  campaignId?: string;
  auto_generated?: boolean;
  retry_count?: number;
  last_error_message?: string;
}

const SocialCalendarView = ({ currentCampaign }: SocialCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showDayDetailsModal, setShowDayDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { campaigns, loading: campaignsLoading } = useCampaignData();
  const { posts: scheduledPosts, loading: postsLoading } = useScheduledPosts();

  const [calendarEvents, setCalendarEvents] = useState<Record<string, CalendarEvent[]>>({});

  console.log('📅 SocialCalendarView - Campaigns:', campaigns.length, 'Posts:', scheduledPosts.length);

  // Generate events from campaigns and scheduled posts
  useEffect(() => {
    console.log('🗓️ Generating calendar events from campaigns:', campaigns.length, 'and posts:', scheduledPosts.length);
    
    const events: Record<string, CalendarEvent[]> = {};

    // Add campaign launch events
    campaigns.forEach(campaign => {
      console.log('🔍 Processing campaign:', campaign.name, 'scheduled_start_date:', campaign.scheduled_start_date);
      
      if (campaign.scheduled_start_date) {
        const date = format(new Date(campaign.scheduled_start_date), 'yyyy-MM-dd');
        const time = campaign.scheduled_start_time || '09:00';
        
        if (!events[date]) {
          events[date] = [];
        }
        
        events[date].push({
          id: `campaign-${campaign.id}`,
          title: `📢 ${campaign.name} Launch`,
          platform: 'TikTok',
          status: 'scheduled',
          editor: 'System',
          time: time,
          boosted: false,
          type: 'campaign',
          campaignId: campaign.id
        });
        
        console.log('📅 Added campaign event:', campaign.name, 'for', date);
      }
    });

    // Add scheduled posts
    scheduledPosts.forEach(post => {
      console.log('🔍 Processing post:', post.caption.substring(0, 30), 'schedule_time:', post.schedule_time);
      
      const date = format(new Date(post.schedule_time), 'yyyy-MM-dd');
      const time = format(new Date(post.schedule_time), 'HH:mm');
      
      if (!events[date]) {
        events[date] = [];
      }

      // Determine platform emoji
      const primaryPlatform = post.platforms[0] || 'TikTok';
      const platformMap: Record<string, 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels'> = {
        'tiktok': 'TikTok',
        'instagram': 'Instagram', 
        'youtube': 'YouTube Shorts',
        'facebook': 'Facebook Reels'
      };

      events[date].push({
        id: post.id,
        title: post.caption.length > 30 ? `${post.caption.substring(0, 30)}...` : post.caption,
        platform: platformMap[primaryPlatform] || 'TikTok',
        status: post.status as 'scheduled' | 'posted' | 'failed' | 'processing',
        editor: 'Auto-generated',
        time: time,
        boosted: post.boost_enabled,
        type: 'post',
        campaignId: post.campaign_id || undefined,
        auto_generated: post.auto_generated || false,
        retry_count: post.retry_count || 0,
        last_error_message: post.last_error_message || undefined
      });
      
      console.log('📝 Added post event:', post.caption.substring(0, 20), 'for', date);
    });

    console.log('🎯 Total calendar events generated:', Object.keys(events).length, 'days with events');
    console.log('📊 Events breakdown:', events);
    setCalendarEvents(events);
  }, [campaigns, scheduledPosts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'posted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'processing': return <AlertCircle className="h-3 w-3" />;
      case 'posted': return <CheckCircle className="h-3 w-3" />;
      case 'failed': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
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

  const getEventTypeIcon = (event: CalendarEvent) => {
    if (event.type === 'campaign') {
      return <Target className="h-3 w-3" />;
    }
    return getPlatformEmoji(event.platform);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setShowDayDetailsModal(true);
  };

  const handleScheduleContent = () => {
    setShowScheduleModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    if (event.type === 'campaign') {
      setSelectedCampaignId(event.campaignId || null);
      setShowCampaignModal(true);
      return;
    }
    
    console.log('Editing event:', event);
    toast({
      title: "Edit Content",
      description: `Opening editor for "${event.title}"`,
    });
    navigate('/editor', { state: { eventId: event.id, event } });
  };

  const handleBoostEvent = (event: CalendarEvent) => {
    if (event.type === 'campaign') {
      toast({
        title: "Campaign Event",
        description: "Campaign launch events cannot be boosted individually",
      });
      return;
    }
    
    setSelectedEvent(event);
    setShowBoostModal(true);
  };

  const handleBoostModalClose = () => {
    if (selectedEvent) {
      // Update the event to show it's boosted
      const updatedEvents = { ...calendarEvents };
      const dateKey = format(selectedDate || new Date(), 'yyyy-MM-dd');
      if (updatedEvents[dateKey]) {
        const eventIndex = updatedEvents[dateKey].findIndex(e => e.id === selectedEvent.id);
        if (eventIndex !== -1) {
          updatedEvents[dateKey][eventIndex] = {
            ...updatedEvents[dateKey][eventIndex],
            boosted: true
          };
          setCalendarEvents(updatedEvents);
        }
      }
    }
    setShowBoostModal(false);
    setSelectedEvent(null);
  };

  const handleModalClose = () => {
    setShowScheduleModal(false);
    toast({
      title: "Content Scheduled",
      description: "New content has been added to the calendar.",
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (campaignsLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="text-white/70 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="text-white/70 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'month' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('month')}
            className="text-white/70 hover:text-white"
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
            className="text-white/70 hover:text-white"
          >
            Week
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleScheduleContent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Content
          </Button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4 text-sm text-slate-300">
        <p>📊 Debug: {campaigns.length} campaigns, {scheduledPosts.length} posts, {Object.keys(calendarEvents).length} event days</p>
        <p>🔍 Loading: Campaigns: {campaignsLoading ? 'Yes' : 'No'}, Posts: {postsLoading ? 'Yes' : 'No'}</p>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-black/30 backdrop-blur-lg border-white/10">
        <CardContent className="p-6">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-white/50 font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {calendarDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const events = calendarEvents[dateKey] || [];
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={dateKey}
                  className={`
                    min-h-[120px] p-2 rounded-lg border cursor-pointer transition-all
                    ${isToday ? 'bg-blue-500/20 border-blue-500/50' : 'bg-white/5 border-white/10'}
                    ${isSelected ? 'ring-2 ring-purple-500' : ''}
                    hover:bg-white/10
                  `}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="text-sm text-white/70 mb-2">
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`
                          text-xs p-1 rounded border ${getStatusColor(event.status)}
                          ${event.type === 'campaign' ? 'border-2 border-orange-500/50 bg-orange-500/20' : ''}
                          ${event.auto_generated ? 'border-l-2 border-l-blue-400' : ''}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEvent(event);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {getEventTypeIcon(event)}
                          {getStatusIcon(event.status)}
                          <span className="truncate flex-1">{event.title}</span>
                          {event.boosted && <Zap className="h-3 w-3" />}
                        </div>
                        <div className="text-xs opacity-75 flex items-center gap-1">
                          <span>{event.time}</span>
                          {event.retry_count && event.retry_count > 0 && (
                            <span className="text-yellow-400">({event.retry_count} retries)</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Details */}
      {selectedDate && (
        <Card className="bg-black/30 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calendarEvents[format(selectedDate, 'yyyy-MM-dd')]?.map((event) => (
                <Card key={event.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {event.type === 'campaign' ? (
                          <Badge className="bg-orange-500/20 text-orange-400">
                            📢 Campaign Launch
                          </Badge>
                        ) : (
                          <>
                            <span className="text-lg">{getPlatformEmoji(event.platform)}</span>
                            <Badge className={getStatusColor(event.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(event.status)}
                                {event.status}
                              </span>
                            </Badge>
                            {event.auto_generated && (
                              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                Auto
                              </Badge>
                            )}
                          </>
                        )}
                      </div>
                      {event.boosted && (
                        <Badge className="bg-orange-500/20 text-orange-400">
                          🔥 Boosted
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-white font-medium mb-2">{event.title}</h4>
                    
                    <div className="space-y-2 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{event.editor}</span>
                      </div>
                      {event.views && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>{event.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {event.engagement && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>{event.engagement.toLocaleString()} engagements</span>
                        </div>
                      )}
                      {event.last_error_message && (
                        <div className="text-red-400 text-xs">
                          Error: {event.last_error_message}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-white/20"
                        onClick={() => handleEditEvent(event)}
                      >
                        {event.type === 'campaign' ? 'View' : 'Edit'}
                      </Button>
                      {event.type !== 'campaign' && (
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => handleBoostEvent(event)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Boost
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <div className="col-span-full text-center text-white/50 py-8">
                  <p>No content scheduled for this day</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 text-white border-white/20"
                    onClick={handleScheduleContent}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Content
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Modal */}
      <PostSchedulerModal
        isOpen={showScheduleModal}
        onClose={handleModalClose}
      />

      {/* Boost Modal */}
      {selectedEvent && selectedEvent.type !== 'campaign' && (
        <BoostPurchaseModal
          isOpen={showBoostModal}
          onClose={handleBoostModalClose}
          content={{
            id: selectedEvent.id,
            campaignId: selectedEvent.campaignId || currentCampaign,
            title: selectedEvent.title,
            thumbnailUrl: "/placeholder.svg",
            platform: selectedEvent.platform,
            accountName: "@example",
            editorName: selectedEvent.editor,
            approvalStatus: "approved",
            scheduledDate: format(selectedDate || new Date(), 'yyyy-MM-dd'),
            autoApproved: false,
            mediaUrl: "/placeholder.svg",
            comments: [],
            boostStatus: selectedEvent.boosted ? "boosted" : "none"
          }}
        />
      )}

      {/* Campaign Details Modal */}
      <CampaignDetailsModal
        isOpen={showCampaignModal}
        onClose={() => setShowCampaignModal(false)}
        campaignId={selectedCampaignId}
      />

      {/* Day Details Modal */}
      {selectedDate && (
        <CalendarDayDetailsModal
          isOpen={showDayDetailsModal}
          onClose={() => setShowDayDetailsModal(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default SocialCalendarView;
