
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DEV_MODE } from '@/config/dev';

interface PaymentState {
  currentTier: string | null;
  paymentTier: string | null;
  isLoading: boolean;
  error: string | null;
}

export const usePayments = () => {
  const [state, setState] = useState<PaymentState>({
    currentTier: null,
    paymentTier: null,
    isLoading: false,
    error: null,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const checkPaymentStatus = async () => {
    if (!user) return;
    
    // Skip payment checks in dev mode
    if (DEV_MODE.DISABLE_AUTH) {
      setState(prev => ({
        ...prev,
        currentTier: 'pro',
        paymentTier: 'pro',
        isLoading: false,
        error: null
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase
        .from('user_payments')
        .select('payment_tier, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking payment status:', error);
        throw error;
      }
      
      setState(prev => ({
        ...prev,
        currentTier: data?.payment_tier || null,
        paymentTier: data?.payment_tier || null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error checking payment status:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to check payment status',
        isLoading: false,
      }));
    }
  };

  const createPayment = async (tierId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to make a payment",
        variant: "destructive",
      });
      return null;
    }

    // In dev mode, simulate successful payment
    if (DEV_MODE.DISABLE_AUTH) {
      toast({
        title: "Dev Mode",
        description: `Simulated payment for ${tierId} tier`,
      });
      setState(prev => ({
        ...prev,
        currentTier: tierId,
        paymentTier: tierId
      }));
      return { url: '#dev-mode-payment' };
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          payment_tier: tierId,
          user_id: user.id 
        }
      });

      if (error) throw error;
      
      setState(prev => ({ ...prev, isLoading: false }));
      return data;
    } catch (error) {
      console.error('Error creating payment:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to create payment',
        isLoading: false,
      }));
      
      toast({
        title: "Error",
        description: "Failed to create payment session",
        variant: "destructive",
      });
      return null;
    }
  };

  const initiatePayment = createPayment; // Alias for backward compatibility

  const verifyPayment = async () => {
    return checkPaymentStatus();
  };

  useEffect(() => {
    if (user) {
      checkPaymentStatus();
    }
  }, [user]);

  return {
    ...state,
    createPayment,
    initiatePayment,
    verifyPayment,
    refreshPaymentStatus: checkPaymentStatus,
  };
};
