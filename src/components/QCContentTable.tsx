
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, MessageSquare, Clock, Play, Lightning } from "lucide-react";
import { QCContent } from "@/types/qc";
import QCCommentInput from "@/components/QCCommentInput";

interface QCContentTableProps {
  content: QCContent[];
  onApproval: (contentId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => void;
  onContentClick: (content: QCContent) => void;
}

const QCContentTable = ({ content, onApproval, onContentClick }: QCContentTableProps) => {
  const [commentingId, setCommentingId] = useState<string | null>(null);

  const getPlatformIcon = (platform: string) => {
    const icons = {
      'TikTok': '🎵',
      'Instagram': '📷',
      'YouTube Shorts': '📺',
      'Facebook Reels': '👥'
    };
    return icons[platform as keyof typeof icons] || '📱';
  };

  const getStatusBadge = (status: string, autoApproved: boolean) => {
    if (autoApproved && status === 'approved') {
      return <Badge variant="secondary">Auto-approved</Badge>;
    }
    
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

  const getBoostBadge = (boostStatus?: string) => {
    if (boostStatus === 'boosted') {
      return <Badge className="bg-orange-500 text-white ml-2">🔥 Boosted</Badge>;
    }
    if (boostStatus === 'scheduled') {
      return <Badge className="bg-blue-500 text-white ml-2">⚡ Scheduled</Badge>;
    }
    return null;
  };

  const getTimeRemaining = (scheduledDate: string, status: string) => {
    if (status !== 'pending') return null;
    
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    const hoursRemaining = Math.max(0, Math.floor((scheduled.getTime() - now.getTime()) / (1000 * 60 * 60)));
    
    if (hoursRemaining === 0) return "Overdue";
    return `${hoursRemaining}h remaining`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleComment = (contentId: string, comment: string) => {
    onApproval(contentId, 'pending', comment);
    setCommentingId(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Preview</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Editor</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time Left</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {content.map((item) => (
            <>
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <div 
                    className="relative w-16 h-16 bg-muted rounded-lg cursor-pointer overflow-hidden group"
                    onClick={() => onContentClick(item)}
                  >
                    <img 
                      src={item.thumbnailUrl} 
                      alt="Content preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium flex items-center">
                      {item.title}
                      {getBoostBadge(item.boostStatus)}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.accountName}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                    <span className="text-sm">{item.platform}</span>
                  </div>
                </TableCell>
                <TableCell>{item.editorName}</TableCell>
                <TableCell>{formatDate(item.scheduledDate)}</TableCell>
                <TableCell>{getStatusBadge(item.approvalStatus, item.autoApproved)}</TableCell>
                <TableCell>
                  {getTimeRemaining(item.scheduledDate, item.approvalStatus) && (
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining(item.scheduledDate, item.approvalStatus)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    {item.approvalStatus === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => onApproval(item.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => onApproval(item.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-orange-600 border-orange-600 hover:bg-orange-50"
                      onClick={() => onContentClick(item)}
                    >
                      <Lightning className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCommentingId(commentingId === item.id ? null : item.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {commentingId === item.id && (
                <TableRow key={`${item.id}-comment`}>
                  <TableCell colSpan={8}>
                    <QCCommentInput
                      onSubmit={(comment) => handleComment(item.id, comment)}
                      onCancel={() => setCommentingId(null)}
                    />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QCContentTable;
