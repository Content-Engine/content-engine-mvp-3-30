
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Calendar, Clock, Rocket } from "lucide-react";
import { toast } from "sonner";

const CampaignBuilderStep5 = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [autoBoostThreshold, setAutoBoostThreshold] = useState("1000");
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = async () => {
    if (!startDate || !startTime) {
      toast.error("Please set a start date and time");
      return;
    }

    setIsLaunching(true);

    // Simulate campaign creation process
    toast.success("Creating campaign...");
    
    setTimeout(() => {
      toast.success("Setting up syndication accounts...");
    }, 1000);

    setTimeout(() => {
      toast.success("Optimizing content for each platform...");
    }, 2000);

    setTimeout(() => {
      toast.success("🚀 Campaign launched successfully!");
      
      // Save final campaign data
      const campaignData = {
        goal: localStorage.getItem('campaignGoal'),
        content: JSON.parse(localStorage.getItem('campaignContent') || '{}'),
        tier: localStorage.getItem('campaignTier'),
        boosts: JSON.parse(localStorage.getItem('campaignBoosts') || '[]'),
        schedule: {
          startDate,
          startTime,
          endDate,
          endTime,
          autoBoostThreshold
        },
        createdAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };

      // Save to localStorage (would be Airtable in production)
      const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      existingCampaigns.push(campaignData);
      localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

      // Navigate to dashboard
      navigate('/campaigns-dashboard');
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-4')}
            className="text-white hover:bg-white/10 mr-4"
            disabled={isLaunching}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Campaign Builder</h1>
        </div>

        <ProgressBar currentStep={5} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Schedule & Launch 🚀
          </h2>
          <p className="text-xl text-white/80">
            Set your campaign timing and auto-boost triggers
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Scheduling */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Campaign Schedule
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="start-date" className="text-white font-semibold">Start Date & Time</Label>
                  <div className="flex gap-2">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="end-date" className="text-white font-semibold">End Date & Time (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-white/10 border-white/30 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Boost Settings */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Auto-Boost Triggers
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="threshold" className="text-white font-semibold mb-2 block">
                    Repost if views are below this threshold in 24 hours
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={autoBoostThreshold}
                    onChange={(e) => setAutoBoostThreshold(e.target.value)}
                    className="bg-white/10 border-white/30 text-white max-w-xs"
                    placeholder="1000"
                  />
                  <p className="text-white/60 text-sm mt-1">
                    💡 Higher thresholds = more aggressive reposting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Summary */}
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Campaign Summary 📋</h3>
              
              <div className="grid md:grid-cols-2 gap-6 text-white/80">
                <div className="space-y-2">
                  <div><strong className="text-white">Goal:</strong> {localStorage.getItem('campaignGoal')}</div>
                  <div><strong className="text-white">Tier:</strong> {localStorage.getItem('campaignTier')}</div>
                  <div><strong className="text-white">Content:</strong> {JSON.parse(localStorage.getItem('campaignContent') || '{}').files?.length || 0} videos</div>
                </div>
                <div className="space-y-2">
                  <div><strong className="text-white">Boosts:</strong> {JSON.parse(localStorage.getItem('campaignBoosts') || '[]').length} selected</div>
                  <div><strong className="text-white">Platforms:</strong> TikTok, IG, YouTube, Facebook</div>
                  <div><strong className="text-white">Auto-boost threshold:</strong> {autoBoostThreshold} views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Launch Button */}
          <Card className="bg-gradient-to-r from-pink-500 to-purple-600 border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Go Viral? 🔥</h3>
              <p className="text-white/90 mb-6">
                Your campaign will be distributed across all selected platforms with optimized timing and targeting
              </p>
              
              <Button
                size="lg"
                onClick={handleLaunch}
                disabled={isLaunching || !startDate || !startTime}
                className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {isLaunching ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                    Launching Campaign...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-3 h-6 w-6" />
                    Launch Viral Campaign
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          {!isLaunching && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/campaign-builder/step-4')}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep5;
