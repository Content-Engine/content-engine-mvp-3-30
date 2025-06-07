
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@/components/ProgressBar";
import { ArrowLeft, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

const CampaignBuilderStep2 = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [vibeDescription, setVibeDescription] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleNext = () => {
    // Save to localStorage (would be Airtable in production)
    localStorage.setItem('campaignContent', JSON.stringify({
      files: uploadedFiles.map(f => f.file.name),
      vibeDescription
    }));
    navigate('/campaign-builder/step-3');
  };

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
            Upload Your Content 📱
          </h2>
          <p className="text-xl text-white/80">
            Add your short-form videos for multi-platform syndication
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload Area */}
          <Card className="glass-card border-2 border-dashed border-white/30 hover:border-white/50 transition-colors">
            <CardContent className="p-8">
              <div {...getRootProps()} className="text-center cursor-pointer">
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-white/60 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-white text-lg">Drop your videos here! 🎬</p>
                ) : (
                  <div>
                    <p className="text-white text-lg mb-2">
                      Drag & drop videos or click to browse
                    </p>
                    <p className="text-white/60">
                      Supports MP4, MOV • Auto-resizes for TikTok (9:16), IG (1:1), YouTube (16:9)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Uploaded Content ({uploadedFiles.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      <video
                        src={file.preview}
                        className="w-full h-32 object-cover rounded-lg"
                        controls
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <p className="text-white/80 text-xs mt-1 truncate">{file.file.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vibe Description */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <Label htmlFor="vibe" className="text-white text-lg font-semibold mb-3 block">
                Content Vibe Description (Optional) ✨
              </Label>
              <Input
                id="vibe"
                placeholder="e.g., 'Spiritual drop', 'Party starter', 'Motivational energy'"
                value={vibeDescription}
                onChange={(e) => setVibeDescription(e.target.value)}
                className="glass-input text-lg p-4"
              />
              <p className="text-white/60 text-sm mt-2">
                💡 Helps optimize captions and hashtag strategies across platforms
              </p>
            </CardContent>
          </Card>

          {/* Platform Preview */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Platform Optimization Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { platform: "TikTok", ratio: "9:16", color: "from-pink-500 to-purple-500" },
                  { platform: "IG Reels", ratio: "9:16", color: "from-orange-500 to-pink-500" },
                  { platform: "YouTube", ratio: "16:9", color: "from-red-500 to-red-600" },
                  { platform: "Facebook", ratio: "1:1", color: "from-blue-500 to-blue-600" },
                ].map((item) => (
                  <div key={item.platform} className={`bg-gradient-to-br ${item.color} rounded-lg p-4 text-center`}>
                    <h4 className="text-white font-bold">{item.platform}</h4>
                    <p className="text-white/80 text-sm">{item.ratio}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/campaign-builder/step-1')}
              className="glass-button text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={uploadedFiles.length === 0}
              className="glass-button-primary text-white font-bold px-8"
            >
              Next: Choose Syndication Tier
            </Button>
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
