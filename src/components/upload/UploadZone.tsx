
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onFilesUploaded: (files: FileList | File[]) => void;
  dragActive: boolean;
  onDragStateChange: (active: boolean) => void;
}

const UploadZone = ({ onFilesUploaded, dragActive, onDragStateChange }: UploadZoneProps) => {
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      onDragStateChange(true);
    } else if (e.type === "dragleave") {
      onDragStateChange(false);
    }
  }, [onDragStateChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesUploaded(e.dataTransfer.files);
    }
  }, [onFilesUploaded, onDragStateChange]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesUploaded(e.target.files);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('file-input')?.click();
  };

  return (
    <Card className="frosted-glass bg-gradient-to-br from-gray-500/80 to-gray-600/80 border-0">
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
            accept="image/*,video/*,audio/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          <Upload className="h-16 w-16 text-white/70 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            {dragActive ? 'Drop files here!' : 'Drop files here or click to browse'}
          </h3>
          <p className="text-white/80 mb-6">
            Supports MP4, MOV, MP3, WAV, JPG, PNG (Max 500MB each)
          </p>
          <p className="text-blue-400 text-sm mb-4">
            💡 Upload 5+ files at once for bonus virality points!
          </p>
          <Button 
            type="button" 
            className="glass-button-primary"
            onClick={handleUploadClick}
          >
            Choose Files
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadZone;
