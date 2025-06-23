
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QCFilterBar from "@/components/QCFilterBar";
import QCContentTable from "@/components/QCContentTable";
import QCContentModal from "@/components/QCContentModal";
import { QCContent, QCFilters } from "@/types/qc";
import { fetchQCContent, updateQCSubmissionStatus } from "@/services/qcService";
import { useAuth } from "@/hooks/useAuth";

const QualityControlPanel = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [content, setContent] = useState<QCContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<QCContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<QCContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QCFilters>({
    status: 'all',
    dateRange: {
      start: '',
      end: ''
    },
    platform: 'all'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading QC content...');
      
      const data = await fetchQCContent();
      console.log('Loaded QC content:', data);
      
      setContent(data);
      setFilteredContent(data);
      
      if (data.length === 0) {
        toast({
          title: "No Content Found",
          description: "No QC submissions found. Sample data has been loaded for demonstration.",
        });
      }
    } catch (error) {
      console.error('Error loading QC content:', error);
      setError('Failed to load content for review');
      toast({
        title: "Error",
        description: "Failed to load content for review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let filtered = content;

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.approvalStatus === filters.status);
    }

    if (filters.platform !== 'all') {
      filtered = filtered.filter(item => item.platform === filters.platform);
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.scheduledDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredContent(filtered);
  }, [content, filters]);

  const handleApproval = async (contentId: string, status: 'approved' | 'rejected' | 'pending', comment?: string) => {
    try {
      console.log(`Updating content ${contentId} to status: ${status}`, comment ? `with comment: ${comment}` : '');
      
      const result = await updateQCSubmissionStatus(contentId, status, comment);
      
      if (result.success) {
        // Update local state optimistically
        setContent(prev => prev.map(item => 
          item.id === contentId 
            ? {
                ...item,
                approvalStatus: status,
                approvedAt: status !== 'pending' ? new Date().toISOString() : item.approvedAt,
                comments: comment ? [...item.comments, {
                  id: Date.now().toString(),
                  authorName: 'Current User',
                  content: comment,
                  createdAt: new Date().toISOString()
                }] : item.comments
              }
            : item
        ));

        const toastMessages = {
          approved: "Content Approved",
          rejected: "Content Rejected", 
          pending: comment ? "Comment Added" : "Status Updated"
        };

        const toastDescriptions = {
          approved: "Content has been approved successfully.",
          rejected: "Content has been rejected and sent back for revision.",
          pending: comment ? "Your comment has been added to the content." : "Content status updated."
        };

        toast({
          title: toastMessages[status],
          description: toastDescriptions[status],
        });
      } else {
        throw new Error(result.error?.message || 'Failed to update submission status');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: `Failed to ${status === 'pending' && comment ? 'add comment' : status + ' content'}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleContentClick = (contentItem: QCContent) => {
    setSelectedContent(contentItem);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadContent();
  };

  // Check if user has permission to access QC panel
  const canAccessQC = userRole && ['admin', 'social_media_manager'].includes(userRole);

  if (!canAccessQC) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-white/60 mb-6">
              You don't have permission to access the Quality Control Panel. 
              This feature is only available to Social Media Managers and Administrators.
            </p>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <div className="text-white text-xl">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="text-white/90 hover:text-white"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white/90 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <Card className="glow">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Content Review & Quality Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <QCFilterBar filters={filters} onFiltersChange={setFilters} />
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-4">
              <p className="text-red-400 text-center">{error}</p>
              <div className="text-center mt-4">
                <Button onClick={handleRefresh} variant="outline">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glow-strong">
          <CardContent className="p-0">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">
                  {content.length === 0 
                    ? "No content submissions found" 
                    : "No content matches the current filters"
                  }
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  {filteredContent.length === 0 && content.length > 0 && (
                    <Button onClick={() => setFilters({
                      status: 'all',
                      dateRange: { start: '', end: '' },
                      platform: 'all'
                    })} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <QCContentTable
                content={filteredContent}
                onApproval={handleApproval}
                onContentClick={handleContentClick}
              />
            )}
          </CardContent>
        </Card>

        {selectedContent && (
          <QCContentModal
            content={selectedContent}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onApproval={handleApproval}
          />
        )}
      </div>
    </div>
  );
};

export default QualityControlPanel;
