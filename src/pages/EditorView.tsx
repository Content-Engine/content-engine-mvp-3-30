import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Upload, Trophy, Star, Zap } from "lucide-react";
import { CalendarContent } from "@/types/calendar";
import { useToast } from "@/hooks/use-toast";
import DiscordChatModule from "@/components/DiscordChatModule";

const EditorView = () => {
  const { toast } = useToast();
  const [myContent, setMyContent] = useState<CalendarContent[]>([]);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [stats, setStats] = useState({
    totalAssigned: 12,
    completed: 8,
    pending: 4,
    streak: 5,
    points: 240
  });

  useEffect(() => {
    // Mock editor's assigned content
    const mockEditorContent: CalendarContent[] = [
      {
        id: "1",
        title: "Morning Workout Routine",
        platform: "TikTok",
        scheduledDate: "2024-01-15",
        scheduledTime: "09:00",
        thumbnailUrl: "/placeholder.svg",
        mediaUrl: "/placeholder.svg",
        editorName: "Current User",
        approvalStatus: "pending",
        boostStatus: "none",
        contentType: "Reel",
        campaignId: "camp-1",
        accountName: "@fitnesslife",
        comments: []
      },
      {
        id: "2",
        title: "Healthy Recipe Tutorial",
        platform: "Instagram",
        scheduledDate: "2024-01-16",
        scheduledTime: "14:00",
        thumbnailUrl: "/placeholder.svg",
        mediaUrl: "/placeholder.svg",
        editorName: "Current User",
        approvalStatus: "approved",
        boostStatus: "boosted",
        boostTier: "standard",
        contentType: "Post",
        campaignId: "camp-2",
        accountName: "@healthykitchen",
        comments: []
      }
    ];
    setMyContent(mockEditorContent);
  }, []);

  const handleSubmitQC = (contentId: string) => {
    setMyContent(prev => prev.map(item => 
      item.id === contentId 
        ? { ...item, approvalStatus: 'approved' as const }
        : item
    ));
    setStats(prev => ({ ...prev, completed: prev.completed + 1, pending: prev.pending - 1, points: prev.points + 25 }));
    toast({
      title: "QC Submitted!",
      description: "Content submitted for quality control review. +25 points!",
    });
  };

  const pendingContent = myContent.filter(item => item.approvalStatus === 'pending');
  const completedContent = myContent.filter(item => item.approvalStatus === 'approved');

  // Get current campaign for Discord integration
  const currentCampaign = pendingContent.length > 0 ? pendingContent[0].campaignId : undefined;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className={`max-w-6xl mx-auto space-y-6 transition-all duration-300 ${!isChatCollapsed ? 'md:mr-84' : ''}`}>
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Editor Dashboard
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalAssigned}</div>
              <div className="text-sm text-muted-foreground">Total Assigned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-1">
                <Trophy className="h-5 w-5" />
                {stats.streak}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                <Star className="h-5 w-5" />
                {stats.points}
              </div>
              <div className="text-sm text-muted-foreground">Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Pending Review ({pendingContent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No pending content. Great job! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                {pendingContent.map((content) => (
                  <div key={content.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={content.thumbnailUrl} 
                          alt="Content preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium">{content.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {content.platform} • {content.accountName} • Due: {content.scheduledDate}
                          </div>
                          <Badge variant="outline" className="mt-1">{content.contentType}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSubmitQC(content.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit QC
                        </Button>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Fix
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed ({completedContent.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedContent.map((content) => (
                <div key={content.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img 
                        src={content.thumbnailUrl} 
                        alt="Content preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {content.title}
                          {content.boostStatus === 'boosted' && (
                            <Badge className="bg-orange-500 text-white">
                              <Zap className="h-3 w-3 mr-1" />
                              Boosted
                            </Badge>
                          )}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          {content.platform} • {content.accountName} • Scheduled: {content.scheduledDate}
                        </div>
                        <Badge variant="outline" className="mt-1">{content.contentType}</Badge>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ✅ Approved
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <Upload className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm">Upload New Content</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm">Claim More Slots</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <Trophy className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm">View Achievements</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discord Chat Module */}
      <DiscordChatModule
        isCollapsed={isChatCollapsed}
        onToggleCollapse={() => setIsChatCollapsed(!isChatCollapsed)}
        currentCampaign={currentCampaign}
      />
    </div>
  );
};

export default EditorView;
