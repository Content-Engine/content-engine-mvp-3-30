
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutoEditorAssignmentProps {
  campaignId: string;
  contentItems: string[];
}

const AutoEditorAssignment = ({ campaignId, contentItems }: AutoEditorAssignmentProps) => {
  const { toast } = useToast();

  const assignEditorAutomatically = async () => {
    try {
      // Get available editors with lowest workload
      const { data: editors, error: editorsError } = await supabase
        .from('editors')
        .select('id, user_id, current_task_count, upload_speed_per_day')
        .eq('status', 'online')
        .order('current_task_count', { ascending: true })
        .limit(1);

      if (editorsError) throw editorsError;

      if (!editors.length) {
        console.log('No available editors for auto-assignment');
        return;
      }

      const selectedEditor = editors[0];

      // Create assignments for each content item
      const assignments = contentItems.map(contentItemId => ({
        campaign_id: campaignId,
        content_item_id: contentItemId,
        editor_id: selectedEditor.user_id,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error: assignmentError } = await supabase
        .from('editor_assignments')
        .insert(assignments);

      if (assignmentError) throw assignmentError;

      // Update editor's task count
      const { error: updateError } = await supabase
        .from('editors')
        .update({ 
          current_task_count: (selectedEditor.current_task_count || 0) + contentItems.length 
        })
        .eq('id', selectedEditor.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Automatically assigned ${contentItems.length} items to editor`,
      });

    } catch (error) {
      console.error('Error in auto-assignment:', error);
      toast({
        title: "Auto-assignment failed",
        description: "Content items will need manual assignment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (campaignId && contentItems.length > 0) {
      assignEditorAutomatically();
    }
  }, [campaignId, contentItems]);

  return null; // This is a utility component with no UI
};

export default AutoEditorAssignment;
