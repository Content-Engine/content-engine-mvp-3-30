
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, FileIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  progress: number;
}

interface FileUploadManagerProps {
  campaignId?: string;
  onFilesUploaded: (files: UploadedFile[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
}

const FileUploadManager = ({ 
  campaignId, 
  onFilesUploaded, 
  acceptedTypes = ['image/*', 'video/*'], 
  maxFiles = 10 
}: FileUploadManagerProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of acceptedFiles) {
      try {
        const fileId = `${Date.now()}-${file.name}`;
        const filePath = `${campaignId || 'general'}/${fileId}`;

        // Initialize file with 0 progress
        const initialFile: UploadedFile = {
          id: fileId,
          name: file.name,
          url: '',
          type: file.type,
          size: file.size,
          progress: 0
        };

        setUploadedFiles(prev => [...prev, initialFile]);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('content-files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('content-files')
          .getPublicUrl(filePath);

        const finalFile: UploadedFile = {
          ...initialFile,
          url: urlData.publicUrl,
          progress: 100
        };

        newFiles.push(finalFile);

        // Update progress
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileId ? finalFile : f)
        );

        // Save to content_items table if campaignId exists
        if (campaignId) {
          const { error: dbError } = await supabase
            .from('content_items')
            .insert({
              campaign_id: campaignId,
              file_name: file.name,
              file_type: file.type,
              file_url: urlData.publicUrl,
              status: 'pending'
            });

          if (dbError) {
            console.error('Error saving to database:', dbError);
          }
        }

      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
        
        // Remove failed upload from list
        setUploadedFiles(prev => prev.filter(f => f.name !== file.name));
      }
    }

    setUploading(false);
    onFilesUploaded(newFiles);
  }, [campaignId, onFilesUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    disabled: uploading
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      onFilesUploaded(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports images and videos (max {maxFiles} files)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileIcon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                    {file.progress < 100 && (
                      <Progress value={file.progress} className="mt-1" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadManager;
