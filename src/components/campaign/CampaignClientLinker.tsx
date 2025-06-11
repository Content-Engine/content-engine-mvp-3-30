
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  email: string;
  full_name?: string;
}

interface CampaignClientLinkerProps {
  campaignId: string;
  onClientLinked: (clientId: string) => void;
}

const CampaignClientLinker = ({ campaignId, onClientLinked }: CampaignClientLinkerProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to load clients",
        variant: "destructive",
      });
    }
  };

  const linkExistingClient = async () => {
    if (!selectedClientId) return;
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('campaigns')
        .update({ user_id: selectedClientId })
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client linked to campaign successfully",
      });

      onClientLinked(selectedClientId);
    } catch (error) {
      console.error('Error linking client:', error);
      toast({
        title: "Error",
        description: "Failed to link client to campaign",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAndLinkNewClient = async () => {
    if (!newClientEmail) return;

    try {
      setLoading(true);
      
      // First check if user already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newClientEmail)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let clientId = existingUser?.id;

      if (!clientId) {
        // Create invitation for new user
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(newClientEmail, {
          data: { role: 'user' }
        });

        if (error) throw error;
        clientId = data.user?.id;
      }

      if (clientId) {
        // Link to campaign
        const { error: updateError } = await supabase
          .from('campaigns')
          .update({ user_id: clientId })
          .eq('id', campaignId);

        if (updateError) throw updateError;

        toast({
          title: "Success",
          description: "New client invited and linked to campaign",
        });

        onClientLinked(clientId);
        setNewClientEmail('');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Error",
        description: "Failed to create and link new client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (userRole && ['admin', 'social_media_manager'].includes(userRole)) {
      fetchClients();
    }
  }, [userRole]);

  if (!['admin', 'social_media_manager'].includes(userRole || '')) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Client to Campaign</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Existing Client</Label>
          <div className="flex gap-2">
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.full_name || client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={linkExistingClient} 
              disabled={!selectedClientId || loading}
            >
              Link
            </Button>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">or</div>

        <div className="space-y-2">
          <Label>Invite New Client</Label>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="client@example.com"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={createAndLinkNewClient} 
              disabled={!newClientEmail || loading}
            >
              Invite & Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignClientLinker;
