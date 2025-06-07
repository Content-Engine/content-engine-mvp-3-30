import { supabase } from '@/integrations/supabase/client';
import { QCContent } from '@/types/qc';

export const fetchQCContent = async (): Promise<QCContent[]> => {
  try {
    // Fetch QC submissions with related data
    const { data: submissions, error: submissionsError } = await supabase
      .from('qc_submissions')
      .select(`
        *,
        content_items (
          *,
          campaigns (
            name,
            id
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
      return [];
    }

    // Transform the data to match our QCContent interface
    const transformedData: QCContent[] = (submissions || []).map((submission: any) => {
      const contentItem = submission.content_items;
      const campaign = contentItem?.campaigns;
      
      return {
        id: submission.id,
        campaignId: campaign?.id || '',
        title: contentItem?.file_name || 'Untitled Content',
        accountName: campaign?.name || 'Unknown Campaign',
        editorName: submission.submitted_by_profile?.full_name || 'Unknown Editor',
        platform: 'TikTok', // Use proper type constraint
        scheduledDate: submission.submitted_at,
        approvalStatus: submission.status,
        comments: [], // We'll implement comments separately if needed
        autoApproved: false,
        mediaUrl: contentItem?.file_url || '/placeholder.svg',
        thumbnailUrl: contentItem?.thumbnail_url || '/placeholder.svg',
        approvedBy: submission.reviewed_by_profile?.full_name,
        approvedAt: submission.reviewed_at,
        boostStatus: 'none',
      };
    });

    return transformedData;
  } catch (error) {
    console.error('Error in fetchQCContent:', error);
    return [];
  }
};

export const updateQCSubmissionStatus = async (
  submissionId: string, 
  status: 'approved' | 'rejected' | 'pending',
  notes?: string
) => {
  try {
    const { error } = await supabase
      .from('qc_submissions')
      .update({
        status,
        notes,
        reviewed_at: status !== 'pending' ? new Date().toISOString() : null,
        reviewed_by: status !== 'pending' ? (await supabase.auth.getUser()).data.user?.id : null,
      })
      .eq('id', submissionId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating QC submission:', error);
    return { success: false, error };
  }
};

// Fallback to mock data if no real data exists
export const mockQCContent = async (): Promise<QCContent[]> => {
  // First try to get real data
  const realData = await fetchQCContent();
  
  // If we have real data, return it
  if (realData.length > 0) {
    return realData;
  }

  // Otherwise return mock data for demonstration
  return [
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
    },
    {
      id: "qc-4",
      campaignId: "campaign-4",
      title: "Live Performance Highlight",
      accountName: "@rock_band_official",
      editorName: "Emma Thompson",
      platform: "Facebook Reels",
      scheduledDate: "2024-12-05T20:00:00Z",
      approvalStatus: "approved",
      approvedBy: "Auto-Approval System",
      approvedAt: "2024-12-05T20:00:00Z",
      comments: [],
      autoApproved: true,
      mediaUrl: "/placeholder.svg",
      thumbnailUrl: "/placeholder.svg",
      boostStatus: "scheduled",
      boostTier: "premium",
      boostAmount: 50
    },
    {
      id: "qc-5",
      campaignId: "campaign-5",
      title: "Album Announcement",
      accountName: "@pop_star_music",
      editorName: "John Miller",
      platform: "TikTok",
      scheduledDate: "2024-12-08T10:00:00Z",
      approvalStatus: "pending",
      comments: [],
      autoApproved: false,
      mediaUrl: "/placeholder.svg",
      thumbnailUrl: "/placeholder.svg",
      timeToApprove: 42,
      boostStatus: "none"
    }
  ];
};
