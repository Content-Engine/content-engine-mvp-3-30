
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, FileVideo, Music, FileImage, File } from 'lucide-react';
import { FileMetadata, getViralityScoreColor, formatFileSize, getFileTypeIcon } from '@/utils/fileUtils';
import SongPicker from '@/components/upload/SongPicker';

interface FileCardProps {
  fileData: FileMetadata;
  onUpdate: (id: string, updates: Partial<FileMetadata>) => void;
  onRemove: (id: string) => void;
}

const contentTypes = [
  { value: 'raw', label: 'Raw Content' },
  { value: 'short-form', label: 'Short-form Video' },
  { value: 'visual', label: 'Visual Content' },
  { value: 'audio', label: 'Audio Content' },
  { value: 'story', label: 'Story Content' },
  { value: 'highlight', label: 'Highlight Reel' }
];

const editors = [
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'editor-a', label: 'Editor A' },
  { value: 'editor-b', label: 'Editor B' },
  { value: 'editor-c', label: 'Editor C' },
  { value: 'lead-editor', label: 'Lead Editor' }
];

const FileCard = ({ fileData, onUpdate, onRemove }: FileCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const viralityData = getViralityScoreColor(fileData.viralityScore);
  
  const iconMap = {
    FileVideo: FileVideo,
    Music: Music,
    FileImage: FileImage,
    File: File
  };
  
  const IconComponent = iconMap[getFileTypeIcon(fileData.file) as keyof typeof iconMap];

  const handleSongSelect = (songId: string) => {
    onUpdate(fileData.id, { songId });
  };

  const isVideoFile = fileData.file.type.startsWith('video/');

  return (
    <Card className={`frosted-glass bg-gradient-to-br from-gray-600/40 to-gray-700/40 border-0 ${
      fileData.assignedEditor === 'unassigned' ? 'ring-2 ring-red-400/50' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <IconComponent className="h-8 w-8 text-blue-400" />
            <div>
              <h4 className="text-white font-medium truncate max-w-[200px]" title={fileData.file.name}>
                {fileData.file.name}
              </h4>
              <p className="text-white/60 text-sm">{formatFileSize(fileData.file.size)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`${viralityData.bgColor} ${viralityData.color} border-0`}>
              {fileData.viralityScore} - {viralityData.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 p-1"
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(fileData.id)}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Area */}
        {fileData.file.type.startsWith('image/') && (
          <div className="mb-3">
            <img 
              src={URL.createObjectURL(fileData.file)} 
              alt="Preview"
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}

        {/* Metadata Controls */}
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-white/90 text-sm font-medium mb-1 block">Content Type</label>
              <Select 
                value={fileData.contentType} 
                onValueChange={(value) => onUpdate(fileData.id, { contentType: value })}
              >
                <SelectTrigger className="glass-card-subtle border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-gray-800 border-white/20">
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white/90 text-sm font-medium mb-1 block">
                Assigned Editor
                {fileData.assignedEditor === 'unassigned' && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </label>
              <Select 
                value={fileData.assignedEditor} 
                onValueChange={(value) => onUpdate(fileData.id, { assignedEditor: value })}
              >
                <SelectTrigger className={`glass-card-subtle border-white/20 text-white ${
                  fileData.assignedEditor === 'unassigned' ? 'border-red-400/50' : ''
                }`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card bg-gray-800 border-white/20">
                  {editors.map((editor) => (
                    <SelectItem key={editor.value} value={editor.value} className="text-white hover:bg-white/10">
                      {editor.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Song Selection for Video Files */}
              {isVideoFile && (
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">Background Music</label>
                  <SongPicker
                    selectedSongId={fileData.songId || null}
                    onSongSelect={handleSongSelect}
                  />
                </div>
              )}

              <div>
                <label className="text-white/90 text-sm font-medium mb-1 block">Editor Notes</label>
                <Textarea
                  value={fileData.editorNotes}
                  onChange={(e) => onUpdate(fileData.id, { editorNotes: e.target.value })}
                  placeholder="Add notes for the assigned editor..."
                  className="glass-card-subtle border-white/20 text-white placeholder:text-white/50 resize-none h-20"
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
