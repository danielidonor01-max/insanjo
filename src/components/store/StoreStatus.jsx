import { formatTime } from "../../utils/time";
import { cn } from "../../utils/cn";

export default function StoreStatus({ isOpenNow, openingTime, closingTime, className = "" }) {
  const hoursLabel = isOpenNow
    ? closingTime && `Closes ${formatTime(closingTime)}`
    : openingTime && `Opens ${formatTime(openingTime)}`;

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", isOpenNow ? "bg-emerald-500" : "bg-store-destructive")}
      />
      <span className={cn("font-medium", isOpenNow ? "text-emerald-600 dark:text-emerald-400" : "text-store-destructive")}>
        {isOpenNow ? "Open now" : "Closed"}
      </span>
      {hoursLabel && <span className="text-store-muted-fg">· {hoursLabel}</span>}
    </div>
  );
}
