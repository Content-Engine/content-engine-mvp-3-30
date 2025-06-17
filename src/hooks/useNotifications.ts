
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Notification } from '@/types/notifications';
import { fetchUserNotifications, markNotificationAsRead, updateAffiliationStatus } from '@/services/notificationService';
import { sendAffiliationInvitation } from '@/services/affiliationService';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) {
      console.log('❌ No user found, skipping notification fetch');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchUserNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const respondToAffiliationInvitation = async (notificationId: string, affiliationId: string, accept: boolean) => {
    try {
      // Update affiliation status
      await updateAffiliationStatus(affiliationId, accept);

      // Mark notification as read and remove from list
      await markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      console.log('✅ Successfully responded to affiliation invitation');
    } catch (error) {
      console.error('❌ Error responding to invitation:', error);
      throw error;
    }
  };

  const handleSendAffiliationInvitation = async (invitedEmail: string) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      return await sendAffiliationInvitation(user.id, invitedEmail);
    } catch (error) {
      console.error('❌ Error in sendAffiliationInvitation:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('🔄 useNotifications effect triggered, user:', user?.id);
    fetchNotifications();
  }, [user]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!user) {
      console.log('❌ No user for real-time subscription');
      return;
    }

    console.log('🔌 Setting up real-time notification subscription for user:', user.id);
    
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
          console.log('🔔 Received new notification via realtime:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => {
            console.log('📝 Adding notification to list. Previous count:', prev.length);
            return [newNotification, ...prev];
          });
          setUnreadCount(prev => {
            const newCount = prev + 1;
            console.log('🔢 Updating unread count from', prev, 'to', newCount);
            return newCount;
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up notification subscription:', channelName);
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    respondToAffiliationInvitation,
    sendAffiliationInvitation: handleSendAffiliationInvitation,
    refetch: fetchNotifications
  };
};
