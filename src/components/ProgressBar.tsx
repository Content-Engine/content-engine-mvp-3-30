
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                step <= currentStep
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/20 text-white/60"
              )}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-1 w-12 md:w-20 transition-all duration-300",
                  step < currentStep
                    ? "bg-gradient-to-r from-pink-500 to-purple-600"
                    : "bg-white/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-white/60">
        <span>Goal</span>
        <span>Content</span>
        <span>Syndication</span>
        <span>Boosts</span>
        <span>Launch</span>
      </div>
    </div>
  );
};

export default ProgressBar;
