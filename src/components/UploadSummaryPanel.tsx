
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileMetadata, calculateTotalRuntime } from '@/utils/fileUtils';

interface UploadSummaryPanelProps {
  files: FileMetadata[];
}

const UploadSummaryPanel = ({ files }: UploadSummaryPanelProps) => {
  const unassignedCount = files.filter(f => f.assignedEditor === 'unassigned').length;
  const avgViralityScore = files.length > 0 
    ? Math.round(files.reduce((acc, f) => acc + f.viralityScore, 0) / files.length)
    : 0;
  const totalRuntime = calculateTotalRuntime(files);

  const getAvgScoreColor = (score: number) => {
    if (score >= 71) return 'text-green-400 bg-green-500/20';
    if (score >= 41) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  return (
    <Card className="frosted-glass bg-gradient-to-br from-purple-500/20 to-blue-600/20 border-0 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white text-lg">Upload Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{files.length}</div>
            <div className="text-white/70 text-sm">Files Uploaded</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{totalRuntime}</div>
            <div className="text-white/70 text-sm">Total Runtime</div>
          </div>
        </div>

        <div className="text-center">
          <Badge className={`${getAvgScoreColor(avgViralityScore)} border-0 text-lg px-3 py-1`}>
            {avgViralityScore} Avg Score
          </Badge>
        </div>

        {unassignedCount > 0 && (
          <div className="text-center">
            <Badge className="bg-red-500/20 text-red-400 border-0">
              {unassignedCount} Unassigned
            </Badge>
          </div>
        )}

        <div className="pt-2 border-t border-white/20">
          <div className="text-white/90 text-sm space-y-1">
            <div>• Video: {files.filter(f => f.file.type.startsWith('video/')).length}</div>
            <div>• Audio: {files.filter(f => f.file.type.startsWith('audio/')).length}</div>
            <div>• Images: {files.filter(f => f.file.type.startsWith('image/')).length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSummaryPanel;
