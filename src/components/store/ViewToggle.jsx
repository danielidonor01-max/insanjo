import { LayoutGrid, List } from "lucide-react";
import { cn } from "../../utils/cn";

export default function ViewToggle({ value, onChange }) {
  return (
    <div className="inline-flex items-center rounded-store-control border border-store-border bg-store-surface p-0.5">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={value === "grid"}
        onClick={() => onChange("grid")}
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[calc(var(--radius-store-control)-2px)] transition-colors",
          value === "grid" ? "bg-store-surface-hover text-store-fg" : "text-store-muted hover:text-store-fg",
        )}
      >
        <LayoutGrid size={15} />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={cn(
          "grid h-8 w-8 place-items-center rounded-[calc(var(--radius-store-control)-2px)] transition-colors",
          value === "list" ? "bg-store-surface-hover text-store-fg" : "text-store-muted hover:text-store-fg",
        )}
      >
        <List size={15} />
      </button>
    </div>
  );
}
