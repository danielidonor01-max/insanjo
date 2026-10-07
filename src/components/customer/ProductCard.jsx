import { useEffect, useState } from "react";
import { Heart, Eye } from "lucide-react";
import { isLocalFavorite, toggleLocalFavorite } from "../../utils/localFavorites";
import { cn } from "../../utils/cn";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80";

function formatDescription(text) {
  if (!text || text.trim().length === 0) return null;
  const trimmed = text.trim();
  return trimmed.length > 90 ? trimmed.slice(0, trimmed.lastIndexOf(" ", 90)) + "…" : trimmed;
}

function getStockBadge(availableStock) {
  if (availableStock === 0) {
    return { label: "Out of Stock", cls: "bg-store-fg/80 text-store-bg" };
  }
  if (availableStock != null && availableStock <= 5) {
    return { label: "Low Stock", cls: "bg-amber-500 text-white" };
  }
  return null;
}

export default function ProductCard({
  id,
  name,
  price,
  description,
  image,
  images,
  category,
  availableStock,
  layout = "grid",
  onSelect,
}) {
  const imageUrl = image || images?.[0] || FALLBACK_IMAGE;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (id) setFavorited(isLocalFavorite(id));
  }, [id]);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!id) return;
    setFavorited(toggleLocalFavorite(id));
  };

  const stockBadge = getStockBadge(availableStock);
  const shortDescription = formatDescription(description);
  const isList = layout === "list";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-store-card border border-store-border/70 bg-store-surface/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-store-fg/20 hover:shadow-[0_12px_32px_-12px_var(--pattern-royal)] dark:hover:shadow-black/40",
        isList ? "flex items-stretch gap-4 p-3 sm:gap-5 sm:p-4" : "flex flex-col",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect?.(id)}
        className={cn(
          "relative shrink-0 overflow-hidden bg-store-bg text-left",
          isList ? "h-24 w-24 rounded-store-control sm:h-32 sm:w-32" : "aspect-square w-full",
        )}
      >
        <img
          src={imageUrl}
          alt={name || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {stockBadge && (
          <span
            className={cn(
              "absolute left-2.5 top-2.5 rounded-store-control px-2 py-0.5 text-[11px] font-semibold leading-tight",
              stockBadge.cls,
            )}
          >
            {stockBadge.label}
          </span>
        )}

        {!isList && (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-store-control bg-store-surface px-3 py-1.5 text-xs font-semibold text-store-fg shadow-sm">
              <Eye size={13} />
              Quick View
            </span>
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
        aria-pressed={favorited}
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-store-surface/90 text-store-fg shadow-sm backdrop-blur-sm transition-transform hover:scale-105 active:scale-95",
          isList ? "order-last self-start" : "absolute right-2.5 top-2.5",
        )}
      >
        <Heart size={14} className={favorited ? "fill-store-primary text-store-primary" : "text-store-fg"} />
      </button>

      <button
        type="button"
        onClick={() => onSelect?.(id)}
        className={cn("flex min-w-0 flex-1 flex-col gap-1 text-left", isList ? "justify-center" : "px-4 pb-4 pt-3")}
      >
        <h3 className="truncate text-sm font-semibold text-store-fg">{name || "Product"}</h3>
        {shortDescription && (
          <p className={cn("text-xs leading-relaxed text-store-muted-fg", isList ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-2")}>
            {shortDescription}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-store-fg">{price}</span>
          {category && <span className="text-xs text-store-muted">· {category}</span>}
        </div>
      </button>
    </div>
  );
}
