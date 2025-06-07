
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, ArrowRight, Zap, TrendingUp, Target, Users, Clock, BarChart3, Info, Play } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const boosts = [
  {
    id: "echo-clone",
    title: "Echo Clone Generator",
    description: "Smartly remixes and schedules your campaign content for broader, staggered exposure across platforms.",
    cost: 49,
    useCase: "Awareness & Retargeting",
    kpiImpact: "+25% reach, +15% engagement, 3x repost density",
    platforms: ["TikTok", "Instagram", "YouTube"],
    timeWindow: "2-4 weeks",
    icon: TrendingUp,
    gradient: "from-purple-500 to-blue-600",
    metrics: { reach: 25, engagement: 15, conversion: 5 }
  },
  {
    id: "retarget-pulse",
    title: "Retarget Pulse",
    description: "Locks in warm viewers with behavior-based reposts and mirror formats.",
    cost: 39,
    useCase: "Retention",
    kpiImpact: "-18% drop-off, +30% repeat views",
    platforms: ["Instagram", "Facebook", "TikTok"],
    timeWindow: "1-3 weeks",
    icon: Target,
    gradient: "from-blue-500 to-purple-600",
    metrics: { reach: 10, engagement: 30, conversion: 20 }
  },
  {
    id: "fan-loop",
    title: "Fan Loop Driver",
    description: "Triggers comment loops using native formats optimized for discussion and reaction.",
    cost: 29,
    useCase: "Engagement",
    kpiImpact: "+45% comments, +33% replies",
    platforms: ["TikTok", "Instagram"],
    timeWindow: "1-2 weeks",
    icon: Users,
    gradient: "from-pink-500 to-purple-600",
    metrics: { reach: 8, engagement: 45, conversion: 12 }
  },
  {
    id: "power-launch",
    title: "Power Launch Window",
    description: "Posts your best content at algorithmic prime-time hours for your audience segment.",
    cost: 25,
    useCase: "Conversion",
    kpiImpact: "+38% CTA clickthroughs, +20% follow rate",
    platforms: ["All Platforms"],
    timeWindow: "Launch week",
    icon: Clock,
    gradient: "from-orange-500 to-pink-600",
    metrics: { reach: 15, engagement: 20, conversion: 38 }
  },
  {
    id: "syndication-refresh",
    title: "Syndication Refresh",
    description: "Automatically requeues high-performing content one week later with variant captions.",
    cost: 35,
    useCase: "Longevity",
    kpiImpact: "+60% content lifespan, +17% late conversions",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    timeWindow: "2-3 weeks",
    icon: BarChart3,
    gradient: "from-green-500 to-blue-600",
    metrics: { reach: 20, engagement: 10, conversion: 17 }
  }
];

