
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EditorAssignment {
  id: string;
  content_item_id: string | null;
  editor_id: string | null;
  campaign_id: string | null;
  notes: string | null;
  status: 'assigned' | 'in_progress' | 'submitted' | 'rejected' | 'approved';
  assigned_at: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface EditorAssignmentWithDetails extends EditorAssignment {
  content_item?: {
    file_name: string;
    file_type: string;
    campaign?: {
      name: string;
    };
  };
}

export const useEditorAssignments = () => {
  const [assignments, setAssignments] = useState<EditorAssignmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching assignments for user:', user?.id, 'role:', userRole);
      
      if (!user) {
        console.log('No user found, skipping assignment fetch');
        setAssignments([]);
        setLoading(false);
        return;
      }
      
      let query = supabase
        .from('editor_assignments')
        .select(`
          *,
          content_item:content_items(
            file_name,
            file_type,
            campaign:campaigns(name)
          )
        `)
        .order('assigned_at', { ascending: false });
      
      // Filter based on user role
      if (userRole === 'editor') {
        query = query.eq('editor_id', user?.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching editor assignments:', error);
        throw error;
      }
      
      console.log('Fetched assignments:', data);
      
      // Type cast the data to ensure proper typing
      const typedData = (data || []).map(assignment => ({
        ...assignment,
        status: assignment.status as 'assigned' | 'in_progress' | 'submitted' | 'rejected' | 'approved'
      }));
      
      setAssignments(typedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assignments';
      setError(errorMessage);
      console.error('Assignments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id: string, updates: Partial<EditorAssignment>) => {
    try {
      console.log('Updating assignment:', id, updates);
      
      const { error } = await supabase
        .from('editor_assignments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating assignment:', error);
        throw error;
      }
      
      await fetchAssignments();
    } catch (err) {
      console.error('Error updating assignment:', err);
      throw err;
    }
  };

  const createAssignment = async (assignment: Omit<EditorAssignment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating assignment:', assignment);
      
      const { error } = await supabase
        .from('editor_assignments')
        .insert({
          ...assignment,
          assigned_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating assignment:', error);
        throw error;
      }
      
      await fetchAssignments();
    } catch (err) {
      console.error('Error creating assignment:', err);
      throw err;
    }
  };

  useEffect(() => {
    console.log('useEditorAssignments effect triggered, user:', user?.id, 'userRole:', userRole);
    
    if (user && userRole && ['admin', 'social_media_manager', 'editor'].includes(userRole)) {
      fetchAssignments();
    } else {
      // Set loading to false if user doesn't have proper role
      setLoading(false);
    }
  }, [user, userRole]);

  return {
    assignments,
    loading,
    error,
    updateAssignment,
    createAssignment,
    refetch: fetchAssignments,
  };
};
