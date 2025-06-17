
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const regions = [
  "Auto-Detect",
  "United States", 
  "LATAM",
  "Brazil", 
  "Europe",
  "Africa",
  "Southeast Asia"
];

interface CampaignBuilderStep3Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious?: () => void;
}

// Debug fallback component
const DebugBlock = ({ message }: { message: string }) => (
  <div className="bg-red-600 text-white p-4 rounded-lg font-bold mb-4">
    🛠 {message}
  </div>
);

// Context validation component
const ContextValidator = ({ campaignData }: { campaignData: any }) => {
  if (!campaignData?.id && !campaignData?.user_id) {
    return (
      <div className="bg-yellow-600/20 border border-yellow-500 text-yellow-200 p-4 rounded-lg mb-4">
        ⚠️ Missing campaign or user data. Using fallback values for debugging.
      </div>
    );
  }
  return null;
};

const CampaignBuilderStep3 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep3Props) => {
  const [syndicationVolume, setSyndicationVolume] = useState(campaignData?.syndicationVolume || 5);
  const [accountType, setAccountType] = useState(campaignData?.accountType || "");
  const [localRegion, setLocalRegion] = useState(campaignData?.localRegion || "Auto-Detect");
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const { toast } = useToast();

  // Self-test: Check if components loaded correctly
  useEffect(() => {
    const timer = setTimeout(() => {
      const syndicationVolumeExists = document.querySelector('[data-testid="syndication-volume"]');
      const accountTypeExists = document.querySelector('[data-testid="account-type"]');
      
      if (!syndicationVolumeExists || !accountTypeExists) {
        console.log("Step 3 repair triggered - missing components");
        setRenderError(true);
      } else {
        setComponentsLoaded(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleVolumeChange = (change: number) => {
    const newVolume = Math.max(1, Math.min(100, syndicationVolume + change));
    setSyndicationVolume(newVolume);
  };

  const handleSubmit = async () => {
    if (!accountType) {
      toast({
        title: "Selection Required",
        description: "Please select an account type to continue",
        variant: "destructive",
      });
      return;
    }

    const data = {
      syndicationVolume,
      accountType,
      localRegion: accountType === "local" ? localRegion : null,
      premiumPlatforms: accountType === "global"
    };

    updateCampaignData(data);

    // POST to API endpoint with error handling
    try {
      await fetch('/api/hooks/syndication-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          campaign_id: campaignData?.id || `draft_campaign_${Date.now()}`,
          user_id: campaignData?.user_id || 'temp_user',
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save syndication preferences:', error);
      // Continue anyway - don't block user progress
    }

    onNext();
  };

  // Render debug fallback if components failed to load
  if (renderError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <DebugBlock message="Step 3 UI fallback: Syndication components did not load correctly." />
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
            Skip to Next Step →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <ContextValidator campaignData={campaignData} />

        {/* Header */}
        <div className="text-center">
          <div className="glass-card-strong p-8 mb-6 inline-block">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              📡 Syndication Preferences
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-300 glass-card-strong p-4 inline-block">
            Choose your preferred platforms, account type, and number of placements for short-form syndication.
          </p>
        </div>

        {/* Syndication Volume */}
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0" data-testid="syndication-volume">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🔢 Number of syndication placements
            </CardTitle>
            <p className="text-gray-400 text-sm">
              This determines how many partner accounts your content will be published on.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleVolumeChange(-1)}
                disabled={syndicationVolume <= 1}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">{syndicationVolume}</div>
                <div className="text-sm text-gray-400">placements</div>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleVolumeChange(1)}
                disabled={syndicationVolume >= 100}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Type */}
        <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0" data-testid="account-type">
          <CardHeader>
            <CardTitle className="text-white">🗺 Choose your account distribution model:</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={accountType} onValueChange={setAccountType} className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="local" className="cursor-pointer">
                  <Card className={`p-6 transition-all duration-200 ${
                    accountType === "local" 
                      ? 'border-blue-400 bg-blue-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="local" id="local" />
                      <div className="space-y-1">
                        <div className="text-lg font-medium text-white flex items-center gap-2">
                          🏠 Local Creator Accounts
                        </div>
                        <p className="text-sm text-gray-400">Regional, micro-niche</p>
                      </div>
                    </div>
                  </Card>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="global" className="cursor-pointer">
                  <Card className={`p-6 transition-all duration-200 ${
                    accountType === "global" 
                      ? 'border-blue-400 bg-blue-500/20' 
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="global" id="global" />
                      <div className="space-y-1">
                        <div className="text-lg font-medium text-white flex items-center gap-2">
                          🌍 Global Network Pages
                          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">🔒 Premium</Badge>
                        </div>
                        <p className="text-sm text-gray-400">Viral, mass-reach</p>
                      </div>
                    </div>
                  </Card>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Target Region (conditional) */}
        {accountType === "local" && (
          <Card className="frosted-glass bg-gradient-to-br from-blue-500/10 to-purple-600/10 border-0">
            <CardHeader>
              <CardTitle className="text-white">🌎 Select your region</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={localRegion} onValueChange={setLocalRegion}>
                <SelectTrigger className="w-full bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {regions.map((region) => (
                    <SelectItem key={region} value={region} className="text-white">
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Info Notice */}
        <Card className="frosted-glass bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-300 italic">
                🔔 Short-form syndication only. Music distribution removed. RedNote, VEVO, and Global Network Pages are premium services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="text-white border-white/20 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ← Back to Tier Selection
          </Button>
          
          <Button 
            onClick={handleSubmit}
            size="lg" 
            className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
              accountType
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl" 
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
            disabled={!accountType}
          >
            Continue to Platform Selection →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep3;
