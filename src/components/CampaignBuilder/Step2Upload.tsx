
import { useState, useCallback } from "react";
import { FileMetadata, generateFileId, calculateViralityScore } from "@/utils/fileUtils";
import UploadZone from "@/components/upload/UploadZone";
import FileGrid from "@/components/upload/FileGrid";
import StepNavigation from "@/components/upload/StepNavigation";
import StatusMessages from "@/components/upload/StatusMessages";
import StepHeader from "@/components/upload/StepHeader";
import UploadSummaryPanel from "@/components/UploadSummaryPanel";

interface Step2UploadProps {
  contentFiles: FileMetadata[];
  onFilesUpdate: (files: FileMetadata[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Step2Upload = ({ contentFiles, onFilesUpdate, onNext, onPrevious }: Step2UploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>(contentFiles || []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const bulkUpload = fileArray.length >= 5;
    
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/', 'video/', 'audio/'];
      const isValidType = validTypes.some(type => file.type.startsWith(type));
      const isValidSize = file.size <= 500 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    const newFileMetadata: FileMetadata[] = validFiles.map(file => ({
      id: generateFileId(),
      file,
      contentType: '',
      editorNotes: '',
      assignedEditor: 'unassigned',
      viralityScore: calculateViralityScore(file, file.name, bulkUpload)
    }));

    const updatedFiles = [...uploadedFiles, ...newFileMetadata];
    setUploadedFiles(updatedFiles);
    onFilesUpdate(updatedFiles);
  }, [uploadedFiles, onFilesUpdate]);

  const updateFileMetadata = (id: string, updates: Partial<FileMetadata>) => {
    const updatedFiles = uploadedFiles.map(file => 
      file.id === id ? { ...file, ...updates } : file
    );
    setUploadedFiles(updatedFiles);
    onFilesUpdate(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== id);
    setUploadedFiles(updatedFiles);
    onFilesUpdate(updatedFiles);
  };

  const hasFiles = uploadedFiles.length > 0;
  const allFilesValid = uploadedFiles.every(file => {
    const hasContentType = file.contentType && file.contentType !== '' && file.contentType !== 'raw';
    const hasEditor = file.assignedEditor && file.assignedEditor !== 'unassigned';
    return hasContentType && hasEditor;
  });

  const canContinue = hasFiles && allFilesValid;

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

export default Step2Upload;
