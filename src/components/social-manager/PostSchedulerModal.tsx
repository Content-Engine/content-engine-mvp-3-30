
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useScheduledPosts } from "@/hooks/useScheduledPosts";
import { useCampaignData } from "@/hooks/useCampaignData";
import { useToast } = "@/hooks/use-toast";
import { 
  Upload, 
  X, 
  Calendar, 
  Zap,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from "lucide-react";

interface PostSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPost?: any;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-400' },
  { id: 'tiktok', name: 'TikTok', icon: () => <span className="text-lg">🎵</span>, color: 'text-white' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-400' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: 'text-blue-400' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
];

const PostSchedulerModal = ({ isOpen, onClose, existingPost }: PostSchedulerModalProps) => {
  const [formData, setFormData] = useState({
    caption: '',
    platforms: [] as string[],
    schedule_time: '',
    campaign_id: '',
    boost_enabled: false,
    media_urls: [] as string[]
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createPost, updatePost } = useScheduledPosts();
  const { campaigns } = useCampaignData();
  const { toast } = useToast();

  useEffect(() => {
    if (existingPost) {
      setFormData({
        caption: existingPost.caption || '',
        platforms: existingPost.platforms || [],
        schedule_time: existingPost.schedule_time ? new Date(existingPost.schedule_time).toISOString().slice(0, 16) : '',
        campaign_id: existingPost.campaign_id || '',
        boost_enabled: existingPost.boost_enabled || false,
        media_urls: existingPost.media_urls || []
      });
    } else {
      setFormData({
        caption: '',
        platforms: [],
        schedule_time: '',
        campaign_id: '',
        boost_enabled: false,
        media_urls: []
      });
    }
    setMediaFiles([]);
  }, [existingPost, isOpen]);

  const handlePlatformToggle = (platformId: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.caption.trim()) {
      toast({
        title: "Error",
        description: "Caption is required",
        variant: "destructive",
      });
      return;
    }

    if (formData.platforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive",
      });
      return;
    }

    if (!formData.schedule_time) {
      toast({
        title: "Error",
        description: "Schedule time is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Upload media files to Supabase Storage
      // For now, we'll use placeholder URLs
      const mediaUrls = mediaFiles.map((file, index) => `placeholder-url-${index}`);

      const postData = {
        ...formData,
        media_urls: [...formData.media_urls, ...mediaUrls],
        schedule_time: new Date(formData.schedule_time).toISOString()
      };

      if (existingPost) {
        await updatePost(existingPost.id, postData);
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        await createPost(postData);
        toast({
          title: "Success",
          description: "Post scheduled successfully",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const characterCount = formData.caption.length;
  const maxCharacters = 2200; // Instagram's limit

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-bg border-border-color max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text-main flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {existingPost ? 'Edit Scheduled Post' : 'Schedule New Post'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Selection */}
          <div className="space-y-2">
            <Label htmlFor="campaign" className="text-text-main">Campaign (Optional)</Label>
            <select
              id="campaign"
              value={formData.campaign_id}
              onChange={(e) => setFormData(prev => ({ ...prev, campaign_id: e.target.value }))}
              className="w-full bg-card-bg border border-border-color rounded-lg px-3 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select a campaign...</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <Label className="text-text-main">Platforms *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <Button
                    key={platform.id}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handlePlatformToggle(platform.id)}
                    className={`flex items-center gap-2 justify-start ${
                      isSelected 
                        ? 'bg-accent text-white' 
                        : 'bg-card-bg border-border-color text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${platform.color}`} />
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="caption" className="text-text-main">Caption *</Label>
              <span className={`text-sm ${
                characterCount > maxCharacters ? 'text-red-400' : 'text-text-muted'
              }`}>
                {characterCount}/{maxCharacters}
              </span>
            </div>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              placeholder="Write your post caption..."
              className="min-h-[120px] bg-card-bg border-border-color text-text-main"
              rows={5}
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <Label className="text-text-main">Media Files</Label>
            <div className="border-2 border-dashed border-border-color rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted mb-2">Click to upload or drag and drop</p>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
              />
              <Label
                htmlFor="media-upload"
                className="cursor-pointer bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg inline-block"
              >
                Choose Files
              </Label>
            </div>
            
            {mediaFiles.length > 0 && (
              <div className="space-y-2">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-card-bg/50 p-3 rounded-lg">
                    <span className="text-text-main text-sm">{file.name}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeFile(index)}
                      className="text-red-400 border-red-400 hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Time */}
          <div className="space-y-2">
            <Label htmlFor="schedule_time" className="text-text-main">Schedule Time *</Label>
            <Input
              id="schedule_time"
              type="datetime-local"
              value={formData.schedule_time}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule_time: e.target.value }))}
              className="bg-card-bg border-border-color text-text-main"
            />
          </div>

          {/* Boost Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="boost" className="text-text-main">Enable Boost</Label>
              <Badge className="bg-orange-500/20 text-orange-400">
                <Zap className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            <Switch
              id="boost"
              checked={formData.boost_enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, boost_enabled: checked }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border-color text-text-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-white"
            >
              {isSubmitting 
                ? 'Scheduling...' 
                : existingPost 
                  ? 'Update Post' 
                  : 'Schedule Post'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostSchedulerModal;
