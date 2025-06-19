
import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, Users, DollarSign, Settings, Zap, FileText, Clock, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  goal?: string;
  syndication_tier?: string;
  start_date?: string;
  end_date?: string;
  scheduled_start_date?: string;
  scheduled_start_time?: string;
  auto_start?: boolean;
  budget_allocated?: number;
  budget_spent?: number;
  total_boost_spend?: number;
  boost_settings?: Json;
  user_id?: string;
  created_by?: string;
  assigned_editor_id?: string;
  platforms?: Json;
  clips_count?: number;
  cta_type?: string;
  posting_start_date?: string;
  posting_end_date?: string;
  echo_boost_enabled?: boolean;
  requires_approval?: boolean;
  notes?: string;
  echo_boost_platforms?: number;
  auto_fill_lookalike?: boolean;
  platform_targets?: Json;
  hashtags_caption?: string;
  created_at: string;
  updated_at: string;
}

interface CampaignDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  isOpen,
  onClose,
  campaignId
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const { toast } = useToast();

  const fetchCampaignData = async (id: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching campaign:', error);
        toast({
          title: "Error",
          description: "Failed to load campaign data",
          variant: "destructive",
        });
        return;
      }

      setCampaign(data);
      generateAISummary(data);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to load campaign data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async (campaignData: Campaign) => {
    setGeneratingSummary(true);
    try {
      // Simulate AI summary generation (replace with actual OpenAI call)
      const summary = `Campaign "${campaignData.name}" is a ${campaignData.goal || 'general'} campaign with ${campaignData.clips_count || 0} clips scheduled across ${Array.isArray(campaignData.platforms) ? campaignData.platforms.length : 0} platforms. Budget allocation: $${campaignData.budget_allocated || 0}, with auto-start ${campaignData.auto_start ? 'enabled' : 'disabled'}.`;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiSummary(summary);
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setAiSummary('Unable to generate AI summary at this time.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const sendWebhook = async () => {
    if (!campaign) return;
    
    try {
      // Simulate webhook send (replace with actual webhook logic)
      console.log('Sending webhook for campaign:', campaign.id);
      toast({
        title: "Webhook Sent",
        description: "Campaign data has been sent to external systems",
      });
    } catch (err) {
      console.error('Error sending webhook:', err);
      toast({
        title: "Webhook Failed",
        description: "Failed to send data to external systems",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderPlatforms = (platforms?: Json) => {
    if (!platforms || !Array.isArray(platforms)) return 'None specified';
    return platforms.join(', ');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchCampaignData(campaignId);
    } else {
      setCampaign(null);
      setAiSummary('');
    }
  }, [isOpen, campaignId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[90vh] bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : !campaign ? (
              <div className="text-center py-12 text-white/70">
                <p>Campaign not found or missing campaign link</p>
              </div>
            ) : (
              <>
                {/* AI Summary Section */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    AI Campaign Summary
                  </h3>
                  {generatingSummary ? (
                    <div className="flex items-center gap-2 text-white/70">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                      Generating summary...
                    </div>
                  ) : (
                    <p className="text-white/80 italic text-sm leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                      {aiSummary}
                    </p>
                  )}
                </div>

                {/* Campaign Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">{campaign.name}</h2>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  {campaign.description && (
                    <p className="text-white/70">{campaign.description}</p>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-xs text-white/70">Budget</span>
                    </div>
                    <p className="text-white font-medium">{formatCurrency(campaign.budget_allocated)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-white/70">Clips</span>
                    </div>
                    <p className="text-white font-medium">{campaign.clips_count || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-white/70">Platforms</span>
                    </div>
                    <p className="text-white font-medium">{Array.isArray(campaign.platforms) ? campaign.platforms.length : 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-orange-400" />
                      <span className="text-xs text-white/70">Goal</span>
                    </div>
                    <p className="text-white font-medium capitalize">{campaign.goal || 'Not set'}</p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Detailed Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule & Timing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/70">Start Date:</span>
                        <p className="text-white">{formatDate(campaign.start_date)}</p>
                      </div>
                      <div>
                        <span className="text-white/70">End Date:</span>
                        <p className="text-white">{formatDate(campaign.end_date)}</p>
                      </div>
                      <div>
                        <span className="text-white/70">Scheduled Start:</span>
                        <p className="text-white">{formatDate(campaign.scheduled_start_date)}</p>
                      </div>
                      <div>
                        <span className="text-white/70">Auto Start:</span>
                        <p className="text-white">{campaign.auto_start ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/70">Platforms:</span>
                        <p className="text-white">{renderPlatforms(campaign.platforms)}</p>
                      </div>
                      <div>
                        <span className="text-white/70">CTA Type:</span>
                        <p className="text-white capitalize">{campaign.cta_type || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="text-white/70">Requires Approval:</span>
                        <p className="text-white">{campaign.requires_approval ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <span className="text-white/70">Echo Boost:</span>
                        <p className="text-white">{campaign.echo_boost_enabled ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>

                  {campaign.notes && (
                    <div>
                      <h3 className="text-white font-medium mb-3">Notes</h3>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/80 text-sm">{campaign.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    onClick={sendWebhook}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Send Webhook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignDetailsModal;
