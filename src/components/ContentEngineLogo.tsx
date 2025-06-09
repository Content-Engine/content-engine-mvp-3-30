
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
        src="/lovable-uploads/ae36c0dd-50b0-42f4-9e47-7d0b4d2be2e9.png"
        alt="Content Engine Logo"
        className={cn("object-contain", sizeClasses[size])}
        onError={(e) => {
          console.log("Logo failed to load:", e);
          // Fallback to a simple text logo if image fails
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.innerHTML = '<div class="text-white font-bold text-xl">CE</div>';
        }}
      />
    </div>
  );
};

export default ContentEngineLogo;
