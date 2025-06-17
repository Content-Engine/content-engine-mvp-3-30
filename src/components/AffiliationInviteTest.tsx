
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AffiliationInviteTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const sendInvitation = async () => {
    if (!email || !user) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending invitation to:', email);

      // First check if the user exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Error",
          description: "User not found. They need to sign up first.",
          variant: "destructive",
        });
        return;
      }

      // Create the affiliation
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
        console.error('Affiliation error:', affiliationError);
        if (affiliationError.code === '23505') {
          toast({
            title: "Error",
            description: "Invitation already exists for this user",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to send invitation",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Affiliation created:', affiliation);

      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });

      setEmail('');
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white">Send Affiliation Invitation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        <Button
          onClick={sendInvitation}
          disabled={loading}
          className="glass-button-primary w-full"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AffiliationInviteTest;
