
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';

// Use the Supabase generated type directly
export type Notification = Tables<'notifications'>;

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) {
      console.log('No user found, skipping notification fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching notifications for user:', user.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }

      console.log('Fetched notifications:', data);
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const respondToAffiliationInvitation = async (notificationId: string, affiliationId: string, accept: boolean) => {
    try {
      console.log('Responding to affiliation invitation:', { notificationId, affiliationId, accept });
      
      // Update affiliation status
      const { error: affiliationError } = await supabase
        .from('user_affiliations')
        .update({ 
          status: accept ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', affiliationId);

      if (affiliationError) {
        console.error('Error updating affiliation:', affiliationError);
        throw affiliationError;
      }

      // Mark notification as read
      await markAsRead(notificationId);

      // Remove notification from list since it's been handled
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      console.log('Successfully responded to affiliation invitation');
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('useNotifications effect triggered, user:', user?.id);
    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) {
      console.log('No user for real-time subscription');
      return;
    }

    console.log('Setting up real-time notification subscription for user:', user.id);
    
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Received new notification:', payload);
          setNotifications(prev => [payload.new as Notification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    respondToAffiliationInvitation,
    refetch: fetchNotifications
  };
};
