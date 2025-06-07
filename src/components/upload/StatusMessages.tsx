
import { FileMetadata } from "@/utils/fileUtils";

interface StatusMessagesProps {
  files: FileMetadata[];
  canContinue: boolean;
}

const StatusMessages = ({ files, canContinue }: StatusMessagesProps) => {
  if (files.length === 0) return null;

  return (
    <div className="text-center space-y-2">
      {canContinue ? (
        <p className="text-green-400 text-sm">
          ✨ All files processed and ready for syndication!
        </p>
      ) : (
        <div className="space-y-1">
          {files.some(f => f.assignedEditor === 'unassigned') && (
            <p className="text-red-400 text-sm">
              ⚠️ Please assign editors to all files before continuing
            </p>
          )}
          {files.some(f => f.contentType === '') && (
            <p className="text-yellow-400 text-sm">
              📝 Please select content types for all files
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusMessages;
