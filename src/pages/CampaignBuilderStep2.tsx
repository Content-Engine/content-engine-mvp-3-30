
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, User, CheckCircle } from "lucide-react";
import { FileMetadata, generateFileId, calculateViralityScore } from "@/utils/fileUtils";

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
      const validTypes = ['image/', 'video/', 'audio/'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 500 * 1024 * 1024; // 500MB limit
      return isValidType && isValidSize;
    });

    const newFileMetadata: FileMetadata[] = validFiles.map(file => ({
      id: generateFileId(),
      file,
      contentType: 'short', // Default to short
      editorNotes: '',
      assignedEditor: 'auto-assign',
      viralityScore: calculateViralityScore(file, file.name, bulkUpload)
    }));

    const updatedFiles = [...uploadedFiles, ...newFileMetadata];
    setUploadedFiles(updatedFiles);
    updateCampaignData({ contentFiles: updatedFiles });
  }, [uploadedFiles, updateCampaignData]);

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

  const canContinue = uploadedFiles.length > 0;

  const contentTypes = [
    { value: 'short', label: 'Short Video' },
    { value: 'graphic', label: 'Graphic/Image' },
    { value: 'quote', label: 'Quote Card' },
    { value: 'meme', label: 'Meme' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'ad', label: 'Advertisement' }
  ];

  const editors = [
    { value: 'auto-assign', label: 'Auto-Assign' },
    { value: 'editor-1', label: 'Sarah Chen' },
    { value: 'editor-2', label: 'Marcus Rivera' },
    { value: 'editor-3', label: 'Emma Thompson' }
  ];

  return (
    <div className="animate-fade-in spacing-content">
      {/* Step Header */}
      <div className="text-center space-y-4">
        <div className="card-glass p-8 inline-block">
          <h2 className="text-display bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-4">
            Upload Content 📁
          </h2>
          <div className="h-1 w-full bg-gradient-to-r from-accent to-accent/80 rounded-full"></div>
        </div>
        <p className="text-body text-text-muted card-glass p-4 inline-block max-w-2xl">
          Upload your content files and assign them to editors for processing
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <Card className="card-glass">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive 
                    ? 'border-accent bg-accent/10 scale-105' 
                    : 'border-border-color hover:border-accent/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <Upload className="h-16 w-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-heading-3 text-text-main mb-3">
                  {dragActive ? 'Drop files here!' : 'Drop files here or click to browse'}
                </h3>
                <p className="text-body-sm text-text-muted mb-6">
                  Supports MP4, MOV, MP3, WAV, JPG, PNG (Max 500MB each)
                </p>
                <Button className="btn-primary">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Grid */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              {uploadedFiles.map((file) => (
                <Card key={file.id} className="card-primary">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-accent" />
                        <div>
                          <p className="text-body-sm font-medium text-text-main truncate">
                            {file.file.name}
                          </p>
                          <p className="text-caption text-text-muted">
                            {(file.file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-caption text-text-muted mb-1">Content Type</label>
                        <select
                          value={file.contentType}
                          onChange={(e) => updateFileMetadata(file.id, { contentType: e.target.value })}
                          className="input-primary text-body-sm h-10"
                        >
                          {contentTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-caption text-text-muted mb-1">Assigned Editor</label>
                        <select
                          value={file.assignedEditor}
                          onChange={(e) => updateFileMetadata(file.id, { assignedEditor: e.target.value })}
                          className="input-primary text-body-sm h-10"
                        >
                          {editors.map(editor => (
                            <option key={editor.value} value={editor.value}>{editor.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-caption text-text-muted">Virality Score</p>
                          <p className="text-body font-bold text-accent">{file.viralityScore}%</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div>
          <Card className="card-primary sticky top-4">
            <CardHeader>
              <CardTitle className="text-heading-4 text-text-main">Upload Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-body-sm text-text-muted">Files Uploaded:</span>
                <span className="text-body-sm font-medium text-text-main">{uploadedFiles.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-body-sm text-text-muted">Auto-Assigned:</span>
                <span className="text-body-sm font-medium text-text-main">
                  {uploadedFiles.filter(f => f.assignedEditor === 'auto-assign').length}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-body-sm text-text-muted">Avg. Virality:</span>
                <span className="text-body-sm font-medium text-accent">
                  {uploadedFiles.length > 0 ? 
                    Math.round(uploadedFiles.reduce((sum, f) => sum + f.viralityScore, 0) / uploadedFiles.length) : 0
                  }%
                </span>
              </div>

              {canContinue && (
                <div className="status-active w-fit mx-auto mt-4">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ready to Continue
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={onPrevious}
          className="text-text-muted hover:text-text-main"
        >
          Previous
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!canContinue}
          className={canContinue ? "btn-primary" : "btn-secondary"}
        >
          {canContinue ? "Continue to Syndication" : "Upload files to continue"}
        </Button>
      </div>
    </div>
  );
};

export default CampaignBuilderStep2;
