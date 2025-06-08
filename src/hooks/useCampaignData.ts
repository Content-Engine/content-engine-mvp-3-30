
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  boost_settings?: any;
  created_at: string;
  user_id?: string;
  // Add new boost-related fields with correct types
  echo_boost_platforms?: number;
  auto_fill_lookalike?: boolean;
  platform_targets?: any; // Use any to match Json type from database
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
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData: Partial<Campaign>) => {
    if (!user) {
      throw new Error('User must be authenticated to create campaigns');
    }

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
        echo_boost_platforms: campaignData.echo_boost_platforms || 1,
        auto_fill_lookalike: campaignData.auto_fill_lookalike || false,
        platform_targets: campaignData.platform_targets || [],
        hashtags_caption: campaignData.hashtags_caption || '',
      })
      .select()
      .single();

    if (error) throw error;
    await fetchCampaigns(); // Refresh the list
    return data;
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    const { error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await fetchCampaigns(); // Refresh the list
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
