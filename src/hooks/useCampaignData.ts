import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Json } from '@/integrations/supabase/types';
import { DEV_MODE } from '@/config/dev';

interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: string;
  syndication_tier?: string;
  start_date?: string;
  end_date?: string;
  scheduled_start_date?: string;
  scheduled_start_time?: string;
  auto_start?: boolean;
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
  syndication_volume?: number;
  selected_platforms?: Json;
  account_type?: string;
  local_region?: string;
  premium_platforms?: boolean;
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
      
      console.log('🔍 Fetching campaigns for user:', user?.id);
      
      // In dev mode with mock auth, fetch all campaigns since we can't create proper user relationships
      if (DEV_MODE.USE_MOCK_AUTH || DEV_MODE.DISABLE_AUTH) {
        console.log('🔧 Dev mode: fetching all campaigns');
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching campaigns:', error);
          throw error;
        }
        
        console.log('✅ Campaigns fetched (dev mode):', data?.length || 0);
        setCampaigns(data || []);
      } else {
        // Production mode: fetch only user's campaigns
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching campaigns:', error);
          throw error;
        }
        
        console.log('✅ Campaigns fetched (prod mode):', data?.length || 0);
        setCampaigns(data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaigns';
      setError(errorMessage);
      console.error('Campaign fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    if (!user && !DEV_MODE.USE_MOCK_AUTH && !DEV_MODE.DISABLE_AUTH) {
      throw new Error('User must be authenticated to create campaigns');
    }

    try {
      console.log('📝 Creating campaign with data:', campaignData);
      
      // Prepare campaign data with proper null handling
      const campaignPayload = {
        name: campaignData.name || `Campaign ${new Date().toLocaleDateString()}`,
        goal: campaignData.goal || 'awareness',
        status: campaignData.status || 'draft',
        syndication_tier: campaignData.syndication_tier || null,
        start_date: campaignData.start_date || null,
        end_date: campaignData.end_date || null,
        scheduled_start_date: campaignData.scheduled_start_date || null,
        scheduled_start_time: campaignData.scheduled_start_time || null,
        auto_start: campaignData.auto_start || false,
        budget_allocated: campaignData.budget_allocated || 0,
        budget_spent: campaignData.budget_spent || 0,
        boost_settings: campaignData.boost_settings || {},
        // In dev mode, don't set user_id to avoid foreign key constraints
        user_id: (DEV_MODE.USE_MOCK_AUTH || DEV_MODE.DISABLE_AUTH) ? null : user?.id,
        assigned_editor_id: campaignData.assigned_editor_id || null,
        platforms: campaignData.platforms || [],
        clips_count: campaignData.clips_count || 1,
        cta_type: campaignData.cta_type || 'awareness',
        posting_start_date: campaignData.posting_start_date || null,
        posting_end_date: campaignData.posting_end_date || null,
        echo_boost_enabled: campaignData.echo_boost_enabled || false,
        requires_approval: campaignData.requires_approval !== undefined ? campaignData.requires_approval : true,
        notes: campaignData.notes || '',
        echo_boost_platforms: campaignData.echo_boost_platforms || 1,
        auto_fill_lookalike: campaignData.auto_fill_lookalike || false,
        platform_targets: campaignData.platform_targets || [],
        hashtags_caption: campaignData.hashtags_caption || '',
      };

      console.log('📋 Final campaign payload:', campaignPayload);

      const { data, error } = await supabase
        .from('campaigns')
        .insert(campaignPayload)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error creating campaign:', error);
        throw error;
      }
      
      console.log('✅ Campaign created successfully:', data);
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
    // In dev mode, always fetch campaigns regardless of user state
    if (DEV_MODE.USE_MOCK_AUTH || DEV_MODE.DISABLE_AUTH || user) {
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
