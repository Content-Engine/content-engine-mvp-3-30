
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Settings, Crown, RefreshCw } from 'lucide-react';
import { TierSimulation, DEV_MODE } from '@/config/dev';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptionTier } from '@/hooks/useSubscriptionTier';

const DevToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMockTier, setCurrentMockTier] = useState<string | null>(null);
  const [currentMockRole, setCurrentMockRole] = useState<string | null>(null);
  const { userRole, user } = useAuth();
  const { tier } = useSubscriptionTier();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  useEffect(() => {
    setCurrentMockTier(TierSimulation.getMockTier());
    setCurrentMockRole(TierSimulation.getMockRole());

    // Keyboard shortcut: Shift + T
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'T') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTierChange = (newTier: 'free' | 'pro' | 'enterprise') => {
    TierSimulation.setMockTier(newTier);
    setCurrentMockTier(newTier);
    setCurrentMockRole(TierSimulation.getAvailableRoles(newTier)[0]);
    // Soft reload to apply changes
    window.location.reload();
  };

  const handleRoleChange = (newRole: string) => {
    TierSimulation.setMockRole(newRole);
    setCurrentMockRole(newRole);
    // Soft reload to apply changes
    window.location.reload();
  };

  const clearMockTier = () => {
    TierSimulation.clearMockTier();
    setCurrentMockTier(null);
    setCurrentMockRole(null);
    window.location.reload();
  };

  const getStatusInfo = () => {
    if (currentMockTier) {
      return {
        mode: 'Simulated',
        tier: currentMockTier,
        role: currentMockRole,
        color: 'text-yellow-400'
      };
    }
    return {
      mode: 'Real User',
      tier: tier || 'free',
      role: userRole || 'user',
      color: 'text-green-400'
    };
  };

  const status = getStatusInfo();

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          className="bg-gray-900/80 backdrop-blur-md text-white border border-gray-600 hover:bg-gray-800/90"
        >
          <Settings className="h-4 w-4 mr-2" />
          Dev Tools
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card className="bg-gray-900/95 backdrop-blur-md text-white border border-gray-600">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Developer Toolbar
            </CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="text-xs text-gray-400 mb-1">Current View:</div>
            <div className={`text-sm font-medium ${status.color} flex items-center gap-2`}>
              <Crown className="h-3 w-3" />
              {status.mode} - {status.tier.charAt(0).toUpperCase() + status.tier.slice(1)} ({status.role})
            </div>
          </div>

          {/* Tier Simulation */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Simulate Tier:</label>
            <Select onValueChange={handleTierChange} value={currentMockTier || ''}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select tier to simulate" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="free" className="text-white">Free Tier</SelectItem>
                <SelectItem value="pro" className="text-white">Pro Tier</SelectItem>
                <SelectItem value="enterprise" className="text-white">Enterprise Tier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role Simulation (if tier is selected) */}
          {currentMockTier && (
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Simulate Role:</label>
              <Select onValueChange={handleRoleChange} value={currentMockRole || ''}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {TierSimulation.getAvailableRoles(currentMockTier as any).map((role) => (
                    <SelectItem key={role} value={role} className="text-white">
                      {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {currentMockTier && (
              <Button
                onClick={clearMockTier}
                size="sm"
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Help */}
          <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
            Press <kbd className="bg-gray-800 px-1 rounded">Shift + T</kbd> to toggle toolbar
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DevToolbar;
