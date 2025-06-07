
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { FileMetadata, generateFileId, calculateViralityScore } from "@/utils/fileUtils";
import FileCard from "@/components/FileCard";
import UploadSummaryPanel from "@/components/UploadSummaryPanel";

interface CampaignBuilderStep2Props {
  campaignData: any;
  updateCampaignData: (updates: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CampaignBuilderStep2 = ({ campaignData, updateCampaignData, onNext, onPrevious }: CampaignBuilderStep2Props) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>(campaignData.contentFiles || []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const bulkUpload = fileArray.length >= 5;
    
    const validFiles = fileArray.filter(file => {
      const validTypes = [
        'image/', 'video/', 'audio/'
      ];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 500 * 1024 * 1024; // 500MB limit for enhanced version
      return isValidType && isValidSize;
    });

    const newFileMetadata: FileMetadata[] = validFiles.map(file => ({
      id: generateFileId(),
      file,
      contentType: 'raw',
      editorNotes: '',
      assignedEditor: 'unassigned',
      viralityScore: calculateViralityScore(file, file.name, bulkUpload)
    }));

    const updatedFiles = [...uploadedFiles, ...newFileMetadata];
    setUploadedFiles(updatedFiles);
    updateCampaignData({ contentFiles: updatedFiles });
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

  const updateFileMetadata = (id: string, updates: Partial<FileMetadata>) => {
    const updatedFiles = uploadedFiles.map(file => 
      file.id === id ? { ...file, ...updates } : file
    );
    setUploadedFiles(updatedFiles);
    updateCampaignData({ contentFiles: updatedFiles });
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    updateCampaignData({ contentFiles: updatedFiles });
  };

  const canContinue = uploadedFiles.length > 0 && 
    uploadedFiles.every(file => 
      file.contentType !== '' && 
      file.assignedEditor !== 'unassigned'
    );

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
          Upload video, audio, and image files • Enhanced with Virality Intelligence
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Main Upload Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Upload Zone */}
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

          {/* Uploaded Files Grid */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Uploaded Files ({uploadedFiles.length})
              </h3>
              <div className="grid gap-4">
                {uploadedFiles.map((fileData) => (
                  <FileCard
                    key={fileData.id}
                    fileData={fileData}
                    onUpdate={updateFileMetadata}
                    onRemove={removeFile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-1">
          <UploadSummaryPanel files={uploadedFiles} />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
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
          {canContinue ? 'Continue to Syndication' : 
           uploadedFiles.length === 0 ? 'Upload at least 1 file to continue' :
           'Complete all assignments to continue'}
        </Button>
      </div>

      {/* Status Messages */}
      {uploadedFiles.length > 0 && (
        <div className="text-center space-y-2">
          {canContinue ? (
            <p className="text-green-400 text-sm">
              ✨ All files processed and ready for syndication!
            </p>
          ) : (
            <div className="space-y-1">
              {uploadedFiles.some(f => f.assignedEditor === 'unassigned') && (
                <p className="text-red-400 text-sm">
                  ⚠️ Please assign editors to all files before continuing
                </p>
              )}
              {uploadedFiles.some(f => f.contentType === '') && (
                <p className="text-yellow-400 text-sm">
                  📝 Please select content types for all files
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep2;
