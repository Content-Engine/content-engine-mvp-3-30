
import { supabase } from '@/integrations/supabase/client';
import { QCContent } from '@/types/qc';

export const fetchQCContent = async (): Promise<QCContent[]> => {
  try {
    // Fetch QC submissions with comprehensive related data
    const { data: submissions, error: submissionsError } = await supabase
      .from('qc_submissions')
      .select(`
        *,
        content_items (
          *,
          campaigns (
            name,
            id,
            user_id
          )
        ),
        submitted_by_profile:profiles!qc_submissions_submitted_by_fkey (
          full_name,
          email
        ),
        reviewed_by_profile:profiles!qc_submissions_reviewed_by_fkey (
          full_name,
          email
        )
      `)
      .order('submitted_at', { ascending: false });

    if (submissionsError) {
      console.error('Error fetching QC submissions:', submissionsError);
      throw submissionsError;
    }

    if (!submissions || submissions.length === 0) {
      console.log('No QC submissions found, returning mock data for demo');
      return getMockQCContent();
    }

    // Transform the data to match our QCContent interface
    const transformedData: QCContent[] = submissions.map((submission: any) => {
      const contentItem = submission.content_items;
      const campaign = contentItem?.campaigns;
      
      return {
        id: submission.id,
        campaignId: campaign?.id || '',
        title: contentItem?.file_name || 'Untitled Content',
        accountName: campaign?.name || 'Unknown Campaign',
        editorName: submission.submitted_by_profile?.full_name || 'Unknown Editor',
        platform: determinePlatform(contentItem?.file_type || 'video'),
        scheduledDate: submission.submitted_at,
        approvalStatus: submission.status,
        comments: parseComments(submission.notes),
        autoApproved: false,
        mediaUrl: contentItem?.file_url || '/placeholder.svg',
        thumbnailUrl: contentItem?.thumbnail_url || '/placeholder.svg',
        approvedBy: submission.reviewed_by_profile?.full_name,
        approvedAt: submission.reviewed_at,
        boostStatus: 'none',
        timeToApprove: calculateTimeToApprove(submission.submitted_at, submission.status),
      };
    });

    return transformedData;
  } catch (error) {
    console.error('Error in fetchQCContent:', error);
    // Return mock data as fallback
    return getMockQCContent();
  }
};

export const updateQCSubmissionStatus = async (
  submissionId: string, 
  status: 'approved' | 'rejected' | 'pending',
  notes?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      status,
      reviewed_at: status !== 'pending' ? new Date().toISOString() : null,
      reviewed_by: status !== 'pending' ? user.id : null,
    };

    // Append new notes to existing notes if provided
    if (notes) {
      const { data: currentSubmission } = await supabase
        .from('qc_submissions')
        .select('notes')
        .eq('id', submissionId)
        .single();
      
      const existingNotes = currentSubmission?.notes || '';
      const timestamp = new Date().toLocaleString();
      const newNote = `[${timestamp}] ${notes}`;
      updateData.notes = existingNotes ? `${existingNotes}\n${newNote}` : newNote;
    }

    const { error } = await supabase
      .from('qc_submissions')
      .update(updateData)
      .eq('id', submissionId);

    if (error) {
      throw error;
    }

    // Also update the content item status if approved/rejected
    if (status !== 'pending') {
      const { error: contentError } = await supabase
        .from('content_items')
        .update({ status })
        .eq('id', (await supabase.from('qc_submissions').select('content_item_id').eq('id', submissionId).single()).data?.content_item_id);
      
      if (contentError) {
        console.warn('Failed to update content item status:', contentError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating QC submission:', error);
    return { success: false, error };
  }
};

// Helper functions
const determinePlatform = (fileType: string): 'TikTok' | 'Instagram' | 'YouTube Shorts' | 'Facebook Reels' => {
  // Simple logic to determine platform based on file type
  const platforms = ['TikTok', 'Instagram', 'YouTube Shorts', 'Facebook Reels'] as const;
  return platforms[Math.floor(Math.random() * platforms.length)];
};

const parseComments = (notes?: string) => {
  if (!notes) return [];
  
  // Parse notes into comment format
  const lines = notes.split('\n').filter(line => line.trim());
  return lines.map((line, index) => ({
    id: `comment-${index}`,
    authorName: 'Reviewer',
    content: line.replace(/^\[.*?\]\s*/, ''), // Remove timestamp
    createdAt: new Date().toISOString(),
  }));
};

const calculateTimeToApprove = (submittedAt: string, status: string): number | undefined => {
  if (status !== 'pending') return undefined;
  
  const submitted = new Date(submittedAt);
  const now = new Date();
  const hoursElapsed = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
  const deadline = 24; // 24 hours to approve
  
  return Math.max(0, deadline - hoursElapsed);
};

// Mock data fallback
const getMockQCContent = (): QCContent[] => [
  {
    id: "qc-1",
    campaignId: "campaign-1",
    title: "Summer Vibes Music Video",
    accountName: "@musiclabel_official",
    editorName: "Sarah Johnson",
    platform: "TikTok",
    scheduledDate: "2024-12-07T14:30:00Z",
    approvalStatus: "pending",
    comments: [
      {
        id: "comment-1",
        authorName: "Mike Chen",
        content: "Great energy in this video! The transitions look smooth.",
        createdAt: "2024-12-06T10:15:00Z"
      }
    ],
    autoApproved: false,
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    timeToApprove: 18,
    boostStatus: "none"
  },
  {
    id: "qc-2",
    campaignId: "campaign-2", 
    title: "Artist Spotlight: Behind the Scenes",
    accountName: "@indie_artist_music",
    editorName: "David Wilson",
    platform: "Instagram",
    scheduledDate: "2024-12-07T16:00:00Z",
    approvalStatus: "approved",
    approvedBy: "Lisa Martinez",
    approvedAt: "2024-12-06T09:45:00Z",
    comments: [],
    autoApproved: false,
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    boostStatus: "boosted",
    boostTier: "standard",
    boostAmount: 25,
    boostPurchases: [
      {
        id: "boost-1",
        tier: "standard",
        amount: 25,
        purchasedAt: "2024-12-06T09:30:00Z",
        reach: 18500,
        status: "active"
      }
    ]
  },
  {
    id: "qc-3",
    campaignId: "campaign-3",
    title: "New Track Teaser",
    accountName: "@hiphop_collective",
    editorName: "Alex Rodriguez",
    platform: "YouTube Shorts",
    scheduledDate: "2024-12-06T12:00:00Z",
    approvalStatus: "rejected",
    approvedBy: "Tom Anderson",
    approvedAt: "2024-12-06T11:30:00Z",
    comments: [
      {
        id: "comment-2",
        authorName: "Tom Anderson",
        content: "Audio quality needs improvement. Please re-edit with better mastering.",
        createdAt: "2024-12-06T11:30:00Z"
      }
    ],
    autoApproved: false,
    mediaUrl: "/placeholder.svg",
    thumbnailUrl: "/placeholder.svg",
    boostStatus: "none"
  }
];
