
import { Edit3, Trash2, Play, Clock } from 'lucide-react';

interface ContentMetadata {
  title: string;
  description: string;
  thumbnail_url: string;
  provider_name: string;
  duration?: number;
  original_url: string;
}

interface ContentPreviewCardProps {
  metadata: ContentMetadata;
  onEdit: () => void;
  onRemove: () => void;
}

const ContentPreviewCard = ({ metadata, onEdit, onRemove }: ContentPreviewCardProps) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProviderColor = (provider: string): string => {
    switch (provider.toLowerCase()) {
      case 'youtube': return 'bg-red-600/20 border-red-500/30 text-red-400';
      case 'vimeo': return 'bg-blue-600/20 border-blue-500/30 text-blue-400';
      case 'instagram': return 'bg-pink-600/20 border-pink-500/30 text-pink-400';
      case 'tiktok': return 'bg-purple-600/20 border-purple-500/30 text-purple-400';
      default: return 'bg-slate-600/20 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-600/30 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-300 animate-in fade-in scale-in-95">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-700/50 group">
        <img 
          src={metadata.thumbnail_url} 
          alt={metadata.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20"></div>
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/50">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        
        {/* Provider badge */}
        <div className={`absolute top-3 right-3 backdrop-blur-sm border rounded-lg px-2 py-1 ${getProviderColor(metadata.provider_name)}`}>
          <span className="text-xs font-medium">{metadata.provider_name}</span>
        </div>
        
        {/* Duration badge */}
        {metadata.duration && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded px-2 py-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300 text-xs">{formatDuration(metadata.duration)}</span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-slate-50 font-semibold mb-2 line-clamp-2 text-lg leading-tight">
          {metadata.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {metadata.description}
        </p>
        
        {/* URL Display */}
        <div className="mb-4 p-2 bg-slate-700/30 rounded-lg border border-slate-600/20">
          <p className="text-slate-500 text-xs font-mono truncate">
            {metadata.original_url}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="flex-1 bg-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-lg px-4 py-2 text-slate-300 text-sm hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Details
          </button>
          <button 
            onClick={onRemove}
            className="px-4 py-2 bg-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-600/30 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewCard;
