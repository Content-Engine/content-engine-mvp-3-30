
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface IncomingContentSubmission {
  id: string;
  client_id: string;
  content_url: string;
  content_type: 'short' | 'graphic' | 'quote' | 'meme' | 'testimonial' | 'ad';
  submitted_caption?: string;
  preferred_platforms: string[];
  submit_date: string;
  campaign_tag?: string;
  boost_requested: boolean;
  status: 'pending' | 'assigned' | 'scheduled' | 'rejected';
  internal_notes?: string;
  assigned_editor_id?: string;
  created_at: string;
  updated_at: string;
}

interface SubmissionError {
  id: string;
  submission_id: string;
  error_type: string;
  error_message: string;
  created_at: string;
}

export const useIncomingContent = () => {
  const [submissions, setSubmissions] = useState<IncomingContentSubmission[]>([]);
  const [errors, setErrors] = useState<SubmissionError[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('incoming_content_submissions').select('*').order('submit_date', { ascending: false });
      
      // Filter based on user role
      if (userRole === 'editor') {
        query = query.eq('assigned_editor_id', user?.id);
      } else if (userRole === 'client') {
        query = query.eq('client_id', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching submissions:', error);
        throw error;
      }
      
      const typedSubmissions: IncomingContentSubmission[] = (data || []).map(submission => ({
        ...submission,
        preferred_platforms: Array.isArray(submission.preferred_platforms) 
          ? submission.preferred_platforms.filter((p): p is string => typeof p === 'string') 
          : []
      }));
      
      setSubmissions(typedSubmissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submissions';
      setError(errorMessage);
      console.error('Submissions fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchErrors = async () => {
    try {
      const { data, error } = await supabase
        .from('submission_errors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setErrors(data || []);
    } catch (err) {
      console.error('Error fetching submission errors:', err);
    }
  };

  const updateSubmission = async (id: string, updates: Partial<IncomingContentSubmission>) => {
    try {
      const { error } = await supabase
        .from('incoming_content_submissions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      await fetchSubmissions();
    } catch (err) {
      console.error('Error updating submission:', err);
      throw err;
    }
  };

  const assignToEditor = async (submissionId: string, editorId: string) => {
    await updateSubmission(submissionId, { 
      assigned_editor_id: editorId, 
      status: 'assigned' 
    });
  };

  const addToScheduleQueue = async (submission: IncomingContentSubmission) => {
    try {
      // Create scheduled post
      const { data: scheduledPost, error: scheduleError } = await supabase
        .from('scheduled_posts')
        .insert({
          user_id: submission.client_id,
          caption: submission.submitted_caption || '',
          platforms: submission.preferred_platforms,
          media_urls: [submission.content_url],
          schedule_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to tomorrow
          boost_enabled: submission.boost_requested,
          campaign_id: submission.campaign_tag || null,
          status: 'scheduled'
        })
        .select()
        .single();

      if (scheduleError) throw scheduleError;

      // Archive the submission
      const { error: archiveError } = await supabase
        .from('archived_submissions')
        .insert({
          original_submission_id: submission.id,
          client_id: submission.client_id,
          content_url: submission.content_url,
          content_type: submission.content_type,
          submitted_caption: submission.submitted_caption,
          preferred_platforms: submission.preferred_platforms,
          submit_date: submission.submit_date,
          campaign_tag: submission.campaign_tag,
          boost_requested: submission.boost_requested,
          status: 'scheduled',
          internal_notes: submission.internal_notes,
          assigned_editor_id: submission.assigned_editor_id,
          scheduled_post_id: scheduledPost.id
        });

      if (archiveError) throw archiveError;

      // Delete from incoming submissions
      const { error: deleteError } = await supabase
        .from('incoming_content_submissions')
        .delete()
        .eq('id', submission.id);

      if (deleteError) throw deleteError;

      await fetchSubmissions();
      return scheduledPost;
    } catch (err) {
      console.error('Error adding to schedule queue:', err);
      throw err;
    }
  };

  const logError = async (submissionId: string, errorType: string, errorMessage: string) => {
    try {
      await supabase
        .from('submission_errors')
        .insert({
          submission_id: submissionId,
          error_type: errorType,
          error_message: errorMessage
        });
      
      await fetchErrors();
    } catch (err) {
      console.error('Error logging submission error:', err);
    }
  };

  useEffect(() => {
    if (user && userRole && ['admin', 'social_media_manager', 'editor'].includes(userRole)) {
      fetchSubmissions();
      fetchErrors();
    }
  }, [user, userRole]);

  return {
    submissions,
    errors,
    loading,
    error,
    updateSubmission,
    assignToEditor,
    addToScheduleQueue,
    logError,
    refetch: fetchSubmissions,
  };
};
