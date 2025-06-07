
import { Button } from "@/components/ui/button";

interface StepNavigationProps {
  canContinue: boolean;
  uploadedFilesCount: number;
  onNext: () => void;
  onPrevious: () => void;
}

const StepNavigation = ({ canContinue, uploadedFilesCount, onNext, onPrevious }: StepNavigationProps) => {
  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (canContinue && onNext) {
      onNext();
    }
  };

  const handlePreviousClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPrevious) {
      onPrevious();
    }
  };

  const getButtonText = () => {
    if (canContinue) return 'Continue to Syndication';
    if (uploadedFilesCount === 0) return 'Upload at least 1 file to continue';
    return 'Complete all assignments to continue';
  };

  return (
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={handlePreviousClick}
        className="text-white/90 hover:text-white"
      >
        Previous
      </Button>
      
      <Button 
        onClick={handleNextClick} 
        size="lg" 
        className="glass-button-primary"
        disabled={!canContinue}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default StepNavigation;
