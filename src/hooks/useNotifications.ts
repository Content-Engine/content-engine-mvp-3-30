
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
      console.log('❌ No user found, skipping notification fetch');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching notifications for user:', user.id);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }

      console.log('✅ Fetched notifications:', data?.length || 0, 'notifications');
      console.log('📋 Notification details:', data);
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      console.log('📖 Marking notification as read:', notificationId);
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (error) {
        console.error('❌ Error marking notification as read:', error);
        throw error;
      }

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const respondToAffiliationInvitation = async (notificationId: string, affiliationId: string, accept: boolean) => {
    try {
      console.log('🤝 Responding to affiliation invitation:', { notificationId, affiliationId, accept });
      
      // Update affiliation status
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

      // Mark notification as read and remove from list
      await markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      console.log('✅ Successfully responded to affiliation invitation');
    } catch (error) {
      console.error('❌ Error responding to invitation:', error);
      throw error;
    }
  };

  const sendAffiliationInvitation = async (invitedEmail: string) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      console.log('📧 Sending affiliation invitation to:', invitedEmail);
      
      // First, find the user by email - check both email and profiles table
      console.log('🔍 Looking up user by email...');
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', invitedEmail)
        .maybeSingle();

      console.log('👤 Profile lookup result:', profiles);

      if (profileError) {
        console.error('❌ Error looking up profile:', profileError);
        throw new Error('Error looking up user profile');
      }

      if (!profiles) {
        console.log('❌ No user found with email:', invitedEmail);
        throw new Error('User not found with that email address. Make sure they have signed up first.');
      }

      console.log('✅ Found user:', profiles.id);

      // Check if invitation already exists
      const { data: existingAffiliation, error: checkError } = await supabase
        .from('user_affiliations')
        .select('id, status')
        .eq('inviter_id', user.id)
        .eq('invited_user_id', profiles.id)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking existing affiliation:', checkError);
      }

      if (existingAffiliation) {
        console.log('⚠️ Existing affiliation found:', existingAffiliation);
        throw new Error(`User has already been invited (status: ${existingAffiliation.status})`);
      }

      // Create the affiliation record
      console.log('🔗 Creating affiliation record...');
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
        console.error('❌ Error creating affiliation:', affiliationError);
        if (affiliationError.code === '23505') {
          throw new Error('This user has already been invited');
        }
        throw affiliationError;
      }

      console.log('✅ Affiliation created successfully:', affiliation);

      // Wait a moment for the trigger to create the notification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if notification was created
      const { data: createdNotification, error: notificationCheckError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profiles.id)
        .eq('type', 'affiliation_invitation')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (notificationCheckError) {
        console.error('❌ Error checking notification creation:', notificationCheckError);
      } else if (createdNotification) {
        console.log('✅ Notification created successfully:', createdNotification);
      } else {
        console.log('⚠️ No notification found after affiliation creation');
      }

      return affiliation;
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
    sendAffiliationInvitation,
    refetch: fetchNotifications
  };
};
