
import { FileMetadata } from "@/utils/fileUtils";
import FileCard from "@/components/FileCard";

interface FileGridProps {
  files: FileMetadata[];
  onUpdateFile: (id: string, updates: Partial<FileMetadata>) => void;
  onRemoveFile: (id: string) => void;
}

const FileGrid = ({ files, onUpdateFile, onRemoveFile }: FileGridProps) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white">
        Uploaded Files ({files.length})
      </h3>
      <div className="grid gap-4">
        {files.map((fileData) => (
          <FileCard
            key={fileData.id}
            fileData={fileData}
            onUpdate={onUpdateFile}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
