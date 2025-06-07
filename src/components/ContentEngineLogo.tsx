
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
      <img 
        src="/lovable-uploads/fb15ada8-fb97-44e9-82df-d6e779eaa094.png"
        alt="Content Engine Logo"
        className={cn("object-contain", sizeClasses[size])}
      />
    </div>
  );
};

export default ContentEngineLogo;
