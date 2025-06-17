
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

      // Mark notification as read and remove from list
      await markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      console.log('Successfully responded to affiliation invitation');
    } catch (error) {
      console.error('Error responding to invitation:', error);
      throw error;
    }
  };

  const sendAffiliationInvitation = async (invitedEmail: string) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      console.log('Sending affiliation invitation to:', invitedEmail);
      
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', invitedEmail)
        .single();

      if (profileError || !profiles) {
        throw new Error('User not found with that email address');
      }

      // Create the affiliation record
      const { data: affiliation, error: affiliationError } = await supabase
        .from('user_affiliations')
        .insert({
          inviter_id: user.id,
          invited_user_id: profiles.id,
          status: 'pending'
        })
        .select()
        .single();

      if (affiliationError) {
        if (affiliationError.code === '23505') { // Unique constraint violation
          throw new Error('This user has already been invited');
        }
        throw affiliationError;
      }

      console.log('Affiliation invitation created:', affiliation);
      return affiliation;
    } catch (error) {
      console.error('Error sending affiliation invitation:', error);
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
    
    // Create a unique channel name to avoid conflicts
    const channelName = `notifications_${user.id}_${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Received new notification via realtime:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notification subscription:', channelName);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    respondToAffiliationInvitation,
    sendAffiliationInvitation,
    refetch: fetchNotifications
  };
};
