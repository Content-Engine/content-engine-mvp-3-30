export interface FileMetadata {
  id: string;
  file: File;
  contentType: string;
  editorNotes: string;
  assignedEditor: string;
  viralityScore: number;
  songId?: string; // Add songId for video files
}

export const generateFileId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateViralityScore = (file: File, fileName: string, bulkUpload: boolean): number => {
  let score = 0;
  
  // +25 pts for video files over 30s (mock - assume longer videos are over 30s based on file size)
  if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) { // 50MB+ likely longer
    score += 25;
  }
  
  // +20 pts for portrait aspect ratio (mock - assume files with 'portrait' or '9:16' in name)
  if (fileName.toLowerCase().includes('portrait') || fileName.toLowerCase().includes('916') || fileName.toLowerCase().includes('vertical')) {
    score += 20;
  }
  
  // +10 pts for viral keywords
  const viralKeywords = ['hook', 'story', 'viral', 'clip', 'trending', 'moment', 'reaction'];
  const hasViralKeyword = viralKeywords.some(keyword => 
    fileName.toLowerCase().includes(keyword)
  );
  if (hasViralKeyword) {
    score += 10;
  }
  
  // +15 pts for bulk upload
  if (bulkUpload) {
    score += 15;
  }
  
  // +5 random variation
  score += Math.floor(Math.random() * 6);
  
  return Math.min(100, Math.max(0, score));
};

export const getViralityScoreColor = (score: number): { color: string; label: string; bgColor: string } => {
  if (score >= 71) {
    return { color: 'text-green-400', label: 'High', bgColor: 'bg-green-500/20' };
  } else if (score >= 41) {
    return { color: 'text-yellow-400', label: 'Medium', bgColor: 'bg-yellow-500/20' };
  } else {
    return { color: 'text-red-400', label: 'Low', bgColor: 'bg-red-500/20' };
  }
};

export const getFileTypeIcon = (file: File) => {
  if (file.type.startsWith('video/')) {
    return 'FileVideo';
  } else if (file.type.startsWith('audio/')) {
    return 'Music';
  } else if (file.type.startsWith('image/')) {
    return 'FileImage';
  }
  return 'File';
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const calculateTotalRuntime = (files: FileMetadata[]): string => {
  // Mock runtime calculation - in real app would extract from media metadata
  const totalSeconds = files.reduce((acc, fileData) => {
    if (fileData.file.type.startsWith('video/') || fileData.file.type.startsWith('audio/')) {
      // Mock: estimate based on file size (rough approximation)
      return acc + Math.floor(fileData.file.size / (1024 * 1024) * 10); // ~10 seconds per MB
    }
    return acc;
  }, 0);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
