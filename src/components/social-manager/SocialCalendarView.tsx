
import { useState } from "react";
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
  Plus
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PostSchedulerModal from "./PostSchedulerModal";
import BoostPurchaseModal from "@/components/BoostPurchaseModal";

interface SocialCalendarViewProps {
  currentCampaign: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels';
  status: 'scheduled' | 'missing_caption' | 'needs_comments' | 'published';
  editor: string;
  time: string;
  views?: number;
  engagement?: number;
  boosted?: boolean;
}

const SocialCalendarView = ({ currentCampaign }: SocialCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock data - replace with real data fetching
  const [mockEvents, setMockEvents] = useState<Record<string, CalendarEvent[]>>({
    '2024-01-15': [
      {
        id: '1',
        title: 'Summer Vibes TikTok',
        platform: 'TikTok',
        status: 'scheduled',
        editor: 'Sarah J.',
        time: '14:00',
        views: 25400,
        engagement: 1200,
        boosted: true
      }
    ],
    '2024-01-16': [
      {
        id: '2',
        title: 'Product Showcase IG',
        platform: 'Instagram',
        status: 'missing_caption',
        editor: 'Mike C.',
        time: '18:00'
      }
    ]
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'missing_caption': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'needs_comments': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const handleScheduleContent = () => {
    setShowScheduleModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    console.log('Editing event:', event);
    toast({
      title: "Edit Content",
      description: `Opening editor for "${event.title}"`,
    });
    // Navigate to editor with event details
    navigate('/editor', { state: { eventId: event.id, event } });
  };

  const handleBoostEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowBoostModal(true);
  };

  const handleBoostPurchase = (boostData: any) => {
    if (selectedEvent) {
      // Update the event with boost status
      const updatedEvents = { ...mockEvents };
      const dateKey = format(selectedDate || new Date(), 'yyyy-MM-dd');
      if (updatedEvents[dateKey]) {
        const eventIndex = updatedEvents[dateKey].findIndex(e => e.id === selectedEvent.id);
        if (eventIndex !== -1) {
          updatedEvents[dateKey][eventIndex] = {
            ...updatedEvents[dateKey][eventIndex],
            boosted: true
          };
          setMockEvents(updatedEvents);
        }
      }
      
      toast({
        title: "Boost Applied",
        description: `"${selectedEvent.title}" has been boosted successfully!`,
      });
    }
    setShowBoostModal(false);
    setSelectedEvent(null);
  };

  const handleModalClose = () => {
    setShowScheduleModal(false);
    // Refresh data or handle any necessary updates after modal closes
    toast({
      title: "Content Scheduled",
      description: "New content has been added to the calendar.",
    });
  };

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
              const events = mockEvents[dateKey] || [];
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
                  onClick={() => setSelectedDate(day)}
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
                        `}
                      >
                        <div className="flex items-center gap-1">
                          <span>{getPlatformEmoji(event.platform)}</span>
                          <span className="truncate">{event.title}</span>
                          {event.boosted && <Zap className="h-3 w-3" />}
                        </div>
                        <div className="text-xs opacity-75">{event.time}</div>
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
              {mockEvents[format(selectedDate, 'yyyy-MM-dd')]?.map((event) => (
                <Card key={event.id} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPlatformEmoji(event.platform)}</span>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status.replace('_', ' ')}
                        </Badge>
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
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-white border-white/20"
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => handleBoostEvent(event)}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Boost
                      </Button>
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
      {selectedEvent && (
        <BoostPurchaseModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          content={{
            id: selectedEvent.id,
            campaignId: currentCampaign,
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
          onPurchase={handleBoostPurchase}
        />
      )}
    </div>
  );
};

export default SocialCalendarView;
