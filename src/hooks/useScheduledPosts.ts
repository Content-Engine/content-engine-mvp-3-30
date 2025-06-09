
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ScheduledPost {
  id: string;
  user_id: string;
  campaign_id?: string;
  content_item_id?: string;
  platforms: string[];
  caption: string;
  media_urls: string[];
  schedule_time: string;
  status: 'scheduled' | 'posted' | 'failed' | 'cancelled';
  ayrshare_post_id?: string;
  boost_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useScheduledPosts = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('scheduled_posts').select('*').order('schedule_time', { ascending: true });
      
      // Filter by user if not admin/social_media_manager
      if (userRole && !['admin', 'social_media_manager'].includes(userRole)) {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching scheduled posts:', error);
        throw error;
      }
      
      // Convert database response to proper types
      const typedPosts: ScheduledPost[] = (data || []).map(post => ({
        ...post,
        platforms: Array.isArray(post.platforms) ? post.platforms.filter((p): p is string => typeof p === 'string') : [],
        media_urls: Array.isArray(post.media_urls) ? post.media_urls.filter((u): u is string => typeof u === 'string') : [],
        status: (post.status as 'scheduled' | 'posted' | 'failed' | 'cancelled') || 'scheduled',
        boost_enabled: post.boost_enabled || false,
        campaign_id: post.campaign_id || undefined,
        content_item_id: post.content_item_id || undefined,
        ayrshare_post_id: post.ayrshare_post_id || undefined
      }));
      
      setPosts(typedPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scheduled posts';
      setError(errorMessage);
      console.error('Scheduled posts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Partial<ScheduledPost>) => {
    if (!user) {
      throw new Error('User must be authenticated to create posts');
    }

    try {
      const { data, error } = await supabase.functions.invoke('schedule-post', {
        body: {
          platforms: postData.platforms || [],
          caption: postData.caption || '',
          media_urls: postData.media_urls || [],
          schedule_time: postData.schedule_time,
          campaign_id: postData.campaign_id,
          boost_enabled: postData.boost_enabled || false
        }
      });

      if (error) throw error;
      
      await fetchPosts();
      return data;
    } catch (err) {
      console.error('Error creating scheduled post:', err);
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<ScheduledPost>) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      await fetchPosts();
    } catch (err) {
      console.error('Error updating scheduled post:', err);
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting scheduled post:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user, userRole]);

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
};
