
import { useState } from "react";
import { FileMetadata } from "@/utils/fileUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText, Image, Video, Music } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface FileCardProps {
  fileData: FileMetadata;
  onUpdate: (id: string, updates: Partial<FileMetadata>) => void;
  onRemove: (id: string) => void;
}

const FileCard = ({ fileData, onUpdate, onRemove }: FileCardProps) => {
  const { userRole } = useAuth();
  const [localContentType, setLocalContentType] = useState(fileData.contentType);
  const [localEditor, setLocalEditor] = useState(fileData.assignedEditor);

  console.log('FileCard rendered for file:', fileData.id, 'userRole:', userRole);
  console.log('Current contentType:', localContentType, 'assignedEditor:', localEditor);
  console.log('File object:', fileData.file);

  const getFileIcon = () => {
    if (!fileData.file || !fileData.file.type) {
      console.warn('File or file.type is undefined for file:', fileData.id);
      return <FileText className="h-4 w-4" />;
    }
    
    if (fileData.file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileData.file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (fileData.file.type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const getFilePreview = () => {
    if (!fileData.file || !fileData.file.type) {
      return (
        <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
          <FileText className="h-8 w-8 text-white/50" />
          <span className="ml-2 text-white/70 text-sm">Unknown file type</span>
        </div>
      );
    }

    if (fileData.file.type.startsWith('image/')) {
      try {
        return (
          <img 
            src={URL.createObjectURL(fileData.file)} 
            alt={fileData.file.name || 'Uploaded file'}
            className="w-full h-32 object-cover rounded-lg"
          />
        );
      } catch (error) {
        console.error('Error creating object URL:', error);
        return (
          <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
            <Image className="h-8 w-8 text-white/50" />
            <span className="ml-2 text-white/70 text-sm">Image preview unavailable</span>
          </div>
        );
      }
    }
    
    return (
      <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center">
        {getFileIcon()}
        <span className="ml-2 text-white/70 text-sm">{fileData.file.type || 'Unknown'}</span>
      </div>
    );
  };

  // All available content types
  const contentTypes = [
    { value: '', label: 'Select Content Type' },
    { value: 'raw', label: 'Raw Content' },
    { value: 'educational', label: 'Educational' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'promotional', label: 'Promotional' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'behind_scenes', label: 'Behind the Scenes' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'announcement', label: 'Announcement' }
  ];

  // All available editors - admins should see all
  const editors = [
    { value: 'unassigned', label: 'Select Editor' },
    { value: 'sarah_m', label: 'Sarah M.' },
    { value: 'mike_j', label: 'Mike J.' },
    { value: 'emma_w', label: 'Emma W.' },
    { value: 'alex_r', label: 'Alex R.' },
    { value: 'jenny_l', label: 'Jenny L.' }
  ];

  console.log('Available editors:', editors);
  console.log('Available content types:', contentTypes);

  const handleContentTypeChange = (value: string) => {
    console.log('Content type changed to:', value);
    setLocalContentType(value);
    onUpdate(fileData.id, { contentType: value });
  };

  const handleEditorChange = (value: string) => {
    console.log('Editor changed to:', value);
    setLocalEditor(value);
    onUpdate(fileData.id, { assignedEditor: value });
  };

  const getStatusColor = () => {
    const hasContentType = localContentType && localContentType !== '' && localContentType !== 'raw';
    const hasEditor = localEditor && localEditor !== 'unassigned';
    
    if (hasContentType && hasEditor) return 'bg-green-500/20 text-green-400';
    if (hasContentType || hasEditor) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getStatusText = () => {
    const hasContentType = localContentType && localContentType !== '' && localContentType !== 'raw';
    const hasEditor = localEditor && localEditor !== 'unassigned';
    
    if (hasContentType && hasEditor) return 'Ready';
    if (!hasContentType && !hasEditor) return 'Needs Setup';
    if (!hasContentType) return 'Needs Content Type';
    return 'Needs Editor';
  };

  const fileName = fileData.file?.name || 'Unknown file';
  const fileSize = fileData.file?.size || 0;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {getFileIcon()}
          <div>
            <h3 className="text-white font-medium truncate max-w-xs">
              {fileName}
            </h3>
            <p className="text-white/60 text-sm">
              {(fileSize / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(fileData.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {getFilePreview()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Content Type</label>
          <select
            value={localContentType}
            onChange={(e) => handleContentTypeChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-white/40 focus:outline-none"
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Assigned Editor</label>
          <select
            value={localEditor}
            onChange={(e) => handleEditorChange(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-white/40 focus:outline-none"
          >
            {editors.map((editor) => (
              <option key={editor.value} value={editor.value} className="bg-gray-800 text-white">
                {editor.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fileData.viralityScore && (
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-white/60 text-sm">Virality Score</span>
          <Badge variant="outline" className="border-purple-400/30 text-purple-400">
            {fileData.viralityScore}/100
          </Badge>
        </div>
      )}

      {fileData.editorNotes && (
        <div className="space-y-2">
          <label className="text-white/80 text-sm font-medium">Editor Notes</label>
          <textarea
            value={fileData.editorNotes}
            onChange={(e) => onUpdate(fileData.id, { editorNotes: e.target.value })}
            placeholder="Add notes for the editor..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm resize-none focus:border-white/40 focus:outline-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default FileCard;
