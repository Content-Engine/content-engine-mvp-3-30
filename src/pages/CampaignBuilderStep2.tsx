
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileVideo, FileImage } from "lucide-react";

interface CampaignBuilderStep2Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CampaignBuilderStep2 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep2Props) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(campaignData.contentFiles || []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      return isValidType && isValidSize;
    });

    if (uploadedFiles.length + validFiles.length <= 3) {
      const newFiles = [...uploadedFiles, ...validFiles].slice(0, 3);
      setUploadedFiles(newFiles);
      updateCampaignData({ contentFiles: newFiles });
    }
  }, [uploadedFiles, updateCampaignData]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    updateCampaignData({ contentFiles: newFiles });
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) {
      return <FileVideo className="h-8 w-8 text-blue-400" />;
    }
    return <FileImage className="h-8 w-8 text-green-400" />;
  };

  const canContinue = uploadedFiles.length > 0;

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canContinue && onNext) {
      onNext();
    }
  };

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPrevious) {
      onPrevious();
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('file-input')?.click();
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="text-center">
        <div className="glass-card-strong p-8 mb-6 inline-block">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Upload Content 📁
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full"></div>
        </div>
        <p className="text-lg text-white/90 glass-card-strong p-4 inline-block">
          Upload 1-3 video or image files for your campaign
        </p>
      </div>

      {/* Upload Area */}
      <Card className="frosted-glass bg-gradient-to-br from-gray-500/80 to-gray-600/80 border-0 max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer relative ${
              dragActive 
                ? 'border-blue-400 bg-blue-400/10 scale-105' 
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            <Upload className="h-16 w-16 text-white/70 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {dragActive ? 'Drop files here!' : 'Drop files here or click to browse'}
            </h3>
            <p className="text-white/80 mb-6">
              Supports MP4, MOV, JPG, PNG (Max 3 files, 100MB each)
            </p>
            <Button 
              type="button" 
              className="glass-button-primary"
              onClick={handleUploadClick}
            >
              Choose Files
            </Button>
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-white font-semibold">Uploaded Files ({uploadedFiles.length}/3):</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="glass-card-subtle p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-white/60 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={handlePreviousClick}
          className="text-white/90 hover:text-white"
        >
          Previous
        </Button>
        
        <Button 
          onClick={handleNextClick} 
          size="lg" 
          className="glass-button-primary"
          disabled={!canContinue}
        >
          {canContinue ? 'Continue to Syndication' : 'Upload at least 1 file to continue'}
        </Button>
      </div>

      {canContinue && (
        <div className="text-center">
          <p className="text-green-400 text-sm">
            ✨ Ready to proceed to syndication options!
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep2;
