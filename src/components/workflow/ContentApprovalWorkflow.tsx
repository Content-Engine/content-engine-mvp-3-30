
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ContentItem {
  id: string;
  file_name: string;
  file_url: string;
  status: string;
  campaign_id?: string;
}

interface ContentApprovalWorkflowProps {
  contentItem: ContentItem;
  onStatusChange: (newStatus: string) => void;
}

const ContentApprovalWorkflow = ({ contentItem, onStatusChange }: ContentApprovalWorkflowProps) => {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const submitForQC = async () => {
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('qc_submissions')
        .insert({
          content_item_id: contentItem.id,
          submitted_by: user?.id,
          status: 'pending',
          notes: notes || null,
          submitted_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update content item status
      const { error: updateError } = await supabase
        .from('content_items')
        .update({ status: 'submitted_for_qc' })
        .eq('id', contentItem.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Content submitted for quality control",
      });

      onStatusChange('submitted_for_qc');
      setNotes('');
    } catch (error) {
      console.error('Error submitting for QC:', error);
      toast({
        title: "Error",
        description: "Failed to submit for quality control",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const approveContent = async () => {
    try {
      setSubmitting(true);

      // Update QC submission
      const { error: qcError } = await supabase
        .from('qc_submissions')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('content_item_id', contentItem.id);

      if (qcError) throw qcError;

      // Update content item status
      const { error: updateError } = await supabase
        .from('content_items')
        .update({ status: 'approved' })
        .eq('id', contentItem.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Content approved successfully",
      });

      onStatusChange('approved');
      setNotes('');
    } catch (error) {
      console.error('Error approving content:', error);
      toast({
        title: "Error",
        description: "Failed to approve content",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const rejectContent = async () => {
    try {
      setSubmitting(true);

      // Update QC submission
      const { error: qcError } = await supabase
        .from('qc_submissions')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          notes: notes || null
        })
        .eq('content_item_id', contentItem.id);

      if (qcError) throw qcError;

      // Update content item status
      const { error: updateError } = await supabase
        .from('content_items')
        .update({ status: 'rejected' })
        .eq('id', contentItem.id);

      if (updateError) throw updateError;

      toast({
        title: "Content Rejected",
        description: "Content rejected and sent back for revision",
      });

      onStatusChange('rejected');
      setNotes('');
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast({
        title: "Error",
        description: "Failed to reject content",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'submitted_for_qc':
        return <Badge variant="outline"><MessageSquare className="w-3 h-3 mr-1" />In Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const canSubmitForQC = userRole === 'editor' && contentItem.status === 'pending';
  const canReview = ['admin', 'social_media_manager'].includes(userRole || '') && contentItem.status === 'submitted_for_qc';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Content Approval</span>
          {getStatusBadge(contentItem.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">{contentItem.file_name}</p>
          {contentItem.file_url && (
            <img 
              src={contentItem.file_url} 
              alt={contentItem.file_name}
              className="mt-2 max-w-xs rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes or feedback..."
            className="mt-1"
          />
        </div>

        <div className="flex gap-2">
          {canSubmitForQC && (
            <Button 
              onClick={submitForQC} 
              disabled={submitting}
              className="flex-1"
            >
              Submit for QC
            </Button>
          )}

          {canReview && (
            <>
              <Button 
                onClick={approveContent} 
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button 
                onClick={rejectContent} 
                disabled={submitting}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentApprovalWorkflow;