const CampaignBuilderStep4 = () => {
  const navigate = useNavigate();
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleBoostToggle = (boostId: string) => {
    setSelectedBoosts(prev => 
      prev.includes(boostId) 
        ? prev.filter(id => id !== boostId)
        : [...prev, boostId]
    );
  };

  const handleNext = () => {
    // Save selected boosts to localStorage (would be Supabase in production)
    localStorage.setItem('campaignBoosts', JSON.stringify(selectedBoosts));
    navigate('/campaign-builder/step-5');
  };

  const totalCost = boosts
    .filter(boost => selectedBoosts.includes(boost.id))
    .reduce((sum, boost) => sum + boost.cost, 0);

  const calculateTotalMetrics = () => {
    const selectedBoostData = boosts.filter(boost => selectedBoosts.includes(boost.id));
    return selectedBoostData.reduce((total, boost) => ({
      reach: total.reach + boost.metrics.reach,
      engagement: total.engagement + boost.metrics.engagement,
      conversion: total.conversion + boost.metrics.conversion
    }), { reach: 0, engagement: 0, conversion: 0 });
  };

  const totalMetrics = calculateTotalMetrics();

  const getROILevel = () => {
    const avgIncrease = (totalMetrics.reach + totalMetrics.engagement + totalMetrics.conversion) / 3;
    if (avgIncrease > 25) return { level: "Excellent", color: "text-green-400", width: "w-full" };
    if (avgIncrease > 15) return { level: "Good", color: "text-blue-400", width: "w-3/4" };
    if (avgIncrease > 5) return { level: "Fair", color: "text-yellow-400", width: "w-1/2" };
    return { level: "Basic", color: "text-gray-400", width: "w-1/4" };
  };

  const roiLevel = getROILevel();

  const getSuggestedBundle = () => {
    if (selectedBoosts.length === 0) return "Select boosts to see suggestions";
    if (selectedBoosts.includes("echo-clone") && selectedBoosts.includes("power-launch")) {
      return "💎 Viral Launch Combo - Perfect for maximum reach!";
    }
    if (selectedBoosts.includes("fan-loop") && selectedBoosts.includes("retarget-pulse")) {
      return "🔥 Engagement Pro Bundle - Great for community building!";
    }
    return "🎯 Custom Mix - Your unique strategy combination!";
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-3')}
            className="glass-button text-white hover:bg-white/15 mr-4"
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

        <ProgressBar currentStep={4} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Supercharge Your Campaign 🚀
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Add powerful boosts to maximize reach and engagement across all platforms
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {/* Boost Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {boosts.map((boost) => {
                const IconComponent = boost.icon;
                return (
                  <Card
                    key={boost.id}
                    className={`glass-card cursor-pointer transition-all duration-500 hover:scale-105 hover-glow relative group ${
                      selectedBoosts.includes(boost.id) ? 'ring-2 ring-purple-400 scale-105 glow-strong' : ''
                    }`}
                    onClick={() => handleBoostToggle(boost.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${boost.gradient} opacity-10 rounded-3xl group-hover:opacity-20 transition-opacity`}></div>
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${boost.gradient} bg-opacity-20`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{boost.title}</h3>
                            <div className="text-2xl font-bold text-purple-400">${boost.cost}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Switch
                            checked={selectedBoosts.includes(boost.id)}
                            onCheckedChange={() => handleBoostToggle(boost.id)}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-white/60 hover:text-white transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="glass-modal border-purple-400/30">
                                <div className="p-2">
                                  <div className="text-sm text-white/90 mb-2">Platforms: {boost.platforms.join(", ")}</div>
                                  <div className="text-sm text-white/90">Duration: {boost.timeWindow}</div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <p className="text-white/90 mb-4 text-sm leading-relaxed">{boost.description}</p>
                      
                      <div className="space-y-3">
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-white/70 text-xs mb-1">Use Case</div>
                          <div className="text-white font-semibold text-sm">{boost.useCase}</div>
                        </div>
                        
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-white/70 text-xs mb-1">Expected Impact</div>
                          <div className="text-green-400 font-semibold text-sm">{boost.kpiImpact}</div>
                        </div>
                      </div>

                      {boost.id === "echo-clone" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowPreview(true);
                          }}
                          className="glass-button w-full mt-4"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Preview Timeline
                        </Button>
                      )}

                      {selectedBoosts.includes(boost.id) && (
                        <div className="mt-4 glass-strong rounded-lg p-3 animate-scale-in">
                          <div className="flex items-center justify-center gap-2 text-white font-bold">
                            <Zap className="h-5 w-5 text-yellow-400" />
                            Boost Added!
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Live Total */}
            {selectedBoosts.length > 0 && (
              <Card className="glass-card mb-8 animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Selected Boosts</h3>
                      <div className="text-white/80">
                        {selectedBoosts.length} boost{selectedBoosts.length !== 1 ? 's' : ''} selected
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-400">${totalCost}</div>
                      <div className="text-white/60 text-sm">Total Investment</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* KPI Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="glass-card animate-fade-in sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  KPI Impact Projection
                </h3>
                
                <div className="space-y-4">
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Total Reach Increase</div>
                    <div className="text-2xl font-bold text-purple-400">+{totalMetrics.reach}%</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Engagement Delta</div>
                    <div className="text-2xl font-bold text-blue-400">+{totalMetrics.engagement}%</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Conversion Lift</div>
                    <div className="text-2xl font-bold text-green-400">+{totalMetrics.conversion}%</div>
                  </div>

                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-2">Boost ROI Meter</div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-500 ${roiLevel.width}`}></div>
                    </div>
                    <div className={`text-sm font-semibold ${roiLevel.color}`}>{roiLevel.level} ROI</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 glass-strong rounded-lg border border-yellow-400/30">
                  <div className="text-center">
                    <div className="text-yellow-400 font-semibold mb-2">🎯 Strategy Insight</div>
                    <div className="text-white/80 text-sm">
                      {getSuggestedBundle()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/campaign-builder/step-3')}
            className="glass-button text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Syndication
          </Button>
          <Button
            onClick={handleNext}
            className="glass-button-primary text-white font-bold px-8"
          >
            Continue to Launch
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full blur-sm animate-float"></div>
        <div className="fixed bottom-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm animate-float delay-500"></div>
        <div className="fixed top-1/2 right-10 w-3 h-3 bg-pink-400/25 rounded-full blur-sm animate-float delay-1000"></div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="glass-modal max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Echo Clone Timeline Preview</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowPreview(false)}
                  className="text-white hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="text-white/80 mb-4">
                  See how your content gets strategically redistributed for maximum impact:
                </div>
                
                {/* Timeline visualization */}
                <div className="space-y-3">
                  {[
                    { day: "Day 1", action: "Original post goes live", platform: "All platforms" },
                    { day: "Day 3", action: "Remix #1 with new captions", platform: "TikTok + Instagram" },
                    { day: "Day 7", action: "Remix #2 with trending hashtags", platform: "All platforms" },
                    { day: "Day 14", action: "Final remix targeting missed audience", platform: "YouTube + Facebook" }
                  ].map((item, index) => (
                    <div key={index} className="glass-subtle rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                        {item.day.split(' ')[1]}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{item.action}</div>
                        <div className="text-white/60 text-sm">{item.platform}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep4;
