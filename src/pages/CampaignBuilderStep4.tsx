
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, ArrowRight, Zap, TrendingUp, Target, Users, Clock, BarChart3, Info, Play, MessageCircle, Eye, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const boosts = [
  {
    id: "echo-clone",
    title: "Echo Clone™",
    description: "Simulated exposure across mirrored networks to increase visibility without platform violations.",
    cost: 49,
    useCase: "Reach Amplification",
    kpiImpact: "+2,500 to +15,000 Impressions",
    platforms: ["TikTok", "Instagram", "YouTube"],
    timeWindow: "2-4 weeks",
    icon: TrendingUp,
    gradient: "from-purple-500 to-blue-600",
    metrics: { reach: 25, engagement: 15, conversion: 5 },
    planRestriction: "Pro & Max Plans"
  },
  {
    id: "comment-seeding",
    title: "Comment Seeding 🧠",
    description: "Inject curated early comments to guide perception and spark organic engagement.",
    cost: 0,
    useCase: "Perceived Virality",
    kpiImpact: "+34% engagement lift (avg)",
    platforms: ["TikTok", "Instagram", "YouTube", "Facebook"],
    timeWindow: "First 2 hours",
    icon: MessageCircle,
    gradient: "from-pink-500 to-purple-600",
    metrics: { reach: 15, engagement: 34, conversion: 18 },
    hasPreview: true,
    tiers: {
      basic: "3 Auto Comments",
      pro: "10 AI Comments (Tone-based)",
      max: "Dynamic Threads + A/B Comments"
    }
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
    id: "repost-trigger",
    title: "Repost Trigger Boost",
    description: "Automatically re-post content if it underperforms in the first 24 hours.",
    cost: 25,
    useCase: "View Recovery",
    kpiImpact: "+45% view recovery rate",
    platforms: ["All Platforms"],
    timeWindow: "24-48 hours",
    icon: Clock,
    gradient: "from-orange-500 to-pink-600",
    metrics: { reach: 20, engagement: 15, conversion: 25 },
    hasThreshold: true
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

const commentSeedingPreviews = {
  funny: [
    "This is actually fire 🔥",
    "Not me watching this 10 times already 😭",
    "The way this hits different at 3am",
    "POV: you found your new obsession"
  ],
  hype: [
    "YESSS THIS IS EVERYTHING 🔥🔥🔥",
    "Finally someone said it!",
    "This needs to blow up RIGHT NOW",
    "The talent is UNMATCHED"
  ],
  support: [
    "So proud of you for this 💕",
    "You never miss with these",
    "Keep doing what you're doing!",
    "This deserves all the recognition"
  ],
  review: [
    "Rating this a solid 10/10",
    "Better than I expected tbh",
    "This actually changed my mind",
    "Quality content right here"
  ]
};

const CampaignBuilderStep4 = () => {
  const navigate = useNavigate();
  const [selectedBoosts, setSelectedBoosts] = useState<string[]>([]);
  const [showCommentPreview, setShowCommentPreview] = useState(false);
  const [commentTone, setCommentTone] = useState("funny");
  const [repostThreshold, setRepostThreshold] = useState("1000");
  const [userPlan, setUserPlan] = useState("basic"); // This would come from auth context

  const handleBoostToggle = (boostId: string) => {
    setSelectedBoosts(prev => 
      prev.includes(boostId) 
        ? prev.filter(id => id !== boostId)
        : [...prev, boostId]
    );
  };

  const handleNext = () => {
    const boostSettings = {
      selectedBoosts,
      commentTone,
      repostThreshold
    };
    localStorage.setItem('campaignBoosts', JSON.stringify(boostSettings));
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

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "basic": return "bg-gray-500/20 text-gray-300";
      case "pro": return "bg-blue-500/20 text-blue-300";
      case "max": return "bg-purple-500/20 text-purple-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
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
            Boost Your Impact 🚀
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Enhance your content's reach, retention, and conversion with powerful post-level enhancements
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {/* Boost Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {boosts.map((boost) => {
                const IconComponent = boost.icon;
                const isSelected = selectedBoosts.includes(boost.id);
                const isRestricted = boost.planRestriction && userPlan === "basic";
                
                return (
                  <Card
                    key={boost.id}
                    className={`glass-card cursor-pointer transition-all duration-500 hover:scale-105 hover-glow relative group ${
                      isSelected ? 'ring-2 ring-purple-400 scale-105 glow-strong' : ''
                    } ${isRestricted ? 'opacity-75' : ''}`}
                    onClick={() => !isRestricted && handleBoostToggle(boost.id)}
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
                            <div className="text-2xl font-bold text-purple-400">
                              {boost.cost === 0 ? "Included" : `$${boost.cost}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          {!isRestricted && (
                            <Switch
                              checked={isSelected}
                              onCheckedChange={() => handleBoostToggle(boost.id)}
                            />
                          )}
                          {isRestricted && (
                            <Badge className={getPlanBadgeColor("pro")}>
                              {boost.planRestriction}
                            </Badge>
                          )}
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

                        {/* Comment Seeding Tiers */}
                        {boost.id === "comment-seeding" && boost.tiers && (
                          <div className="glass-subtle rounded-lg p-3">
                            <div className="text-white/70 text-xs mb-2">Available Tiers</div>
                            <div className="space-y-1">
                              {Object.entries(boost.tiers).map(([tier, description]) => (
                                <div key={tier} className={`text-xs flex justify-between ${userPlan === tier ? 'text-purple-400 font-semibold' : 'text-white/60'}`}>
                                  <span className="capitalize">{tier}:</span>
                                  <span>{description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Repost Threshold Setting */}
                        {boost.id === "repost-trigger" && isSelected && (
                          <div className="glass-subtle rounded-lg p-3">
                            <div className="text-white/70 text-xs mb-2">Repost Threshold</div>
                            <Select value={repostThreshold} onValueChange={setRepostThreshold}>
                              <SelectTrigger className="glass-input text-white border-white/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass-modal border-purple-400/30">
                                <SelectItem value="500">Below 500 views in 24hr</SelectItem>
                                <SelectItem value="1000">Below 1,000 views in 24hr</SelectItem>
                                <SelectItem value="2500">Below 2,500 views in 24hr</SelectItem>
                                <SelectItem value="5000">Below 5,000 views in 24hr</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 space-y-2">
                        {boost.hasPreview && boost.id === "comment-seeding" && (
                          <Dialog open={showCommentPreview} onOpenChange={setShowCommentPreview}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="glass-button w-full"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Preview Comments
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-modal max-w-2xl border-purple-400/30">
                              <DialogHeader>
                                <DialogTitle className="text-white">Comment Seeding Preview</DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div>
                                  <label className="text-white/90 text-sm font-medium mb-2 block">Comment Tone</label>
                                  <Select value={commentTone} onValueChange={setCommentTone}>
                                    <SelectTrigger className="glass-input text-white border-white/20">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="glass-modal border-purple-400/30">
                                      <SelectItem value="funny">Funny & Casual</SelectItem>
                                      <SelectItem value="hype">Hype & Energy</SelectItem>
                                      <SelectItem value="support">Supportive</SelectItem>
                                      <SelectItem value="review">Review Style</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <div className="text-white/90 text-sm font-medium mb-3">Preview Comments ({commentTone})</div>
                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {commentSeedingPreviews[commentTone as keyof typeof commentSeedingPreviews].map((comment, index) => (
                                      <div key={index} className="glass-subtle rounded-lg p-3">
                                        <div className="flex items-start gap-3">
                                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            U{index + 1}
                                          </div>
                                          <div className="text-white/90 text-sm">{comment}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {isSelected && (
                          <div className="glass-strong rounded-lg p-3 animate-scale-in">
                            <div className="flex items-center justify-center gap-2 text-white font-bold">
                              <Zap className="h-5 w-5 text-yellow-400" />
                              Boost Added!
                            </div>
                          </div>
                        )}
                      </div>
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

          {/* Boost Summary Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="glass-card animate-fade-in sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Boost Summary Panel
                </h3>
                
                <div className="space-y-4">
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Projected Reach Increase</div>
                    <div className="text-2xl font-bold text-purple-400">+{totalMetrics.reach}%</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Engagement Boost</div>
                    <div className="text-2xl font-bold text-blue-400">+{totalMetrics.engagement}%</div>
                  </div>
                  
                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-1">Conversion Lift</div>
                    <div className="text-2xl font-bold text-green-400">+{totalMetrics.conversion}%</div>
                  </div>

                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-2">ROI Projection</div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-500 ${roiLevel.width}`}></div>
                    </div>
                    <div className={`text-sm font-semibold ${roiLevel.color}`}>{roiLevel.level} ROI</div>
                  </div>

                  <div className="glass-subtle rounded-lg p-4">
                    <div className="text-white/70 text-sm mb-2">Current Plan</div>
                    <Badge className={getPlanBadgeColor(userPlan)}>
                      {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} Plan
                    </Badge>
                    {userPlan === "basic" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="glass-button w-full mt-2 text-purple-400 border-purple-400/30"
                      >
                        💡 Upgrade for More Boosts
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="glass-button w-full mt-6"
                  onClick={() => {/* Preview campaign summary */}}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Final Campaign Summary
                </Button>
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
            Proceed to Schedule & Launch 🔥
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full blur-sm animate-float"></div>
        <div className="fixed bottom-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm animate-float delay-500"></div>
        <div className="fixed top-1/2 right-10 w-3 h-3 bg-pink-400/25 rounded-full blur-sm animate-float delay-1000"></div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep4;
