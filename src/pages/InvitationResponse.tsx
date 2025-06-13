import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
const InvitationResponse = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(true);
  const [processed, setProcessed] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  useEffect(() => {
    const processInvitation = async () => {
      const actionParam = searchParams.get('action');
      const affiliationId = searchParams.get('id');
      if (!actionParam || !affiliationId) {
        toast({
          title: "Error",
          description: "Invalid invitation link",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      if (!['accept', 'reject'].includes(actionParam)) {
        toast({
          title: "Error",
          description: "Invalid action",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      try {
        setAction(actionParam);
        const {
          error
        } = await supabase.from('user_affiliations').update({
          status: actionParam === 'accept' ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        }).eq('id', affiliationId);
        if (error) {
          throw error;
        }
        setProcessed(true);
        toast({
          title: "Success",
          description: `Invitation ${actionParam === 'accept' ? 'accepted' : 'declined'} successfully`
        });
      } catch (error) {
        console.error('Error processing invitation:', error);
        toast({
          title: "Error",
          description: "Failed to process invitation",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    processInvitation();
  }, [searchParams, toast]);
  return <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {loading ? <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing...
                </> : processed ? action === 'accept' ? <>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Invitation Accepted!
                  </> : <>
                    <XCircle className="h-6 w-6 text-red-500" />
                    Invitation Declined
                  </> : <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Error
                </>}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {loading ? <p className="text-gray-600">Please wait while we process your response...</p> : processed ? <>
                <p className="text-gray-600">
                  {action === 'accept' ? 'Great! You have successfully accepted the collaboration invitation. You can now access shared campaigns and work together on content projects.' : 'You have declined the collaboration invitation. No further action is required.'}
                </p>
                {action === 'accept' && <Button onClick={() => navigate('/dashboard')} className="w-full">
                    Go to Dashboard
                  </Button>}
              </> : <p className="text-gray-200">
                Something went wrong while processing your invitation response. Please try again or contact support.
              </p>}
            
            {!loading && <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                Return to Home
              </Button>}
          </CardContent>
        </Card>
      </div>
    </Layout>;
};
export default InvitationResponse;