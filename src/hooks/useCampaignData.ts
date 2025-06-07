
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
}

export const useCampaignData = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCampaigns = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
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
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        ...campaignData,
        user_id: user.id,
      }])
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
    fetchCampaigns();
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
