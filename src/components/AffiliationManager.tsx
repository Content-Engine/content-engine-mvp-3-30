
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

const AffiliationManager = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const { sendAffiliationInvitation } = useNotifications();
  const { toast } = useToast();

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to send an invitation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLastResult(null);

    try {
      console.log('🚀 Starting invitation process for:', inviteEmail.trim());
      const result = await sendAffiliationInvitation(inviteEmail.trim());
      
      const successMessage = `Invitation sent successfully to ${inviteEmail}`;
      console.log('✅', successMessage);
      
      toast({
        title: "Invitation Sent",
        description: successMessage,
      });
      
      setLastResult(`✅ Success: Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
    } catch (error: any) {
      console.error('❌ Invitation failed:', error);
      
      const errorMessage = error.message || "Failed to send invitation. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setLastResult(`❌ Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Invite Affiliated Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendInvitation} className="space-y-4">
          <div>
            <label htmlFor="invite-email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="invite-email"
              type="email"
              placeholder="Enter user's email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !inviteEmail.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </form>

        {lastResult && (
          <div className={`mt-4 p-3 rounded-lg border ${
            lastResult.startsWith('✅') 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start gap-2">
              {lastResult.startsWith('✅') ? (
                <CheckCircle className="h-4 w-4 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 mt-0.5" />
              )}
              <div className="text-sm">
                {lastResult}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Enter the email address of the user you want to invite</li>
                <li>The user will receive an in-app notification</li>
                <li>They can accept or decline the invitation</li>
                <li>Once accepted, they become an affiliated user and can see your campaigns</li>
              </ol>
              <p className="mt-2 text-xs font-medium">
                Note: The user must have already signed up to receive invitations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliationManager;
