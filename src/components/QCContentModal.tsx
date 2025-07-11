import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MessageSquare, Calendar, User, ExternalLink, Zap } from "lucide-react";
import { QCContent } from "@/types/qc";
import QCCommentInput from "@/components/QCCommentInput";
import BoostPurchaseModal from "@/components/BoostPurchaseModal";

interface QCContentModalProps {
  content: QCContent;
  isOpen: boolean;
  onClose: () => void;
  onApproval: (contentId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => void;
}

const QCContentModal = ({ content, isOpen, onClose, onApproval }: QCContentModalProps) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const handleApproval = (status: 'approved' | 'rejected') => {
    onApproval(content.id, status);
    onClose();
  };

  const handleComment = (comment: string) => {
    onApproval(content.id, 'pending', comment);
    setShowCommentInput(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBoostBadge = () => {
    if (content.boostStatus === 'boosted') {
      return <Badge className="bg-orange-500 text-white">🔥 Boosted</Badge>;
    }
    if (content.boostStatus === 'scheduled') {
      return <Badge className="bg-blue-500 text-white">⚡ Scheduled Boost</Badge>;
    }
    return null;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {content.title}
              {getBoostBadge()}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Media Preview */}
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <video 
                  src={content.mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={content.thumbnailUrl}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Original
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  onClick={() => setShowBoostModal(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Boost Post
                </Button>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account</label>
                  <p className="font-medium">{content.accountName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Platform</label>
                  <p className="font-medium">{content.platform}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Editor</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{content.editorName}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {content.autoApproved && content.approvalStatus === 'approved' ? (
                      <Badge variant="secondary">Auto-approved</Badge>
                    ) : (
                      <Badge variant={content.approvalStatus === 'approved' ? 'default' : content.approvalStatus === 'rejected' ? 'destructive' : 'secondary'}>
                        {content.approvalStatus.charAt(0).toUpperCase() + content.approvalStatus.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Scheduled Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(content.scheduledDate)}</span>
                </div>
              </div>

              {content.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Approved By</label>
                  <p className="font-medium">{content.approvedBy}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(content.approvedAt!)}</p>
                </div>
              )}

              {/* Boost Purchase History */}
              {content.boostPurchases && content.boostPurchases.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Boost History</h4>
                  <div className="space-y-2">
                    {content.boostPurchases.map((boost) => (
                      <div key={boost.id} className="p-2 bg-muted/30 rounded-lg text-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{boost.tier} Boost</span>
                          <span className="text-muted-foreground">${boost.amount}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(boost.purchasedAt)} • {boost.reach ? `${boost.reach.toLocaleString()} reach` : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {content.approvalStatus === 'pending' && (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                    variant="outline"
                    onClick={() => handleApproval('approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    variant="outline"
                    onClick={() => handleApproval('rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowCommentInput(!showCommentInput)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>

              {showCommentInput && (
                <QCCommentInput
                  onSubmit={handleComment}
                  onCancel={() => setShowCommentInput(false)}
                />
              )}

              {/* Comments Thread */}
              <div className="space-y-4">
                <h3 className="font-semibold">Comments & Reviews</h3>
                {content.comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No comments yet</p>
                ) : (
                  <div className="space-y-3">
                    {content.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{comment.authorName}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BoostPurchaseModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        content={content}
      />
    </>
  );
};

export default QCContentModal;
