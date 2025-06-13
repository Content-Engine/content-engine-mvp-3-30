
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmationBanner = () => {
  const { user, isEmailConfirmed, resendConfirmation } = useAuth();
  const { toast } = useToast();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Don't show if user is confirmed, dismissed, or no user
  if (!user || isEmailConfirmed || isDismissed) {
    return null;
  }

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await resendConfirmation();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to resend confirmation email. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email Sent",
          description: "Confirmation email sent successfully. Check your inbox.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      <Mail className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <span className="text-blue-800">
            Please confirm your email address to secure your account. Check your inbox for a confirmation link.
          </span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendConfirmation}
            disabled={isResending}
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-blue-600 hover:bg-blue-100 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EmailConfirmationBanner;
