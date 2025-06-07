
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle, Play, MessageSquare, User, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QCContent {
  id: string;
  title: string;
  platform: string;
  editorName: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  thumbnailUrl: string;
  mediaUrl: string;
  campaignName: string;
  priority: 'low' | 'medium' | 'high';
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
}

const QualityControlManagerPanel = () => {
  const { toast } = useToast();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<QCContent | null>(null);
  const [newComment, setNewComment] = useState("");

  // Mock QC content data
  const qcContent: QCContent[] = [
    {
      id: "1",
      title: "Morning Workout Routine",
      platform: "TikTok",
      editorName: "Sarah K.",
      submissionDate: "2024-01-15T09:00:00Z",
      status: "pending",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      campaignName: "Fitness Q1",
      priority: "high",
      comments: []
    },
    {
      id: "2",
      title: "Healthy Recipe Tutorial",
      platform: "Instagram",
      editorName: "Mike D.",
      submissionDate: "2024-01-15T10:30:00Z",
      status: "approved",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      campaignName: "Food Content",
      priority: "medium",
      comments: [
        {
          id: "1",
          authorName: "QC Manager",
          content: "Great content! Approved for posting.",
          createdAt: "2024-01-15T11:00:00Z"
        }
      ]
    },
    {
      id: "3",
      title: "Product Showcase",
      platform: "YouTube Shorts",
      editorName: "Alex R.",
      submissionDate: "2024-01-15T14:00:00Z",
      status: "rejected",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      campaignName: "Tech Reviews",
      priority: "low",
      comments: [
        {
          id: "2",
          authorName: "QC Team",
          content: "Please adjust the lighting in the first 3 seconds and re-submit.",
          createdAt: "2024-01-15T15:00:00Z"
        }
      ]
    },
    {
      id: "4",
      title: "Behind the Scenes",
      platform: "Facebook Reels",
      editorName: "Emma L.",
      submissionDate: "2024-01-15T16:00:00Z",
      status: "flagged",
      thumbnailUrl: "/placeholder.svg",
      mediaUrl: "/placeholder.svg",
      campaignName: "Brand Story",
      priority: "high",
      comments: [
        {
          id: "3",
          authorName: "QC Manager",
          content: "Content flagged for brand guideline review.",
          createdAt: "2024-01-15T16:30:00Z"
        }
      ]
    }
  ];

  const filteredContent = qcContent.filter(content => {
    const statusMatch = filterStatus === "all" || content.status === filterStatus;
    const platformMatch = filterPlatform === "all" || content.platform === filterPlatform;
    return statusMatch && platformMatch;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      flagged: "bg-orange-100 text-orange-800"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "flagged": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const handleApproval = (contentId: string, status: 'approved' | 'rejected' | 'flagged') => {
    toast({
      title: `Content ${status}`,
      description: `Content has been ${status} successfully.`,
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedContent) return;

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the content.",
    });
    setNewComment("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Platform" />
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

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredContent.map((content) => (
          <Card key={content.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
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
                    <h4 className="font-medium text-sm">{content.title}</h4>
                    {getStatusIcon(content.status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{content.platform}</span>
                    <span>•</span>
                    <span>{content.campaignName}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <User className="h-3 w-3" />
                    <span>{content.editorName}</span>
                    <Calendar className="h-3 w-3 ml-2" />
                    <span>{formatDate(content.submissionDate)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getStatusBadge(content.status)}>
                      {content.status}
                    </Badge>
                    <span className={`text-xs font-medium ${getPriorityColor(content.priority)}`}>
                      {content.priority} priority
                    </span>
                  </div>

                  {/* Comments */}
                  {content.comments.length > 0 && (
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{content.comments.length} comment(s)</span>
                      </div>
                      <div className="text-xs text-muted-foreground italic line-clamp-2">
                        "{content.comments[content.comments.length - 1].content}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t">
                {content.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 flex-1"
                      onClick={() => handleApproval(content.id, 'approved')}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 flex-1"
                      onClick={() => handleApproval(content.id, 'rejected')}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50 flex-1"
                      onClick={() => handleApproval(content.id, 'flagged')}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Flag
                    </Button>
                  </div>
                )}

                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Add feedback comment..."
                    value={selectedContent?.id === content.id ? newComment : ""}
                    onChange={(e) => {
                      setSelectedContent(content);
                      setNewComment(e.target.value);
                    }}
                    className="text-xs min-h-[60px]"
                  />
                  {selectedContent?.id === content.id && newComment && (
                    <Button size="sm" onClick={handleAddComment} className="w-full">
                      Add Comment
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {qcContent.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {qcContent.filter(c => c.status === 'approved').length}
            </div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {qcContent.filter(c => c.status === 'rejected').length}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {qcContent.filter(c => c.status === 'flagged').length}
            </div>
            <div className="text-sm text-muted-foreground">Flagged</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QualityControlManagerPanel;
