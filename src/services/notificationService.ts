
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notifications';

export const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
  console.log('🔄 Fetching notifications for user:', userId);
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching notifications:', error);
    throw error;
  }

  console.log('✅ Fetched notifications:', data?.length || 0, 'notifications');
  console.log('📋 Notification details:', data);
  return data || [];
};

export const markNotificationAsRead = async (notificationId: string) => {
  console.log('📖 Marking notification as read:', notificationId);
  const { error } = await supabase
    .from('notifications')
    .update({ read: true, updated_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) {
    console.error('❌ Error marking notification as read:', error);
    throw error;
  }

  console.log('✅ Notification marked as read');
};

export const updateAffiliationStatus = async (affiliationId: string, accept: boolean) => {
  console.log('🤝 Updating affiliation status:', { affiliationId, accept });
  
  const { error: affiliationError } = await supabase
    .from('user_affiliations')
    .update({ 
      status: accept ? 'accepted' : 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', affiliationId);

  if (affiliationError) {
    console.error('❌ Error updating affiliation:', affiliationError);
    throw affiliationError;
  }

  console.log('✅ Successfully updated affiliation status');
};
