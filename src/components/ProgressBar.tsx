
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-body-sm text-text-muted">Progress</span>
        <span className="text-body-sm text-accent font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                step <= currentStep 
                  ? 'bg-accent text-white' 
                  : 'bg-surface text-text-muted'
              }`}
            >
              {step}
            </div>
            <span className="text-caption text-text-muted mt-1">
              {step === 1 && 'Goal'}
              {step === 2 && 'Upload'}
              {step === 3 && 'Syndication'}
              {step === 4 && 'Boosts'}
              {step === 5 && 'Launch'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
