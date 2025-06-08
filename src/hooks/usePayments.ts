
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PaymentState {
  paymentTier: string | null;
  isLoading: boolean;
  error: string | null;
}

export const usePayments = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    paymentTier: 'free',
    isLoading: false,
    error: null,
  });
  const { user } = useAuth();

  const initiatePayment = async (tierId: string) => {
    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { paymentTier: tierId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      setPaymentState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error initiating payment:', error);
      setPaymentState(prev => ({ 
        ...prev, 
        error: 'Failed to initiate payment', 
        isLoading: false 
      }));
    }
  };

  const verifyPayment = async (sessionId: string) => {
    setPaymentState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        setPaymentState(prev => ({ 
          ...prev, 
          paymentTier: data.paymentTier, 
          isLoading: false 
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentState(prev => ({ 
        ...prev, 
        error: 'Failed to verify payment', 
        isLoading: false 
      }));
      return false;
    }
  };

  const checkPaymentStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('payment_tier')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setPaymentState(prev => ({ 
        ...prev, 
        paymentTier: data.payment_tier || 'free' 
      }));
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [user]);

  return {
    ...paymentState,
    initiatePayment,
    verifyPayment,
    refreshPaymentStatus: checkPaymentStatus,
  };
};
