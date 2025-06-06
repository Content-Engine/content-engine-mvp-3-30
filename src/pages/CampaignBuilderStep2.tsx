
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/campaign-builder/step-1')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">Campaign Builder</h1>
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
          <Card className="bg-white/10 border-2 border-dashed border-white/30 hover:border-white/50 transition-colors">
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
            <Card className="bg-white/10 border-white/20">
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
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <Label htmlFor="vibe" className="text-white text-lg font-semibold mb-3 block">
                Content Vibe Description (Optional) ✨
              </Label>
              <Input
                id="vibe"
                placeholder="e.g., 'Spiritual drop', 'Party starter', 'Motivational energy'"
                value={vibeDescription}
                onChange={(e) => setVibeDescription(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/60 text-lg p-4"
              />
              <p className="text-white/60 text-sm mt-2">
                💡 Helps optimize captions and hashtag strategies across platforms
              </p>
            </CardContent>
          </Card>

          {/* Platform Preview */}
          <Card className="bg-white/10 border-white/20">
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
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={uploadedFiles.length === 0}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold px-8"
            >
              Next: Choose Syndication Tier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBuilderStep2;
