
import { useState, useEffect } from 'react';
import { Link, Youtube, Video, FileImage, ExternalLink, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useContentLinks } from '@/hooks/useContentLinks';
import { useToast } from '@/hooks/use-toast';
import PasteLinkInput from './PasteLinkInput';
import ContentPreviewCard from './ContentPreviewCard';
import CampaignAssignment from './CampaignAssignment';

interface ContentMetadata {
  id?: string;
  title: string;
  description: string;
  thumbnail_url: string;
  provider_name: string;
  duration?: number;
  original_url: string;
}

const ContentIngestionModule = () => {
  const [url, setUrl] = useState('');
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const { user } = useAuth();
  const { campaigns } = useCampaignData();
  const { createContentLink } = useContentLinks();
  const { toast } = useToast();

  const supportedPlatforms = [
    { name: 'YouTube', icon: Youtube },
    { name: 'Vimeo', icon: Video },
    { name: 'Direct Link', icon: ExternalLink },
    { name: 'Image URL', icon: FileImage },
  ];

  const handleUrlSubmit = async () => {
    if (!url.trim() || !user) return;

    setLoading(true);
    try {
      // Mock implementation - in real app, this would call a metadata service
      const mockMetadata = await fetchContentMetadata(url);
      setMetadata(mockMetadata);
      
      toast({
        title: "Content Preview Ready",
        description: "Review the content details and assign to a campaign.",
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
      toast({
        title: "Error Fetching Content",
        description: "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchContentMetadata = async (url: string): Promise<ContentMetadata> => {
    // Mock implementation - replace with actual metadata fetching service
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    return {
      title: "Sample Video Content",
      description: "This is a sample description for the imported content. In a real implementation, this would be fetched from the actual URL.",
      thumbnail_url: "/placeholder.svg",
      provider_name: getProviderFromUrl(url),
      duration: 180, // 3 minutes
      original_url: url,
    };
  };

  const getProviderFromUrl = (url: string): string => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('vimeo.com')) return 'Vimeo';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    return 'Direct Link';
  };

  const handleCampaignAssign = async (campaignId: string) => {
    if (!metadata || !user) return;

    try {
      await createContentLink({
        campaign_id: campaignId,
        original_url: metadata.original_url,
        title: metadata.title,
        description: metadata.description,
        thumbnail_url: metadata.thumbnail_url,
        provider_name: metadata.provider_name,
        duration: metadata.duration,
        metadata: metadata
      });

      toast({
        title: "Content Added Successfully",
        description: "The content has been imported and assigned to your campaign.",
      });

      // Reset form
      setUrl('');
      setMetadata(null);
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error Saving Content",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-2xl">
          <h2 className="text-3xl font-bold text-slate-50 mb-2 flex items-center gap-3">
            <Link className="h-8 w-8 text-blue-500" />
            Add Content via Link
          </h2>
          <p className="text-slate-400 text-lg">Paste a URL to automatically import content metadata and assign to campaigns</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* URL Input Section */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 shadow-xl">
            <PasteLinkInput 
              value={url} 
              onChange={setUrl}
              loading={loading}
              onSubmit={handleUrlSubmit}
            />
            
            {/* Supported Platforms */}
            <div className="mt-6">
              <h3 className="text-slate-300 font-medium mb-3">Supported Platforms</h3>
              <div className="grid grid-cols-2 gap-2">
                {supportedPlatforms.map(platform => (
                  <div key={platform.name} 
                       className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-slate-700/50 transition-colors">
                    <platform.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 text-sm">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 shadow-xl">
            {metadata ? (
              <ContentPreviewCard 
                metadata={metadata} 
                onEdit={() => {}}
                onRemove={() => setMetadata(null)}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/30">
                  <Link className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-slate-300 font-medium mb-2">Content Preview</h3>
                <p className="text-slate-400">Preview will appear here after importing a link</p>
              </div>
            )}
          </div>
        </div>

        {/* Campaign Assignment */}
        {metadata && (
          <div className="mt-6 bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <CampaignAssignment 
              campaigns={campaigns}
              selectedCampaign={selectedCampaign}
              onCampaignSelect={setSelectedCampaign}
              onAssign={handleCampaignAssign}
              loading={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentIngestionModule;
