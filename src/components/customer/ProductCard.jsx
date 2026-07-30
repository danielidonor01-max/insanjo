import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function ProductCard({
  name,
  price,
  images,
  isFavorited: initialFav = false,
  style = {},
  className = "",
}) {
  const [faved, setFaved] = useState(initialFav);
  const imageUrl =
    images?.[0] ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80";

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      style={style}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <img
          src={imageUrl}
          alt={name || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => setFaved((v) => !v)}
          aria-label={faved ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            size={15}
            className={faved ? "fill-red-500 text-red-500" : "text-ink/60"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 p-3.5">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink">
          {name || "Product Name"}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-accent">{price}</span>
          <button
            type="button"
            aria-label="Add to bag"
            className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white transition-all hover:bg-accent/90 active:scale-95"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}