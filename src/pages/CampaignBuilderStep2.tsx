
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Upload, X, Music, Target, Tag, Settings } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface ContentAsset {
  id: string;
  file: File;
  preview: string;
  category: string;
  funnelStage: string;
  postType: string;
  assignedSong: string;
  caption: string;
  syndicationTier: string;
}

const CampaignBuilderStep2 = () => {
  const navigate = useNavigate();
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [globalSyndicationTier, setGlobalSyndicationTier] = useState("basic");

  // Mock song database
  const availableSongs = [
    "Midnight Dreams",
    "Electric Vibes",
    "Summer Nights",
    "Urban Flow",
    "Neon Lights",
    "Bass Drop",
    "Ambient Waves"
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newAssets = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      category: "",
      funnelStage: "",
      postType: "",
      assignedSong: "",
      caption: "",
      syndicationTier: globalSyndicationTier
    }));
    setContentAssets(prev => [...prev, ...newAssets]);
  }, [globalSyndicationTier]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  const updateAsset = (id: string, field: keyof ContentAsset, value: string) => {
    setContentAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ));
  };

  const removeAsset = (id: string) => {
    setContentAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const applyToAll = (field: keyof ContentAsset, value: string) => {
    setContentAssets(prev => prev.map(asset => ({ ...asset, [field]: value })));
  };

  const handleNext = () => {
    // Save to localStorage
    localStorage.setItem('campaignContentStrategy', JSON.stringify({
      contentAssets: contentAssets.map(asset => ({
        fileName: asset.file.name,
        category: asset.category,
        funnelStage: asset.funnelStage,
        postType: asset.postType,
        assignedSong: asset.assignedSong,
        caption: asset.caption,
        syndicationTier: asset.syndicationTier
      }))
    }));
    navigate('/campaign-builder/step-3');
  };

  const getCompletionStats = () => {
    const total = contentAssets.length;
    const completed = contentAssets.filter(asset => 
      asset.category && asset.funnelStage && asset.postType && asset.assignedSong
    ).length;
    return { total, completed };
  };

  const getFunnelBreakdown = () => {
    const breakdown = { awareness: 0, retention: 0, conversion: 0 };
    contentAssets.forEach(asset => {
      if (asset.funnelStage) {
        breakdown[asset.funnelStage as keyof typeof breakdown]++;
      }
    });
    return breakdown;
  };

  const isValid = contentAssets.length > 0 && getCompletionStats().completed === contentAssets.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20 animate-float"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-1')}
            className="glass-button text-white hover:bg-white/15 mr-4 backdrop-blur-xl border border-white/10"
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

        <ProgressBar currentStep={2} totalSteps={5} />

        {/* Step Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Content Strategy 🎯
          </h2>
          <p className="text-xl text-white/80">
            Define your content types, funnel goals, and syndication strategy
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Upload Area */}
            <Card className="glass-card border-2 border-dashed border-white/30 hover:border-white/50 transition-colors">
              <CardContent className="p-8">
                <div {...getRootProps()} className="text-center cursor-pointer">
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-white text-lg">Drop your content here! 🎬</p>
                  ) : (
                    <div>
                      <p className="text-white text-lg mb-2">
                        Upload Content Assets
                      </p>
                      <p className="text-white/60">
                        Drag & drop videos or click to browse • Each piece needs strategy assignment
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Global Settings */}
            {contentAssets.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Settings className="h-5 w-5 mr-2 text-blue-400" />
                    Global Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white/90 text-sm">Apply to All: Syndication Tier</Label>
                      <Select value={globalSyndicationTier} onValueChange={(value) => {
                        setGlobalSyndicationTier(value);
                        applyToAll('syndicationTier', value);
                      }}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Syndication</SelectItem>
                          <SelectItem value="pro">Pro Syndication</SelectItem>
                          <SelectItem value="max">Max Syndication</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/90 text-sm">Apply to All: Category</Label>
                      <Select onValueChange={(value) => applyToAll('category', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meme">Meme Page</SelectItem>
                          <SelectItem value="fan">Fan Page</SelectItem>
                          <SelectItem value="topic">Topic Page</SelectItem>
                          <SelectItem value="official">Official Channel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white/90 text-sm">Apply to All: Funnel Stage</Label>
                      <Select onValueChange={(value) => applyToAll('funnelStage', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                          <SelectItem value="conversion">Conversion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Assets Grid */}
            {contentAssets.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Content Assets ({contentAssets.length})</h3>
                <div className="space-y-6">
                  {contentAssets.map((asset) => (
                    <Card key={asset.id} className="glass-card">
                      <CardContent className="p-6">
                        <div className="grid lg:grid-cols-12 gap-6 items-start">
                          {/* Video Preview */}
                          <div className="lg:col-span-3">
                            <div className="relative">
                              <video
                                src={asset.preview}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={() => removeAsset(asset.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-white/80 text-xs mt-2 truncate">{asset.file.name}</p>
                          </div>

                          {/* Strategy Configuration */}
                          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Content Category */}
                            <div>
                              <Label className="text-white/90 text-sm flex items-center mb-2">
                                <Tag className="h-4 w-4 mr-1" />
                                Content Category
                              </Label>
                              <Select value={asset.category} onValueChange={(value) => updateAsset(asset.id, 'category', value)}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="meme">Meme Page</SelectItem>
                                  <SelectItem value="fan">Fan Page</SelectItem>
                                  <SelectItem value="topic">Topic Page</SelectItem>
                                  <SelectItem value="official">Official Channel</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Funnel Stage */}
                            <div>
                              <Label className="text-white/90 text-sm flex items-center mb-2">
                                <Target className="h-4 w-4 mr-1" />
                                Funnel Stage
                              </Label>
                              <Select value={asset.funnelStage} onValueChange={(value) => updateAsset(asset.id, 'funnelStage', value)}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="awareness">Awareness</SelectItem>
                                  <SelectItem value="retention">Retention</SelectItem>
                                  <SelectItem value="conversion">Conversion</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Post Type */}
                            <div>
                              <Label className="text-white/90 text-sm mb-2 block">Post Type</Label>
                              <Select value={asset.postType} onValueChange={(value) => updateAsset(asset.id, 'postType', value)}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="short-form">Short-form</SelectItem>
                                  <SelectItem value="snippet">Snippet</SelectItem>
                                  <SelectItem value="cta">CTA Content</SelectItem>
                                  <SelectItem value="remix">Remix/Variant</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Song Assignment */}
                            <div>
                              <Label className="text-white/90 text-sm flex items-center mb-2">
                                <Music className="h-4 w-4 mr-1" />
                                Assign Song
                              </Label>
                              <Select value={asset.assignedSong} onValueChange={(value) => updateAsset(asset.id, 'assignedSong', value)}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableSongs.map((song) => (
                                    <SelectItem key={song} value={song}>{song}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Caption */}
                            <div className="md:col-span-2">
                              <Label className="text-white/90 text-sm mb-2 block">Caption (Optional)</Label>
                              <Input
                                placeholder="Add custom caption..."
                                value={asset.caption}
                                onChange={(e) => updateAsset(asset.id, 'caption', e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder-white/50 text-xs"
                              />
                            </div>

                            {/* Status Indicators */}
                            <div className="md:col-span-2 flex flex-wrap gap-1">
                              {asset.category && <Badge className="bg-blue-500/20 text-blue-200 text-xs">{asset.category}</Badge>}
                              {asset.funnelStage && <Badge className="bg-green-500/20 text-green-200 text-xs">{asset.funnelStage}</Badge>}
                              {asset.assignedSong && <Badge className="bg-purple-500/20 text-purple-200 text-xs">🎵 {asset.assignedSong}</Badge>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/campaign-builder/step-1')}
                className="glass-button text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Goal
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isValid}
                className="glass-button-primary text-white font-bold px-8"
              >
                Next: Choose Syndication
              </Button>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card-strong">
              <CardHeader>
                <CardTitle className="text-white">Strategy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Completion</span>
                    <span className="text-white font-medium">
                      {getCompletionStats().completed}/{getCompletionStats().total}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ 
                        width: getCompletionStats().total > 0 
                          ? `${(getCompletionStats().completed / getCompletionStats().total) * 100}%` 
                          : '0%' 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <span className="text-white/80 text-sm block mb-2">Funnel Breakdown</span>
                  <div className="space-y-2">
                    {Object.entries(getFunnelBreakdown()).map(([stage, count]) => (
                      <div key={stage} className="flex justify-between">
                        <span className="text-white/70 text-xs capitalize">{stage}</span>
                        <span className="text-white text-xs">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-white/80 text-sm block mb-2">Daily Syndication Load</span>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white text-lg font-bold">{contentAssets.length}</div>
                    <div className="text-white/60 text-xs">pieces per day</div>
                  </div>
                </div>

                {!isValid && contentAssets.length > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-lg p-3">
                    <p className="text-yellow-200 text-xs">
                      Complete all content assignments to continue
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="fixed top-20 right-20 w-4 h-4 bg-purple-400/30 rounded-full blur-sm animate-float"></div>
        <div className="fixed bottom-20 left-20 w-6 h-6 bg-blue-400/20 rounded-full blur-sm animate-float delay-500"></div>
        <div className="fixed top-1/2 right-10 w-3 h-3 bg-pink-400/25 rounded-full blur-sm animate-float delay-1000"></div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep2;
