
import { FileMetadata } from "@/utils/fileUtils";

interface StatusMessagesProps {
  files: FileMetadata[];
  canContinue: boolean;
}

const StatusMessages = ({ files, canContinue }: StatusMessagesProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center">
        <p className="text-yellow-400 text-sm">
          📁 Upload at least 1 file to get started
        </p>
      </div>
    );
  }

  const unassignedFiles = files.filter(f => f.assignedEditor === 'unassigned');
  const rawContentFiles = files.filter(f => f.contentType === '' || f.contentType === 'raw');

  return (
    <div className="text-center space-y-2">
      {canContinue ? (
        <p className="text-green-400 text-sm">
          ✨ All files processed and ready for syndication!
        </p>
      ) : (
        <div className="space-y-1">
          {unassignedFiles.length > 0 && (
            <p className="text-red-400 text-sm">
              ⚠️ {unassignedFiles.length} file(s) need editor assignment
            </p>
          )}
          {rawContentFiles.length > 0 && (
            <p className="text-yellow-400 text-sm">
              📝 {rawContentFiles.length} file(s) need content type selection (can't be "Raw Content")
            </p>
          )}
          <p className="text-blue-400 text-xs">
            Each file must have both a content type and an assigned editor
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
