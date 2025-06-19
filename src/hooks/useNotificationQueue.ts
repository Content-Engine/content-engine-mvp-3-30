
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QueuedNotification {
  id: string;
  user_id: string;
  notification_type: 'slack' | 'email' | 'in_app';
  title: string;
  message: string;
  data: Record<string, any>;
  status: 'pending' | 'sent' | 'failed';
  scheduled_for: string;
  sent_at?: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
}

export const useNotificationQueue = () => {
  const [notifications, setNotifications] = useState<QueuedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        setNotifications([]);
        return;
      }

      const { data, error } = await supabase
        .from('notification_queue')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }
      
      // Convert database response to proper types
      const typedNotifications: QueuedNotification[] = (data || []).map(notification => ({
        ...notification,
        notification_type: notification.notification_type as 'slack' | 'email' | 'in_app',
        status: notification.status as 'pending' | 'sent' | 'failed',
        data: (notification.data as any) || {},
        sent_at: notification.sent_at || undefined
      }));
      
      setNotifications(typedNotifications);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications';
      setError(errorMessage);
      console.error('Notifications fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notification_queue')
        .update({ status: 'sent' })
        .eq('id', id);

      if (error) throw error;
      
      await fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => n.notification_type === 'in_app' && n.status !== 'sent').length;
  };

  const getInAppNotifications = () => {
    return notifications
      .filter(n => n.notification_type === 'in_app')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification_queue',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    getUnreadCount,
    getInAppNotifications,
    refetch: fetchNotifications,
  };
};
