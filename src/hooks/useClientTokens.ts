
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ClientToken } from '@/types/syndication';

interface ClientTokensState {
  tokens: ClientToken[];
  isLoading: boolean;
  error: string | null;
}

export const useClientTokens = () => {
  const [state, setState] = useState<ClientTokensState>({
    tokens: [],
    isLoading: false,
    error: null,
  });
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const fetchTokens = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let query = supabase.from('client_tokens').select('*');
      
      // If not admin, only fetch own tokens
      if (userRole !== 'admin') {
        query = query.eq('user_id', user?.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        tokens: data || [],
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching client tokens:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch API keys',
        isLoading: false,
      }));
    }
  };

  const saveToken = async (tokenData: Partial<ClientToken>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data: existingToken } = await supabase
        .from('client_tokens')
        .select('id')
        .eq('user_id', tokenData.user_id || user?.id)
        .single();

      let result;
      if (existingToken) {
        // Update existing token
        result = await supabase
          .from('client_tokens')
          .update({
            ayrshare_api_key: tokenData.ayrshare_api_key,
            ayrshare_user_id: tokenData.ayrshare_user_id,
            client_name: tokenData.client_name,
            is_active: tokenData.is_active ?? true,
          })
          .eq('id', existingToken.id)
          .select()
          .single();
      } else {
        // Insert new token
        result = await supabase
          .from('client_tokens')
          .insert({
            user_id: tokenData.user_id || user?.id,
            ayrshare_api_key: tokenData.ayrshare_api_key!,
            ayrshare_user_id: tokenData.ayrshare_user_id!,
            client_name: tokenData.client_name,
            is_active: tokenData.is_active ?? true,
          })
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "API key saved successfully",
      });

      await fetchTokens();
    } catch (error) {
      console.error('Error saving client token:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save API key',
        isLoading: false,
      }));
      
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  const deleteToken = async (tokenId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('client_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });

      await fetchTokens();
    } catch (error) {
      console.error('Error deleting client token:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to delete API key',
        isLoading: false,
      }));
      
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const validateApiKey = async (apiKey: string): Promise<boolean> => {
    try {
      // Test the API key by making a simple call to Ayrshare
      const response = await fetch('https://app.ayrshare.com/api/user', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTokens();
    }
  }, [user, userRole]);

  return {
    ...state,
    saveToken,
    deleteToken,
    validateApiKey,
    refreshTokens: fetchTokens,
  };
};
