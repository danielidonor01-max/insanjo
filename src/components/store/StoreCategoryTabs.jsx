import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "../../utils/cn";

/**
 * Renders nothing unless the store actually provides category data —
 * the platform has no real category field today, so this only
 * activates for vendors/backends that supply `categories`.
 */
export default function StoreCategoryTabs({ categories, value, onChange }) {
  if (!categories || categories.length === 0) return null;

  return (
    <Tabs.Root value={value} onValueChange={onChange}>
      <Tabs.List className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <Tabs.Trigger
          value="all"
          className={cn(
            "shrink-0 rounded-store-control px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === "all" ? "bg-store-fg text-store-bg" : "text-store-muted-fg hover:bg-store-surface-hover",
          )}
        >
          All
        </Tabs.Trigger>
        {categories.map((cat) => (
          <Tabs.Trigger
            key={cat}
            value={cat}
            className={cn(
              "shrink-0 rounded-store-control px-3.5 py-1.5 text-sm font-medium transition-colors",
              value === cat ? "bg-store-fg text-store-bg" : "text-store-muted-fg hover:bg-store-surface-hover",
            )}
          >
            {cat}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
