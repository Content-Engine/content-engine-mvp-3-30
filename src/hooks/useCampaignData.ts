
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';

interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: string;
  syndication_tier?: string;
  start_date?: string;
  end_date?: string;
  budget_allocated?: number;
  budget_spent?: number;
  boost_settings?: Json;
  created_at: string;
  user_id?: string;
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
}

export const useCampaignData = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
      }
      
      setCampaigns(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(errorMessage);
      console.error('Campaign fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    if (!user) {
      throw new Error('User must be authenticated to create campaigns');
    }

    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: campaignData.name || `Campaign ${new Date().toLocaleDateString()}`,
          goal: campaignData.goal || '',
          status: campaignData.status || 'draft',
          syndication_tier: campaignData.syndication_tier,
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          budget_allocated: campaignData.budget_allocated || 0,
          budget_spent: campaignData.budget_spent || 0,
          boost_settings: campaignData.boost_settings || {},
          user_id: user.id,
          assigned_editor_id: campaignData.assigned_editor_id,
          platforms: campaignData.platforms || [],
          clips_count: campaignData.clips_count || 1,
          cta_type: campaignData.cta_type || 'awareness',
          posting_start_date: campaignData.posting_start_date,
          posting_end_date: campaignData.posting_end_date,
          echo_boost_enabled: campaignData.echo_boost_enabled || false,
          requires_approval: campaignData.requires_approval !== undefined ? campaignData.requires_approval : true,
          notes: campaignData.notes || '',
          echo_boost_platforms: campaignData.echo_boost_platforms || 1,
          auto_fill_lookalike: campaignData.auto_fill_lookalike || false,
          platform_targets: campaignData.platform_targets || [],
          hashtags_caption: campaignData.hashtags_caption || '',
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchCampaigns();
      return data;
    } catch (err) {
      console.error('Error creating campaign:', err);
      throw err;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchCampaigns();
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    }
  }, [user]);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    refetch: fetchCampaigns,
  };
};
