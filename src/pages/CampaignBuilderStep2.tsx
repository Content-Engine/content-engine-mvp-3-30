
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
      contentType: '', // Start empty, user must select
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

  // Check if we can continue - need at least 1 file and all files must have content type and editor
  const hasFiles = uploadedFiles.length > 0;
  const allFilesValid = uploadedFiles.every(file => {
    const hasContentType = file.contentType && file.contentType !== '' && file.contentType !== 'raw';
    const hasEditor = file.assignedEditor && file.assignedEditor !== 'unassigned';
    console.log(`File ${file.id}: contentType=${file.contentType}, hasContentType=${hasContentType}, assignedEditor=${file.assignedEditor}, hasEditor=${hasEditor}`);
    return hasContentType && hasEditor;
  });

  const canContinue = hasFiles && allFilesValid;

  console.log('=== STEP 2 VALIDATION ===');
  console.log('Has files:', hasFiles, '- Total files:', uploadedFiles.length);
  console.log('All files valid:', allFilesValid);
  console.log('Can continue:', canContinue);
  console.log('Files details:', uploadedFiles.map(f => ({
    id: f.id,
    name: f.file.name,
    contentType: f.contentType,
    assignedEditor: f.assignedEditor,
    isValid: f.contentType && f.contentType !== '' && f.contentType !== 'raw' && f.assignedEditor && f.assignedEditor !== 'unassigned'
  })));

  const handleNext = () => {
    console.log('=== HANDLE NEXT CALLED ===');
    console.log('canContinue:', canContinue);
    console.log('onNext function exists:', !!onNext);
    
    if (canContinue && onNext) {
      console.log('Calling onNext() - should navigate to step 3');
      onNext();
    } else {
      console.log('Cannot continue - validation failed or onNext missing');
      console.log('Reasons:');
      console.log('- Has files:', hasFiles);
      console.log('- All files valid:', allFilesValid);
      console.log('- onNext exists:', !!onNext);
    }
  };

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
        onNext={handleNext}
        onPrevious={onPrevious}
      />

      <StatusMessages 
        files={uploadedFiles}
        canContinue={canContinue}
      />

      {/* Debug info for testing */}
      {uploadedFiles.length > 0 && (
        <div className="text-center">
          <div className="glass-card-strong p-4 inline-block">
            <p className="text-white/80 text-sm">
              Debug: {uploadedFiles.length} files uploaded, canContinue: {canContinue.toString()}
            </p>
            <p className="text-white/60 text-xs mt-1">
              Files need: Content Type (not Raw) + Assigned Editor
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignBuilderStep2;
