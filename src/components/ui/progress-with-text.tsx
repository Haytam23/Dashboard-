import { cn } from "@/lib/utils";

interface ProgressWithTextProps {
  value: number;
  showText?: boolean;
  textClass?: string;
  className?: string;
  indicatorColor?: string;
}

export function ProgressWithText({
  value,
  showText = true,
  textClass,
  className,
  indicatorColor,
}: ProgressWithTextProps) {
  return (
    <div className="relative w-full">
      <div
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
      >
        <div
          className={cn("h-full w-full flex-1 transition-all", indicatorColor || "bg-primary")}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
      {showText && (
        <span 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium",
            textClass
          )}
        >
          {value}%
        </span>
      )}
    </div>
  );
}