
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PostTemplate {
  id: string;
  campaign_id: string;
  template_name: string;
  caption_template: string;
  hashtags?: string;
  post_timing_offset: number;
  platforms: string[];
  media_requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const usePostTemplates = (campaignId?: string) => {
  const [templates, setTemplates] = useState<PostTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setTemplates([]);
        return;
      }

      let query = supabase
        .from('post_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignId) {
        query = query.eq('campaign_id', campaignId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching post templates:', error);
        throw error;
      }
      
      // Convert database response to proper types
      const typedTemplates: PostTemplate[] = (data || []).map(template => ({
        ...template,
        platforms: Array.isArray(template.platforms) 
          ? template.platforms.filter((p): p is string => typeof p === 'string') 
          : [],
        media_requirements: typeof template.media_requirements === 'object' && template.media_requirements !== null 
          ? template.media_requirements as Record<string, any>
          : {},
        post_timing_offset: template.post_timing_offset || 0,
        hashtags: template.hashtags || undefined,
        campaign_id: template.campaign_id || '',
        created_at: template.created_at || '',
        updated_at: template.updated_at || ''
      }));
      
      setTemplates(typedTemplates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post templates';
      setError(errorMessage);
      console.error('Post templates fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: Partial<PostTemplate>) => {
    if (!user) {
      throw new Error('User must be authenticated to create templates');
    }

    try {
      const { data, error } = await supabase
        .from('post_templates')
        .insert({
          campaign_id: templateData.campaign_id,
          template_name: templateData.template_name,
          caption_template: templateData.caption_template,
          hashtags: templateData.hashtags,
          post_timing_offset: templateData.post_timing_offset || 0,
          platforms: templateData.platforms || [],
          media_requirements: templateData.media_requirements || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchTemplates();
      return data;
    } catch (err) {
      console.error('Error creating post template:', err);
      throw err;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<PostTemplate>) => {
    try {
      const { error } = await supabase
        .from('post_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchTemplates();
    } catch (err) {
      console.error('Error updating post template:', err);
      throw err;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('post_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchTemplates();
    } catch (err) {
      console.error('Error deleting post template:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user, campaignId]);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates,
  };
};
