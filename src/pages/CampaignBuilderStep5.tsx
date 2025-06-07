import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, ArrowLeft, Play, Settings, Check, AlertTriangle } from "lucide-react";

const CampaignBuilderStep5 = () => {
  const navigate = useNavigate();
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeZone, setTimeZone] = useState<string>("EST");
  const [hasEndDate, setHasEndDate] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  
  // Auto-boost settings
  const [viewThreshold, setViewThreshold] = useState<number[]>([1000]);
  const [timeWindow, setTimeWindow] = useState<string>("24");
  const [boostOnce, setBoostOnce] = useState<boolean>(true);
  const [useVariantCaptions, setUseVariantCaptions] = useState<boolean>(false);
  
  // UI state
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Mock campaign data - in real app this would come from global state
  const campaignData = {
    goal: "Viral Content",
    contentAssets: 3,
    tier: "Pro",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    boosts: ["Echo Clone Generator", "Fan Loop Driver"],
    estimatedReach: "25K-45K views"
  };

  const handleLaunch = () => {
    // Save campaign data to localStorage (replace with Supabase later)
    const campaign = {
      id: `campaign-${Date.now()}`,
      ...campaignData,
      schedule: {
        startDate: selectedDate,
        startTime: selectedTime,
        timeZone,
        endDate: hasEndDate ? endDate : null,
        endTime: hasEndDate ? endTime : null
      },
      autoBoost: {
        viewThreshold: viewThreshold[0],
        timeWindow,
        boostOnce,
        useVariantCaptions
      },
      createdAt: new Date().toISOString(),
      status: "scheduled"
    };

    // Get existing campaigns or initialize empty array
    const existingCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    existingCampaigns.push(campaign);
    localStorage.setItem('campaigns', JSON.stringify(existingCampaigns));

    setShowConfirmModal(false);
    navigate('/campaigns-dashboard');
  };

  const getPlatformIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      "TikTok": "🎵",
      "Instagram": "📸",
      "YouTube": "📹",
      "Facebook": "👥"
    };
    return icons[platform] || "📱";
  };

  const isFormValid = selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20 animate-float"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step < 5 ? 'bg-green-500 border-green-500 text-white' :
                    step === 5 ? 'bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/50 animate-pulse' :
                    'border-gray-600 text-gray-400'
                  }`}>
                    {step < 5 ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-1 mx-2 ${step < 5 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Step 5: Schedule & Launch 🚀
            </h1>
            <p className="text-white/80 mt-2">Set your launch window and finalize your campaign</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date/Time Selector */}
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                  Launch Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Start Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Time Zone</label>
                  <Select value={timeZone} onValueChange={setTimeZone}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                      <SelectItem value="CST">Central Time (CST)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={hasEndDate}
                    onCheckedChange={(checked) => setHasEndDate(checked === true)}
                    className="border-white/20"
                  />
                  <label className="text-white/90 text-sm">Set campaign end date</label>
                </div>

                {hasEndDate && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">End Time</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auto-Boost Settings */}
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Settings className="h-5 w-5 mr-2 text-blue-400" />
                  Engagement-Based Reboost Rules
                </CardTitle>
                <p className="text-white/70 text-sm">Set conditions to re-distribute underperforming content automatically</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Reboost if views are below threshold after
                  </label>
                  <Select value={timeWindow} onValueChange={setTimeWindow}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-4">
                    View Threshold: {viewThreshold[0].toLocaleString()} views
                  </label>
                  <Slider
                    value={viewThreshold}
                    onValueChange={setViewThreshold}
                    max={10000}
                    min={500}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>500</span>
                    <span>10,000</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={boostOnce}
                      onCheckedChange={(checked) => setBoostOnce(checked === true)}
                      className="border-white/20"
                    />
                    <label className="text-white/90 text-sm">Reboost once only</label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={useVariantCaptions}
                      onCheckedChange={(checked) => setUseVariantCaptions(checked === true)}
                      className="border-white/20"
                    />
                    <label className="text-white/90 text-sm">Use variant captions for reboosts</label>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-3">
                  <p className="text-blue-200 text-sm">
                    <strong>Estimated reach lift:</strong> +35% with these settings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Summary Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-white">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Goal:</span>
                    <Badge className="bg-purple-500/20 text-purple-200">{campaignData.goal}</Badge>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Content Assets:</span>
                    <span className="text-white font-medium">{campaignData.contentAssets} clips</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Tier:</span>
                    <Badge className="bg-green-500/20 text-green-200">{campaignData.tier}</Badge>
                  </div>
                </div>

                <div>
                  <span className="text-white/80 text-sm block mb-2">Platforms:</span>
                  <div className="flex flex-wrap gap-1">
                    {campaignData.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="bg-white/10 text-white text-xs px-2 py-1 rounded flex items-center"
                      >
                        {getPlatformIcon(platform)} {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/80 text-sm block mb-2">Active Boosts:</span>
                  <div className="space-y-1">
                    {campaignData.boosts.map((boost) => (
                      <div key={boost} className="bg-white/5 text-white text-xs px-2 py-1 rounded">
                        {boost}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Estimated Reach:</span>
                    <span className="text-white font-medium">{campaignData.estimatedReach}</span>
                  </div>
                </div>

                {!isFormValid && (
                  <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                    <span className="text-yellow-200 text-xs">Schedule date & time required</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Launch Controls */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/campaign-builder/step-4')}
                variant="outline"
                className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Boosts
              </Button>

              <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogTrigger asChild>
                  <Button
                    disabled={!isFormValid}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card-strong border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Confirm & Launch Campaign</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-white/80">
                      Your campaign will be scheduled to launch on{' '}
                      <strong className="text-white">
                        {selectedDate} at {selectedTime} {timeZone}
                      </strong>
                    </p>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => setShowConfirmModal(false)}
                        variant="outline"
                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleLaunch}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                      >
                        Confirm & Launch
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep5;
