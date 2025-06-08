
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { getTierById } from '@/config/paymentTiers';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { verifyPayment, paymentTier } = usePayments();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const handleVerification = async () => {
      if (sessionId) {
        const success = await verifyPayment(sessionId);
        setVerificationSuccess(success);
      }
      setIsVerifying(false);
    };

    handleVerification();
  }, [sessionId, verifyPayment]);

  const currentTier = paymentTier ? getTierById(paymentTier) : null;

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">
            {verificationSuccess ? 'Payment Successful!' : 'Payment Processing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {verificationSuccess && currentTier ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Welcome to {currentTier.name}!</h3>
                <p className="text-gray-600 mb-4">{currentTier.description}</p>
                
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h4 className="font-semibold mb-3 flex items-center justify-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-600" />
                    Your New Features
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {currentTier.features.syndicationAccounts}
                      </div>
                      <div className="text-gray-600">Syndication Accounts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {currentTier.features.teamSeats}
                      </div>
                      <div className="text-gray-600">Team Seats</div>
                    </div>
                    {currentTier.features.advancedDashboards && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">✓</div>
                        <div className="text-gray-600">Advanced Analytics</div>
                      </div>
                    )}
                    {currentTier.features.boostedSyndication && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">✓</div>
                        <div className="text-gray-600">Boosted Syndication</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Next Steps:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Start creating campaigns with your new tier limits
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Access advanced features in your dashboard
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Invite team members to collaborate
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/campaign-builder')}
                  className="flex-1"
                >
                  Create Campaign
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We're still processing your payment. You'll receive an email confirmation shortly.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
