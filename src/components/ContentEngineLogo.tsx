
import { Zap } from 'lucide-react';

interface ContentEngineLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const ContentEngineLogo = ({ size = 'medium' }: ContentEngineLogoProps) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-lg`}>
      <Zap className={`${size === 'small' ? 'h-4 w-4' : size === 'medium' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
    </div>
  );
};

export default ContentEngineLogo;
