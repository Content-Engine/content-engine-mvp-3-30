
import { useState, useCallback } from "react";
import { FileMetadata, generateFileId, calculateViralityScore } from "@/utils/fileUtils";
import UploadZone from "@/components/upload/UploadZone";
import FileGrid from "@/components/upload/FileGrid";
import StepNavigation from "@/components/upload/StepNavigation";
import StatusMessages from "@/components/upload/StatusMessages";
import StepHeader from "@/components/upload/StepHeader";
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

  // Updated canContinue logic - only require at least 1 file and all files to have content type and editor assigned
  const canContinue = uploadedFiles.length > 0 && 
    uploadedFiles.every(file => 
      file.contentType !== '' && 
      file.contentType !== 'raw' && // Don't allow 'raw' as final content type
      file.assignedEditor !== 'unassigned'
    );

  console.log('Step 2 - Can continue:', canContinue);
  console.log('Step 2 - Files:', uploadedFiles.length);
  console.log('Step 2 - Files validation:', uploadedFiles.map(f => ({
    id: f.id,
    contentType: f.contentType,
    assignedEditor: f.assignedEditor
  })));

  return (
    <div className="space-y-8">
      <StepHeader />

      <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-3 space-y-6">
          <UploadZone 
            onFilesUploaded={handleFiles}
            dragActive={dragActive}
            onDragStateChange={setDragActive}
          />
          
          <FileGrid 
            files={uploadedFiles}
            onUpdateFile={updateFileMetadata}
            onRemoveFile={removeFile}
          />
        </div>

        <div className="lg:col-span-1">
          <UploadSummaryPanel files={uploadedFiles} />
        </div>
      </div>

      <StepNavigation 
        canContinue={canContinue}
        uploadedFilesCount={uploadedFiles.length}
        onNext={onNext}
        onPrevious={onPrevious}
      />

      <StatusMessages 
        files={uploadedFiles}
        canContinue={canContinue}
      />
    </div>
  );
};

export default CampaignBuilderStep2;
