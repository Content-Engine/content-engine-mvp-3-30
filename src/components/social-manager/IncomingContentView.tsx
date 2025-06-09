
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useIncomingContent } from "@/hooks/useIncomingContent";
import { 
  Inbox, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Zap
} from "lucide-react";

interface IncomingContentViewProps {
  currentCampaign: string;
}

const PLATFORM_ICONS = {
  'instagram': Instagram,
  'tiktok': () => <span className="text-lg">🎵</span>,
  'youtube': Youtube,
  'twitter': Twitter,
  'facebook': Facebook,
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  'assigned': 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  'scheduled': 'bg-green-500/20 text-green-400 border-green-500/50',
  'rejected': 'bg-red-500/20 text-red-400 border-red-500/50',
};

const CONTENT_TYPE_LABELS = {
  'short': 'Short Video',
  'graphic': 'Graphic',
  'quote': 'Quote',
  'meme': 'Meme',
  'testimonial': 'Testimonial',
  'ad': 'Advertisement',
};

const IncomingContentView = ({ currentCampaign }: IncomingContentViewProps) => {
  const { submissions, loading, errors, assignToEditor, addToScheduleQueue, updateSubmission } = useIncomingContent();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [selectedEditor, setSelectedEditor] = useState<{ [key: string]: string }>({});
  const [internalNotes, setInternalNotes] = useState<{ [key: string]: string }>({});
  const [boostSettings, setBoostSettings] = useState<{ [key: string]: boolean }>({});

  const canEdit = userRole && ['admin', 'social_media_manager'].includes(userRole);
  const canView = userRole && ['admin', 'social_media_manager', 'editor'].includes(userRole);

  if (!canView) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-main mb-2">Access Denied</h3>
        <p className="text-text-muted">You don't have permission to view incoming content.</p>
      </div>
    );
  }

  const handleAssignEditor = async (submissionId: string) => {
    const editorId = selectedEditor[submissionId];
    if (!editorId) {
      toast({
        title: "Error",
        description: "Please select an editor first",
        variant: "destructive",
      });
      return;
    }

    try {
      await assignToEditor(submissionId, editorId);
      toast({
        title: "Success",
        description: "Content assigned to editor successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign content to editor",
        variant: "destructive",
      });
    }
  };

  const handleAddToQueue = async (submission: any) => {
    try {
      // Update internal notes and boost settings if changed
      const updates: any = {};
      if (internalNotes[submission.id] !== submission.internal_notes) {
        updates.internal_notes = internalNotes[submission.id];
      }
      if (boostSettings[submission.id] !== submission.boost_requested) {
        updates.boost_requested = boostSettings[submission.id];
      }
      
      if (Object.keys(updates).length > 0) {
        await updateSubmission(submission.id, updates);
      }

      await addToScheduleQueue(submission);
      toast({
        title: "Success",
        description: "Content added to schedule queue",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add content to schedule queue",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'assigned': return <User className="h-4 w-4" />;
      case 'scheduled': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const errorCount = errors.length;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 loading-skeleton w-48 mb-4 mx-auto"></div>
          <div className="h-4 loading-skeleton w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <Card className="bg-card-bg/50 border-border-color">
        <CardHeader>
          <CardTitle className="text-text-main flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Incoming Content Submissions
            </div>
            <div className="flex items-center gap-4">
              {pendingCount > 0 && (
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  {pendingCount} Pending
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge className="bg-red-500/20 text-red-400">
                  {errorCount} Errors
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted">
            Review and manage content submissions from clients. Assign to editors and add to schedule queue.
          </p>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((submission) => (
          <Card key={submission.id} className="bg-card-bg border-border-color hover:border-accent/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${STATUS_COLORS[submission.status]}`}>
                  {getStatusIcon(submission.status)}
                  <span className="ml-1 capitalize">{submission.status}</span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {CONTENT_TYPE_LABELS[submission.content_type]}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Content Preview */}
              <div className="aspect-video bg-card-bg/50 rounded-lg border border-border-color flex items-center justify-center">
                {submission.content_url ? (
                  submission.content_type === 'short' ? (
                    <video 
                      src={submission.content_url} 
                      className="w-full h-full object-cover rounded-lg"
                      controls={false}
                      muted
                    />
                  ) : (
                    <img 
                      src={submission.content_url} 
                      alt="Content preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )
                ) : (
                  <div className="text-center text-text-muted">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Invalid content URL</p>
                  </div>
                )}
              </div>

              {/* Caption */}
              {submission.submitted_caption && (
                <div>
                  <p className="text-sm text-text-muted mb-1">Submitted Caption:</p>
                  <p className="text-text-main text-sm bg-card-bg/50 p-2 rounded">
                    {submission.submitted_caption}
                  </p>
                </div>
              )}

              {/* Platforms */}
              <div>
                <p className="text-sm text-text-muted mb-2">Preferred Platforms:</p>
                <div className="flex gap-2 flex-wrap">
                  {submission.preferred_platforms.map((platform) => {
                    const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS];
                    return Icon ? (
                      <div key={platform} className="flex items-center gap-1 text-text-main">
                        <Icon />
                        <span className="text-xs capitalize">{platform}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Campaign Tag */}
              {submission.campaign_tag && (
                <div>
                  <p className="text-sm text-text-muted">Campaign: {submission.campaign_tag}</p>
                </div>
              )}

              {canEdit && (
                <>
                  {/* Editor Assignment */}
                  {submission.status === 'pending' && (
                    <div className="space-y-2">
                      <Select 
                        value={selectedEditor[submission.id] || ''} 
                        onValueChange={(value) => setSelectedEditor(prev => ({ ...prev, [submission.id]: value }))}
                      >
                        <SelectTrigger className="bg-card-bg border-border-color">
                          <SelectValue placeholder="Assign to Editor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor1">Sarah K.</SelectItem>
                          <SelectItem value="editor2">Mike D.</SelectItem>
                          <SelectItem value="editor3">Alex R.</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => handleAssignEditor(submission.id)}
                        className="w-full btn-primary"
                        size="sm"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Assign Editor
                      </Button>
                    </div>
                  )}

                  {/* Boost Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-text-main">Boost</span>
                    </div>
                    <Switch
                      checked={boostSettings[submission.id] ?? submission.boost_requested}
                      onCheckedChange={(checked) => setBoostSettings(prev => ({ ...prev, [submission.id]: checked }))}
                    />
                  </div>

                  {/* Internal Notes */}
                  <div className="space-y-2">
                    <label className="text-sm text-text-muted">Internal Notes:</label>
                    <Textarea
                      value={internalNotes[submission.id] ?? submission.internal_notes ?? ''}
                      onChange={(e) => setInternalNotes(prev => ({ ...prev, [submission.id]: e.target.value }))}
                      placeholder="Add internal notes..."
                      className="bg-card-bg border-border-color text-text-main text-sm"
                      rows={2}
                    />
                  </div>

                  {/* Add to Schedule Button */}
                  {submission.status === 'assigned' && (
                    <Button 
                      onClick={() => handleAddToQueue(submission)}
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Schedule Queue
                    </Button>
                  )}
                </>
              )}

              {/* Metadata */}
              <div className="text-xs text-text-muted border-t border-border-color pt-2">
                <p>Submitted: {new Date(submission.submit_date).toLocaleDateString()}</p>
                {submission.assigned_editor_id && (
                  <p>Assigned to: Editor</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {submissions.length === 0 && (
        <Card className="bg-card-bg/50 border-border-color">
          <CardContent className="text-center py-12">
            <Inbox className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-main mb-2">No Submissions</h3>
            <p className="text-text-muted">
              No incoming content submissions at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncomingContentView;
