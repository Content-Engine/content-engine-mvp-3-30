
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QCFilterBar from "@/components/QCFilterBar";
import QCContentTable from "@/components/QCContentTable";
import QCContentModal from "@/components/QCContentModal";
import { QCContent, QCFilters } from "@/types/qc";
import { fetchQCContent, updateQCSubmissionStatus } from "@/services/qcService";

const QualityControlPanel = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<QCContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<QCContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<QCContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
      const data = await fetchQCContent();
      setContent(data);
      setFilteredContent(data);
    } catch (error) {
      console.error('Error loading QC content:', error);
      toast({
        title: "Error",
        description: "Failed to load content for review",
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
      const result = await updateQCSubmissionStatus(contentId, status, comment);
      
      if (result.success) {
        // Update local state
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

        if (status !== 'pending') {
          toast({
            title: status === 'approved' ? "Content Approved" : "Content Rejected",
            description: `Content has been ${status} successfully.`,
          });
        } else if (comment) {
          toast({
            title: "Comment Added",
            description: "Your comment has been added to the content.",
          });
        }
      } else {
        throw new Error('Failed to update submission status');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: `Failed to ${status === 'pending' ? 'add comment' : status + ' content'}`,
        variant: "destructive",
      });
    }
  };

  const handleContentClick = (contentItem: QCContent) => {
    setSelectedContent(contentItem);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1" />
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white/90 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
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

        <Card className="glow-strong">
          <CardContent className="p-0">
            {filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">No content submissions found</p>
                <Button onClick={loadContent} variant="outline">
                  Refresh
                </Button>
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
