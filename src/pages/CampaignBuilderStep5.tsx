
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Calendar, Clock, Rocket, Settings, TrendingUp, Eye, Zap, Info } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CampaignBuilderStep5 = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [enableEndDate, setEnableEndDate] = useState(false);
  const [autoBoostThreshold, setAutoBoostThreshold] = useState([1000]);
  const [reboostOnce, setReboostOnce] = useState(true);
  const [variantCaptions, setVariantCaptions] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Get campaign data from localStorage
  const campaignGoal = localStorage.getItem('campaignGoal') || 'Not Set';
  const campaignTier = localStorage.getItem('campaignTier') || 'Not Set';
  const campaignContent = JSON.parse(localStorage.getItem('campaignContent') || '{}');
  const campaignBoosts = JSON.parse(localStorage.getItem('campaignBoosts') || '[]');

  const platforms = [
    { name: "TikTok", icon: "🎵", accounts: campaignTier === "Basic" ? 2 : campaignTier === "Pro" ? 4 : 8 },
    { name: "Instagram", icon: "📸", accounts: campaignTier === "Basic" ? 2 : campaignTier === "Pro" ? 4 : 8 },
    { name: "YouTube", icon: "📹", accounts: campaignTier === "Basic" ? 0 : campaignTier === "Pro" ? 3 : 6 },
    { name: "Facebook", icon: "👥", accounts: campaignTier === "Basic" ? 1 : campaignTier === "Pro" ? 4 : 8 }
  ].filter(p => p.accounts > 0);

  const getEstimatedReachLift = () => {
    const threshold = autoBoostThreshold[0];
    if (threshold < 1000) return "+15-25%";
    if (threshold < 5000) return "+25-40%";
    return "+40-60%";
  };

  const validateForm = () => {
    if (!startDate || !startTime) {
      toast.error("Please set a start date and time");
      return false;
    }
    return true;
  };

  const handleLaunch = async () => {
    if (!validateForm()) return;

    setIsLaunching(true);

    // Simulate campaign creation process with realistic steps
    toast.success("🔄 Initializing campaign...");
    
    setTimeout(() => {
      toast.success("📡 Connecting to syndication network...");
    }, 1000);

    setTimeout(() => {
      toast.success("🎯 Optimizing content for each platform...");
    }, 2000);

    setTimeout(() => {
      toast.success("⚡ Setting up auto-boost triggers...");
    }, 3000);

    setTimeout(() => {
      toast.success("🚀 Campaign launched successfully!");
      
      // Save final campaign data
      const campaignData = {
        goal: campaignGoal,
        content: campaignContent,
        tier: campaignTier,
        boosts: campaignBoosts,
        schedule: {
          startDate,
          startTime,
          endDate: enableEndDate ? endDate : null,
          endTime: enableEndDate ? endTime : null,
          autoBoostThreshold: autoBoostThreshold[0],
          reboostOnce,
          variantCaptions
        },
        createdAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };

      // Save to localStorage (would be Supabase in production)
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      existingCampaigns.push(campaignData);
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

      // Navigate to dashboard
      navigate('/campaigns-dashboard');
    }, 4000);
  };

  const getMissingInfo = () => {
    const missing = [];
    if (campaignGoal === 'Not Set') missing.push('Campaign Goal');
    if (campaignTier === 'Not Set') missing.push('Syndication Tier');
    if (!campaignContent.files?.length) missing.push('Content Assets');
    return missing;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-4')}
            className="glass-button text-white hover:bg-white/15 mr-4"
            disabled={isLaunching}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="glass-card-strong p-4 animate-fade-in">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              Campaign Builder
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 rounded-full mt-2 animate-shimmer"></div>
          </div>
        </div>

        <ProgressBar currentStep={5} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Schedule & Launch 🚀
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Set your launch window and auto-boost triggers for maximum impact
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Date & Time Selector */}
            <Card className="glass-card animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Campaign Launch Window
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="start-date" className="text-white font-semibold flex items-center gap-2">
                      Start Date & Time
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-white/60" />
                          </TooltipTrigger>
                          <TooltipContent className="glass-modal border-purple-400/30">
                            <p>Choose optimal times based on your audience's peak activity</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="glass-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="glass-input"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="enable-end-date"
                        checked={enableEndDate}
                        onCheckedChange={setEnableEndDate}
                      />
                      <Label htmlFor="enable-end-date" className="text-white font-semibold">
                        Set End Date (Optional)
                      </Label>
                    </div>
                    {enableEndDate && (
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="glass-input"
                          min={startDate || new Date().toISOString().split('T')[0]}
                        />
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="glass-input"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Platform Delivery Preview */}
                {platforms.length > 0 && (
                  <div className="mt-6 p-4 glass-subtle rounded-lg">
                    <h4 className="text-white/80 text-sm mb-3">Expected Platform Delivery</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {platforms.map((platform) => (
                        <div key={platform.name} className="text-center">
                          <div className="text-2xl mb-1">{platform.icon}</div>
                          <div className="text-white text-xs font-medium">{platform.name}</div>
                          <div className="text-white/60 text-xs">{platform.accounts} accounts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auto-Boost Settings */}
            <Card className="glass-card animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Engagement-Based Reboost Rules
                </h3>
                <p className="text-white/70 mb-6">Set conditions to re-distribute underperforming content automatically.</p>
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-white font-semibold mb-3 block flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Reboost if views are below this threshold after 24 hours
                    </Label>
                    <div className="space-y-3">
                      <Slider
                        value={autoBoostThreshold}
                        onValueChange={setAutoBoostThreshold}
                        max={10000}
                        min={500}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-white/60">
                        <span>500 views</span>
                        <span className="text-purple-400 font-bold">{autoBoostThreshold[0]} views</span>
                        <span>10,000 views</span>
                      </div>
                      <div className="text-center p-3 glass-subtle rounded-lg">
                        <div className="text-green-400 font-semibold">Estimated Reach Lift: {getEstimatedReachLift()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 p-4 glass-subtle rounded-lg">
                      <Checkbox
                        id="reboost-once"
                        checked={reboostOnce}
                        onCheckedChange={setReboostOnce}
                      />
                      <Label htmlFor="reboost-once" className="text-white text-sm">
                        Reboost once only
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 glass-subtle rounded-lg">
                      <Checkbox
                        id="variant-captions"
                        checked={variantCaptions}
                        onCheckedChange={setVariantCaptions}
                      />
                      <Label htmlFor="variant-captions" className="text-white text-sm">
                        Use variant captions
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Summary Sidebar */}
          <div className="lg:w-80">
            <Card className="glass-card animate-fade-in sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-400" />
                    Campaign Summary
                  </h3>
                  <Dialog open={showSummary} onOpenChange={setShowSummary}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="glass-button text-xs">
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-modal max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">Campaign Review</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 text-white/80">
                        <div><strong>Goal:</strong> {campaignGoal}</div>
                        <div><strong>Tier:</strong> {campaignTier}</div>
                        <div><strong>Content:</strong> {campaignContent.files?.length || 0} assets</div>
                        <div><strong>Boosts:</strong> {campaignBoosts.length} selected</div>
                        <div><strong>Platforms:</strong> {platforms.map(p => p.name).join(", ")}</div>
                        <div><strong>Auto-boost:</strong> Below {autoBoostThreshold[0]} views</div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-4">
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Campaign Goal</div>
                    <div className="text-white font-semibold">{campaignGoal}</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Syndication Tier</div>
                    <div className="text-white font-semibold">{campaignTier}</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Content Assets</div>
                    <div className="text-white font-semibold">{campaignContent.files?.length || 0} videos</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Boosts Activated</div>
                    <div className="text-white font-semibold">{campaignBoosts.length} boosts</div>
                  </div>

                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Auto-Reboost Rules</div>
                    <div className="text-white font-semibold">Below {autoBoostThreshold[0]} views, 24h</div>
                  </div>

                  {getMissingInfo().length > 0 && (
                    <div className="p-4 glass-strong rounded-lg border border-yellow-400/30">
                      <div className="text-yellow-400 font-semibold mb-2">⚠️ Missing Information</div>
                      <div className="text-white/80 text-sm">
                        {getMissingInfo().join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Launch Controls */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="glass-card-strong animate-fade-in">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Rocket className="h-6 w-6 text-purple-400" />
                Ready to Launch Your Campaign?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Your campaign will be distributed across {platforms.length} platform{platforms.length !== 1 ? 's' : ''} with optimized timing and intelligent auto-boost triggers.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/campaign-builder/step-4')}
                  className="glass-button text-white hover:bg-white/10"
                  disabled={isLaunching}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Boosts
                </Button>
                
                <Button
                  size="lg"
                  onClick={handleLaunch}
                  disabled={isLaunching || !startDate || !startTime}
                  className="glass-button-primary text-white font-bold px-12 py-6 text-lg relative overflow-hidden group"
                >
                  {isLaunching ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Launching Campaign...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                      Launch Campaign
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Need Help Button */}
        <button className="fixed bottom-8 right-8 glass-button p-4 rounded-full text-white hover:scale-110 transition-all duration-300 z-50">
          💬
        </button>
      </div>
    </div>
  );
};

export default CampaignBuilderStep5;
