
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MessageSquare, Calendar, User, Zap, Play } from "lucide-react";
import { DayData, CalendarContent } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import BoostPurchaseModal from "@/components/BoostPurchaseModal";

interface CalendarDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData;
}

const CalendarDayModal = ({ isOpen, onClose, dayData }: CalendarDayModalProps) => {
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<CalendarContent | null>(null);
  const [showBoostModal, setShowBoostModal] = useState(false);

  // Mock content data for the day
  const mockContent: CalendarContent[] = [
    {
      id: "1",
      title: "Morning Workout Routine",
      platform: "TikTok",
      scheduledDate: dayData.date,
      scheduledTime: "09:00",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      editorName: "Sarah K.",
      approvalStatus: "approved",
      boostStatus: "boosted",
      boostTier: "standard",
      contentType: "Reel",
      campaignId: "camp-1",
      accountName: "@fitnesslife",
      comments: []
    },
    {
      id: "2",
      title: "Healthy Recipe Tutorial",
      platform: "Instagram",
      scheduledDate: dayData.date,
      scheduledTime: "14:00",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      editorName: "Mike D.",
      approvalStatus: "pending",
      boostStatus: "none",
      contentType: "Post",
      campaignId: "camp-2",
      accountName: "@healthykitchen",
      comments: []
    },
    {
      id: "3",
      title: "Product Showcase",
      platform: "YouTube Shorts",
      scheduledDate: dayData.date,
      scheduledTime: "18:00",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      editorName: "Alex R.",
      approvalStatus: "rejected",
      boostStatus: "none",
      contentType: "Ad",
      campaignId: "camp-3",
      accountName: "@brandstore",
      comments: [
        {
          id: "1",
          authorName: "QC Team",
          content: "Please adjust the lighting in the first 3 seconds",
          createdAt: new Date().toISOString()
        }
      ]
    }
  ];

  const handleApproval = (contentId: string, status: 'approved' | 'rejected') => {
    toast({
      title: status === 'approved' ? "Content Approved" : "Content Rejected",
      description: `Content has been ${status} successfully.`,
    });
  };

  const handleBoostClick = (content: CalendarContent) => {
    setSelectedContent(content);
    setShowBoostModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      'TikTok': '🎵',
      'Instagram': '📷',
      'YouTube Shorts': '📺',
      'Facebook Reels': '👥'
    };
    return icons[platform as keyof typeof icons] || '📱';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getBoostBadge = (boostStatus?: string, boostTier?: string) => {
    if (boostStatus === 'boosted') {
      return <Badge className="bg-orange-500 text-white ml-2">🔥 Boosted</Badge>;
    }
    if (boostStatus === 'scheduled') {
      return <Badge className="bg-blue-500 text-white ml-2">⚡ Scheduled</Badge>;
    }
    return null;
  };

  const isPastDate = new Date(dayData.date) < new Date();
  const isToday = new Date(dayData.date).toDateString() === new Date().toDateString();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {formatDate(dayData.date)}
              {isToday && <Badge className="bg-primary">Today</Badge>}
              {isPastDate && <Badge variant="secondary">Past</Badge>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Day Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{dayData.totalPosts}</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{dayData.pendingQC}</div>
                <div className="text-sm text-muted-foreground">Pending QC</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dayData.approvedQC}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dayData.boostedCount}</div>
                <div className="text-sm text-muted-foreground">Boosted</div>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Scheduled Content</h3>
              {mockContent.map((content) => (
                <div
                  key={content.id}
                  className={`
                    p-4 border rounded-lg transition-all
                    ${isPastDate ? 'bg-muted/50 opacity-60' : 'bg-card hover:shadow-md'}
                    ${isToday ? 'border-primary' : 'border-border'}
                    ${content.boostStatus === 'boosted' ? 'ring-2 ring-orange-200' : ''}
                    ${content.approvalStatus === 'pending' ? 'border-yellow-300' : ''}
                  `}
                >
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden group">
                      <img 
                        src={content.thumbnailUrl} 
                        alt="Content preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {content.title}
                            {getBoostBadge(content.boostStatus, content.boostTier)}
                          </h4>
                          <div className="text-sm text-muted-foreground flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <span className="text-lg">{getPlatformIcon(content.platform)}</span>
                              {content.platform}
                            </span>
                            <span>{content.accountName}</span>
                            <span>{content.scheduledTime}</span>
                          </div>
                        </div>
                        {getStatusBadge(content.approvalStatus)}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{content.editorName}</span>
                        <Badge variant="outline" className="text-xs">{content.contentType}</Badge>
                      </div>

                      {/* Comments */}
                      {content.comments.length > 0 && (
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground mb-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{content.comments.length} comment(s)</span>
                          </div>
                          <div className="text-xs text-muted-foreground italic">
                            "{content.comments[0].content}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {content.approvalStatus === 'pending' && !isPastDate && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApproval(content.id, 'approved')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleApproval(content.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      
                      {!isPastDate && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          onClick={() => handleBoostClick(content)}
                        >
                          <Zap className="h-4 w-4" />
                          Boost
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Boost Modal */}
      {selectedContent && (
        <BoostPurchaseModal
          isOpen={showBoostModal}
          onClose={() => setShowBoostModal(false)}
          content={{
            id: selectedContent.id,
            title: selectedContent.title,
            thumbnailUrl: selectedContent.thumbnailUrl,
            platform: selectedContent.platform,
            accountName: selectedContent.accountName,
            editorName: selectedContent.editorName,
            approvalStatus: selectedContent.approvalStatus,
            scheduledDate: selectedContent.scheduledDate,
            autoApproved: false,
            mediaUrl: selectedContent.mediaUrl,
            comments: selectedContent.comments,
            boostStatus: selectedContent.boostStatus,
            boostTier: selectedContent.boostTier
          }}
        />
      )}
    </>
  );
};

export default CalendarDayModal;
