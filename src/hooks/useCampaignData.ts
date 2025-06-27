
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
  created_by?: string;
}

interface UseCampaignDataOptions {
  filterByCurrentUser?: boolean;
}

export const useCampaignData = (options: UseCampaignDataOptions = {}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();
  const { filterByCurrentUser = false } = options;

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        console.log('🔍 No user, skipping campaign fetch');
        setCampaigns([]);
        return;
      }
      
      console.log('🔍 Fetching campaigns for user:', user.id, 'with role:', userRole, 'filterByCurrentUser:', filterByCurrentUser);
      
      let query = supabase
        .from('campaigns')
        .select('*');

      // Apply user filter if requested
      if (filterByCurrentUser) {
        query = query.or(`user_id.eq.${user.id},created_by.eq.${user.id}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching campaigns:', error);
        throw error;
      }
      
      console.log('✅ Campaigns fetched:', data?.length || 0, filterByCurrentUser ? '(filtered by current user)' : '(all campaigns)');
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
      console.log('📝 Creating campaign with data:', campaignData);
      
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
        user_id: user.id, // Always set user_id for RLS
        created_by: user.id, // Always set created_by for RLS
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
    if (user) {
      fetchCampaigns();
    } else {
      setLoading(false);
      setCampaigns([]);
    }
  }, [user, userRole, filterByCurrentUser]);

  return {
    campaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    refetch: fetchCampaigns,
  };
};
