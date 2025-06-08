
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Rocket, Calendar, Upload, Zap, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Step5LaunchProps {
  campaignName: string;
  startDate: string;
  autoBoost: boolean;
  onNameChange: (name: string) => void;
  onDateChange: (date: string) => void;
  onAutoBoostToggle: (enabled: boolean) => void;
  onLaunch: () => void;
}

const Step5Launch = ({ 
  campaignName, 
  startDate, 
  autoBoost,
  onNameChange,
  onDateChange,
  onAutoBoostToggle,
  onLaunch 
}: Step5LaunchProps) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchProgress, setLaunchProgress] = useState(0);
  const [isLaunched, setIsLaunched] = useState(false);
  const { toast } = useToast();

  const handleLaunch = async () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign Name Required",
        description: "Please enter a name for your campaign",
        variant: "destructive",
      });
      return;
    }

    setIsLaunching(true);
    setLaunchProgress(0);

    // Simulate launch process
    const steps = [
      { progress: 20, message: "Preparing content..." },
      { progress: 40, message: "Setting up syndication..." },
      { progress: 60, message: "Configuring boost settings..." },
      { progress: 80, message: "Scheduling distribution..." },
      { progress: 100, message: "Campaign launched successfully!" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLaunchProgress(step.progress);
      
      if (step.progress === 100) {
        setIsLaunched(true);
        toast({
          title: "🚀 Campaign Launched!",
          description: step.message,
        });
        setTimeout(() => {
          onLaunch();
        }, 2000);
      }
    }

    setIsLaunching(false);
  };

  // Mock campaign data for summary
  const campaignSummary = {
    goal: "Brand Awareness",
    filesCount: 3,
    syndicationTier: "Pro",
    echoPlatforms: 3,
    autoFillEnabled: true,
    selectedPlatforms: ["TikTok", "Instagram Reels"],
    boosts: ["Echo Clone Generator", "Comment Seeding"],
    estimatedReach: "45K-75K views",
    estimatedCost: "$339/month"
  };

  if (isLaunched) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4 text-center">
        <div className="space-y-6">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
          <h1 className="text-4xl lg:text-5xl font-bold text-green-600">
            Campaign Launched Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your campaign "{campaignName}" is now live and distributing content across your selected platforms.
          </p>
          
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Content will start distributing according to your schedule</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>AI boosts will activate automatically</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Real-time analytics will be available in your dashboard</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Review & Launch Campaign
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Review your campaign settings and launch when ready
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Campaign Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Name */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Campaign Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={campaignName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter campaign name..."
                className="text-lg p-4 rounded-xl"
              />
            </CardContent>
          </Card>

          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Goal:</span>
                    <Badge className="bg-blue-500/10 text-blue-700">{campaignSummary.goal}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Content Files:</span>
                    <Badge variant="outline">{campaignSummary.filesCount} files</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Syndication Tier:</span>
                    <Badge className="bg-purple-500/10 text-purple-700">{campaignSummary.syndicationTier}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Echo Platforms:</span>
                    <Badge variant="outline">{campaignSummary.echoPlatforms} platforms</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Target Platforms:</span>
                    <div className="flex gap-1">
                      {campaignSummary.selectedPlatforms.map(platform => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Boosts:</span>
                    <Badge className="bg-green-500/10 text-green-700">
                      {campaignSummary.boosts.length} boosts
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto-Fill:</span>
                    <Badge variant={campaignSummary.autoFillEnabled ? "default" : "secondary"}>
                      {campaignSummary.autoFillEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Launch Panel */}
        <div className="space-y-6">
          {/* Performance Estimates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Estimated Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {campaignSummary.estimatedReach}
                </div>
                <div className="text-sm text-gray-600">Expected reach</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate:</span>
                  <span className="text-sm font-medium">4-8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Est. Monthly Cost:</span>
                  <span className="text-sm font-bold">{campaignSummary.estimatedCost}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Ready to Launch?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isLaunching ? (
                <Button 
                  onClick={handleLaunch}
                  size="lg" 
                  className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl"
                >
                  🚀 Launch Campaign
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">
                      Launching Campaign...
                    </div>
                    <Progress value={launchProgress} className="w-full" />
                    <div className="text-sm text-gray-600 mt-2">
                      {launchProgress}% complete
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Your campaign will go live immediately after launch
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Step5Launch;
