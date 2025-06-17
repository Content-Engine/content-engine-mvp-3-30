
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AffiliationInviteTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendInvitation = async () => {
    if (!user || !inviteEmail) {
      toast({
        title: "Error",
        description: "Please provide an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending invitation to:', inviteEmail);
      
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', inviteEmail)
        .single();

      if (profileError || !profiles) {
        console.error('User not found:', profileError);
        toast({
          title: "Error",
          description: "User with this email not found",
          variant: "destructive",
        });
        return;
      }

      console.log('Found user profile:', profiles);

      // Check if invitation already exists
      const { data: existingInvitation } = await supabase
        .from('user_affiliations')
        .select('*')
        .eq('inviter_id', user.id)
        .eq('invited_user_id', profiles.id)
        .single();

      if (existingInvitation) {
        toast({
          title: "Info",
          description: "Invitation already sent to this user",
        });
        return;
      }

      // Create the affiliation invitation
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
        console.error('Error creating affiliation:', affiliationError);
        throw affiliationError;
      }

      console.log('Created affiliation:', affiliation);

      toast({
        title: "Success",
        description: "Invitation sent successfully!",
      });

      setInviteEmail('');
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

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Affiliation Invitation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="invite-email">User Email</Label>
          <Input
            id="invite-email"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter user email"
          />
        </div>
        <Button 
          onClick={sendInvitation} 
          disabled={loading || !inviteEmail}
          className="w-full"
        >
          {loading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AffiliationInviteTest;
