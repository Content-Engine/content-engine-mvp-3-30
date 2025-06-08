
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useAuth } from '@/hooks/useAuth';
import CampaignsTable from '@/components/campaigns/CampaignsTable';
import NewCampaignModal from '@/components/campaigns/NewCampaignModal';
import { Json } from '@/integrations/supabase/types';

const Campaigns = () => {
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const { campaigns, loading, createCampaign, refetch } = useCampaignData();
  const { userRole } = useAuth();

  const canCreateCampaigns = userRole === 'admin' || userRole === 'social_media_manager';

  // Helper function to safely parse platforms from Json
  const getPlatformsArray = (platforms?: Json): string[] => {
    if (!platforms) return [];
    if (Array.isArray(platforms)) return platforms as string[];
    if (typeof platforms === 'string') return [platforms];
    return [];
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const campaignPlatforms = getPlatformsArray(campaign.platforms);
    const matchesPlatform = !selectedPlatform || campaignPlatforms.includes(selectedPlatform);
    return matchesSearch && matchesPlatform;
  });

  const handleCreateCampaign = async (campaignData: any) => {
    try {
      await createCampaign(campaignData);
      setIsNewCampaignModalOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-main">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-main">Campaigns</h1>
            <p className="text-text-muted mt-2">Manage your content campaigns</p>
          </div>
          {canCreateCampaigns && (
            <Button
              onClick={() => setIsNewCampaignModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="input-primary pl-10 pr-4 appearance-none min-w-[160px]"
            >
              <option value="">All Platforms</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube Shorts</option>
              <option value="threads">Threads</option>
            </select>
          </div>
        </div>

        {/* Campaigns Table */}
        <CampaignsTable 
          campaigns={filteredCampaigns} 
          loading={loading}
          userRole={userRole}
        />

        {/* New Campaign Modal */}
        <NewCampaignModal
          isOpen={isNewCampaignModalOpen}
          onClose={() => setIsNewCampaignModalOpen(false)}
          onSubmit={handleCreateCampaign}
        />
      </div>
    </div>
  );
};

export default Campaigns;
