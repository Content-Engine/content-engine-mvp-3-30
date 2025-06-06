
import { cn } from "@/lib/utils";

interface ContentEngineLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const ContentEngineLogo = ({ size = "medium", className }: ContentEngineLogoProps) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "relative rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center",
        sizeClasses[size]
      )}>
        <div className="text-white font-bold text-lg">CE</div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-400/20"></div>
      </div>
    </div>
  );
};

export default ContentEngineLogo;
