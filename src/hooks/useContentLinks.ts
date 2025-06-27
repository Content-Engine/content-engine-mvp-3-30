
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ContentLink {
  id: string;
  user_id: string;
  campaign_id?: string;
  original_url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  provider_name?: string;
  duration?: number;
  metadata?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CreateContentLinkData {
  campaign_id?: string;
  original_url: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  provider_name?: string;
  duration?: number;
  metadata?: any;
}

export const useContentLinks = (campaignId?: string) => {
  const [contentLinks, setContentLinks] = useState<ContentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchContentLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setContentLinks([]);
        return;
      }

      let query = supabase
        .from('content_links')
        .select('*')
        .eq('user_id', user.id);

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      setContentLinks(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content links';
      setError(errorMessage);
      console.error('Content links fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createContentLink = async (contentData: CreateContentLinkData) => {
    if (!user) {
      throw new Error('User must be authenticated to create content links');
    }

    try {
      const { data, error } = await supabase
        .from('content_links')
        .insert({
          user_id: user.id,
          original_url: contentData.original_url,
          campaign_id: contentData.campaign_id,
          title: contentData.title,
          description: contentData.description,
          thumbnail_url: contentData.thumbnail_url,
          provider_name: contentData.provider_name,
          duration: contentData.duration,
          metadata: contentData.metadata ? JSON.stringify(contentData.metadata) : null,
          status: 'processed'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchContentLinks();
      return data;
    } catch (err) {
      console.error('Error creating content link:', err);
      throw err;
    }
  };

  const updateContentLink = async (id: string, updates: Partial<CreateContentLinkData>) => {
    try {
      const updateData: any = { ...updates };
      if (updateData.metadata) {
        updateData.metadata = JSON.stringify(updateData.metadata);
      }

      const { error } = await supabase
        .from('content_links')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      await fetchContentLinks();
    } catch (err) {
      console.error('Error updating content link:', err);
      throw err;
    }
  };

  const deleteContentLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchContentLinks();
    } catch (err) {
      console.error('Error deleting content link:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchContentLinks();
    } else {
      setLoading(false);
      setContentLinks([]);
    }
  }, [user, campaignId]);

  return {
    contentLinks,
    loading,
    error,
    createContentLink,
    updateContentLink,
    deleteContentLink,
    refetch: fetchContentLinks,
  };
};
