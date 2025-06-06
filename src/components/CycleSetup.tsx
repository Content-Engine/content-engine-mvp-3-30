
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CycleProfile, Platform } from "@/types/syndication";
import { getTierFeatures } from "@/config/paymentTiers";

interface CycleSetupProps {
  campaignId: string;
  userTier: string;
  onSaveCycle: (cycle: Partial<CycleProfile>) => void;
}

const CycleSetup = ({ campaignId, userTier, onSaveCycle }: CycleSetupProps) => {
  const [duration, setDuration] = useState<7 | 14 | 30>(14);
  const [frequency, setFrequency] = useState<'daily' | '3x-week' | 'weekly'>('3x-week');
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 'tiktok', name: 'TikTok', enabled: true, accountsAllocated: 3 },
    { id: 'instagram', name: 'Instagram', enabled: true, accountsAllocated: 2 },
    { id: 'youtube', name: 'YouTube Shorts', enabled: false, accountsAllocated: 0 },
    { id: 'facebook', name: 'Facebook Reels', enabled: false, accountsAllocated: 0 },
  ]);

  const tierFeatures = getTierFeatures(userTier);
  const maxAccounts = tierFeatures?.syndicationAccounts || 5;
  const totalAllocated = platforms.reduce((sum, p) => sum + p.accountsAllocated, 0);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { ...p, enabled: !p.enabled, accountsAllocated: !p.enabled ? 1 : 0 }
        : p
    ));
  };

  const handleAccountAllocation = (platformId: string, count: number) => {
    if (totalAllocated - platforms.find(p => p.id === platformId)?.accountsAllocated! + count <= maxAccounts) {
      setPlatforms(prev => prev.map(p => 
        p.id === platformId ? { ...p, accountsAllocated: count } : p
      ));
    }
  };

  const handleSave = () => {
    const cycle: Partial<CycleProfile> = {
      campaignId,
      duration,
      frequency,
      platforms: platforms.filter(p => p.enabled),
      accountCount: totalAllocated,
      status: 'active',
    };
    onSaveCycle(cycle);
  };

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Syndication Cycle Setup
          <Badge variant="secondary" className="bg-purple-500 text-white">
            {userTier.toUpperCase()} Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Duration Selection */}
        <div>
          <label className="text-white font-medium mb-2 block">Campaign Duration</label>
          <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value) as 7 | 14 | 30)}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days - Sprint</SelectItem>
              <SelectItem value="14">14 days - Standard</SelectItem>
              <SelectItem value="30">30 days - Extended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Frequency Selection */}
        <div>
          <label className="text-white font-medium mb-2 block">Posting Frequency</label>
          <Select value={frequency} onValueChange={(value) => setFrequency(value as any)}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="3x-week">3x per week</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="text-white font-medium mb-4 block">
            Platform Distribution ({totalAllocated}/{maxAccounts} accounts used)
          </label>
          <div className="space-y-4">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={platform.enabled}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                  />
                  <span className="text-white font-medium">{platform.name}</span>
                </div>
                {platform.enabled && (
                  <Select 
                    value={platform.accountsAllocated.toString()} 
                    onValueChange={(value) => handleAccountAllocation(platform.id, Number(value))}
                  >
                    <SelectTrigger className="w-20 bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          disabled={totalAllocated === 0}
        >
          Create Syndication Cycle
        </Button>
      </CardContent>
    </Card>
  );
};

export default CycleSetup;
