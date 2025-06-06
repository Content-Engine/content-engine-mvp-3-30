
import { QCContent } from "@/types/qc";

export const mockQCContent = async (): Promise<QCContent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

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
      timeToApprove: 18
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
      thumbnailUrl: "/placeholder.svg"
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
      thumbnailUrl: "/placeholder.svg"
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
      thumbnailUrl: "/placeholder.svg"
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
      timeToApprove: 42
    }
  ];
};
