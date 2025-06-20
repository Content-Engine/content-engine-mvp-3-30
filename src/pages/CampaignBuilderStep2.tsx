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

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const bulkUpload = fileArray.length >= 5;

    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/', 'video/', 'audio/'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 500 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    const uploadedMetadata: FileMetadata[] = [];

    for (const file of validFiles) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("https://hook.make.com/YOUR_WEBHOOK_URL", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        const fileUrl = result.fileUrl || result.url || "";

        uploadedMetadata.push({
          id: generateFileId(),
          file: file,
          contentType: '',
          editorNotes: '',
          assignedEditor: 'unassigned',
          viralityScore: calculateViralityScore(file, file.name, bulkUpload),
        });
      } catch (error) {
        console.error("File upload failed:", file.name, error);
      }
    }

    const updatedFiles = [...uploadedFiles, ...uploadedMetadata];
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

  const hasFiles = uploadedFiles.length > 0;
  const allFilesValid = uploadedFiles.every(file => {
    const hasContentType = file.contentType && file.contentType !== '' && file.contentType !== 'raw';
    const hasEditor = file.assignedEditor && file.assignedEditor !== 'unassigned';
    return hasContentType && hasEditor;
  });

  const canContinue = hasFiles && allFilesValid;

  const handleNext = () => {
    if (canContinue && onNext) {
      onNext();
    } else {
      console.warn("Validation failed or onNext missing");
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
    </div>
  );
};

export default CampaignBuilderStep2;
