
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
