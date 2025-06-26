
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileVideo, FileImage, FileAudio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileMetadata, generateFileId, calculateViralityScore } from "@/utils/fileUtils";
import { supabase } from "@/integrations/supabase/client";

interface Step2UploadProps {
  contentFiles: FileMetadata[];
  onFilesUpdate: (files: FileMetadata[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2Upload = ({ contentFiles, onFilesUpdate, onNext, onPrevious }: Step2UploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const getFileIcon = (file: File) => {
    // Add null checks to prevent the error
    if (!file || !file.type) {
      return <FileImage className="h-8 w-8" />;
    }
    
    if (file.type.startsWith('video/')) return <FileVideo className="h-8 w-8" />;
    if (file.type.startsWith('image/')) return <FileImage className="h-8 w-8" />;
    if (file.type.startsWith('audio/')) return <FileAudio className="h-8 w-8" />;
    return <FileImage className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFileToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateFileId()}.${fileExt}`;
      
      console.log(`📤 Uploading ${file.name} as ${fileName} to Supabase storage...`);
      
      const { data, error } = await supabase.storage
        .from('content-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('content-files')
        .getPublicUrl(fileName);

      console.log(`✅ File uploaded successfully: ${urlData.publicUrl}`);
      return urlData.publicUrl;
    } catch (error) {
      console.error('❌ Upload exception:', error);
      toast({
        title: "Upload Error",
        description: `Unexpected error uploading ${file.name}`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/', 'video/', 'audio/'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 500 * 1024 * 1024; // 500MB
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 500MB limit`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const newFileMetadata: FileMetadata[] = [];
    const totalFiles = validFiles.length;

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const progress = Math.round(((i + 1) / totalFiles) * 100);
      setUploadProgress(progress);

      console.log(`📤 Processing file ${i + 1}/${totalFiles}: ${file.name}`);
      
      const fileUrl = await uploadFileToSupabase(file);
      
      if (fileUrl) {
        newFileMetadata.push({
          id: generateFileId(),
          file: file, // Keep original file for metadata
          fileUrl: fileUrl, // Add the Supabase URL
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          contentType: '',
          editorNotes: '',
          assignedEditor: 'unassigned',
          viralityScore: calculateViralityScore(file, file.name, validFiles.length >= 5)
        });
        console.log(`✅ Added file metadata with URL: ${fileUrl}`);
      }
    }

    const updatedFiles = [...contentFiles, ...newFileMetadata];
    onFilesUpdate(updatedFiles);
    
    setIsUploading(false);
    setUploadProgress(0);
    
    toast({
      title: "Files Uploaded",
      description: `Successfully uploaded ${newFileMetadata.length} of ${validFiles.length} file(s) to storage`,
    });
  }, [contentFiles, onFilesUpdate, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const removeFile = async (id: string) => {
    const fileToRemove = contentFiles.find(file => file.id === id);
    
    // If the file has a URL, try to delete it from storage
    if (fileToRemove?.fileUrl) {
      try {
        const fileName = fileToRemove.fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage.from('content-files').remove([fileName]);
          console.log(`🗑️ Deleted file from storage: ${fileName}`);
        }
      } catch (error) {
        console.error('Error deleting file from storage:', error);
      }
    }
    
    const updatedFiles = contentFiles.filter(file => file.id !== id);
    onFilesUpdate(updatedFiles);
    toast({
      title: "File Removed",
      description: "File successfully removed from upload",
    });
  };

  const handleContinue = () => {
    if (contentFiles.length === 0) {
      toast({
        title: "Upload Required",
        description: "Please upload at least one file to continue",
        variant: "destructive",
      });
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Upload Your Content
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload videos, images, or audio files for your campaign
        </p>
      </div>

      {/* Upload Zone */}
      <Card className={`border-2 border-dashed transition-all duration-300 ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}>
        <CardContent 
          className="p-12 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-600 mb-4">
            Supports: Images, Videos, Audio • Max file size: 500MB
          </p>
          <Button className="bg-black text-white hover:bg-gray-800" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Choose Files"}
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            className="hidden"
            accept="image/*,video/*,audio/*"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            disabled={isUploading}
          />
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading files to storage...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {contentFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Uploaded Files ({contentFiles.length})
          </h3>
          <div className="grid gap-4">
            {contentFiles.map((fileData) => (
              <Card key={fileData.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-gray-600">
                        {getFileIcon(fileData.file)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {fileData.fileName || fileData.file?.name || 'Unknown file'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(fileData.fileSize || fileData.file?.size || 0)} • {fileData.fileType || fileData.file?.type || 'Unknown type'}
                        </p>
                        {fileData.fileUrl && (
                          <p className="text-xs text-green-600 truncate max-w-sm">
                            ✅ Uploaded to storage
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        Score: {fileData.viralityScore}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileData.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="px-6 py-2"
          disabled={isUploading}
        >
          ← Back
        </Button>
        
        <Button 
          onClick={handleContinue}
          size="lg" 
          className={`px-8 py-3 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            contentFiles.length > 0 && !isUploading
              ? "bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={contentFiles.length === 0 || isUploading}
        >
          Continue to Boost Settings →
        </Button>
      </div>
    </div>
  );
};

export default Step2Upload;
