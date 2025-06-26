export interface FileMetadata {
  id: string;
  file: File;
  fileUrl?: string; // Supabase storage URL
  fileName?: string; // Store file name separately
  fileSize?: number; // Store file size separately  
  fileType?: string; // Store file type separately
  contentType: string;
  editorNotes: string;
  assignedEditor: string;
  viralityScore: number;
}

export const generateFileId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const calculateViralityScore = (file: File, fileName: string, isBulkUpload: boolean): number => {
  let score = 1;
  
  // Base score on file type
  if (file.type.startsWith('video/')) {
    score += 3;
  } else if (file.type.startsWith('image/')) {
    score += 2;
  } else if (file.type.startsWith('audio/')) {
    score += 1;
  }
  
  // Bonus for bulk uploads
  if (isBulkUpload) {
    score += 1;
  }
  
  // Bonus for certain keywords in filename
  const viralKeywords = ['trending', 'viral', 'challenge', 'dance', 'music', 'funny'];
  const lowerFileName = fileName.toLowerCase();
  const keywordMatches = viralKeywords.filter(keyword => lowerFileName.includes(keyword));
  score += keywordMatches.length;
  
  return Math.min(score, 10); // Cap at 10
};

export const calculateTotalRuntime = (files: FileMetadata[]): string => {
  // For now, return a simple count-based runtime estimate since we don't have actual duration data
  const totalFiles = files.length;
  
  if (totalFiles === 0) return '0m';
  
  // Estimate based on file types and count
  let totalMinutes = 0;
  
  files.forEach(file => {
    if (file.file.type.startsWith('video/')) {
      totalMinutes += 2; // Assume 2 minutes per video on average
    } else if (file.file.type.startsWith('audio/')) {
      totalMinutes += 3; // Assume 3 minutes per audio file on average
    } else if (file.file.type.startsWith('image/')) {
      totalMinutes += 0.1; // Images are quick to process
    }
  });
  
  if (totalMinutes < 1) return '<1m';
  if (totalMinutes < 60) return `${Math.round(totalMinutes)}m`;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};
