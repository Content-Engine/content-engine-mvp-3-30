
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useClientTokens } from '@/hooks/useClientTokens';
import { useAuth } from '@/hooks/useAuth';
import { Key, Eye, EyeOff, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AyrshareApiKeyManagerProps {
  userId?: string;
  isAdminView?: boolean;
}

const AyrshareApiKeyManager = ({ userId, isAdminView = false }: AyrshareApiKeyManagerProps) => {
  const { user, userRole } = useAuth();
  const { tokens, isLoading, error, saveToken, deleteToken, validateApiKey } = useClientTokens();
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    ayrshare_api_key: '',
    ayrshare_user_id: '',
    client_name: '',
  });
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;
  const userToken = tokens.find(token => token.user_id === targetUserId);
  const canEdit = userRole === 'admin' || (!isAdminView && user?.id === targetUserId);

  useEffect(() => {
    if (userToken) {
      setFormData({
        ayrshare_api_key: userToken.ayrshare_api_key,
        ayrshare_user_id: userToken.ayrshare_user_id,
        client_name: userToken.client_name || '',
      });
    }
  }, [userToken]);

  const handleSave = async () => {
    if (!formData.ayrshare_api_key || !formData.ayrshare_user_id) {
      setValidationError('Both API key and User ID are required');
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const isValid = await validateApiKey(formData.ayrshare_api_key);
      
      if (!isValid) {
        setValidationError('Invalid API key. Please check your credentials.');
        setIsValidating(false);
        return;
      }

      await saveToken({
        ...formData,
        user_id: targetUserId,
      });

      setIsValidating(false);
    } catch (error) {
      setValidationError('Error validating API key');
      setIsValidating(false);
    }
  };

  const handleDelete = async () => {
    if (userToken && confirm('Are you sure you want to delete this API key?')) {
      await deleteToken(userToken.id);
      setFormData({
        ayrshare_api_key: '',
        ayrshare_user_id: '',
        client_name: '',
      });
    }
  };

  const maskedApiKey = formData.ayrshare_api_key 
    ? `${formData.ayrshare_api_key.substring(0, 8)}...${formData.ayrshare_api_key.slice(-4)}`
    : '';

  return (
    <Card className="bg-card-bg/50 border-border-color">
      <CardHeader>
        <CardTitle className="text-text-main flex items-center gap-2">
          <Key className="h-5 w-5" />
          Ayrshare API Configuration
          {userToken?.is_active && (
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="client_name" className="text-text-main">
              Client Name (Optional)
            </Label>
            <Input
              id="client_name"
              type="text"
              value={formData.client_name}
              onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
              placeholder="Enter client name"
              disabled={!canEdit || isLoading}
              className="bg-bg-main border-border-color text-text-main"
            />
          </div>

          <div>
            <Label htmlFor="ayrshare_user_id" className="text-text-main">
              Ayrshare User ID *
            </Label>
            <Input
              id="ayrshare_user_id"
              type="text"
              value={formData.ayrshare_user_id}
              onChange={(e) => setFormData(prev => ({ ...prev, ayrshare_user_id: e.target.value }))}
              placeholder="Enter Ayrshare User ID"
              disabled={!canEdit || isLoading}
              className="bg-bg-main border-border-color text-text-main"
            />
          </div>

          <div>
            <Label htmlFor="ayrshare_api_key" className="text-text-main">
              Ayrshare API Key *
            </Label>
            <div className="relative">
              <Input
                id="ayrshare_api_key"
                type={showApiKey ? "text" : "password"}
                value={showApiKey ? formData.ayrshare_api_key : maskedApiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, ayrshare_api_key: e.target.value }))}
                placeholder="Enter Ayrshare API key"
                disabled={!canEdit || isLoading}
                className="bg-bg-main border-border-color text-text-main pr-10"
              />
              {formData.ayrshare_api_key && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading || isValidating || !formData.ayrshare_api_key || !formData.ayrshare_user_id}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isValidating ? 'Validating...' : userToken ? 'Update API Key' : 'Save API Key'}
            </Button>

            {userToken && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isLoading}
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}

        <div className="text-sm text-text-muted">
          <p>
            Your Ayrshare API key is securely stored and used for scheduling posts to social media platforms.
            {!canEdit && ' Only admins can modify API keys.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AyrshareApiKeyManager;
