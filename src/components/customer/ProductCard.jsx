import { Link } from "react-router-dom";

export default function ProductCard({
  id,
  name,
  price,
  description,
  image,
  images,
  availableStock,
  style = {},
  className = "",
}) {
  const productId = id;
  const imageUrl =
    image ||
    images?.[0] ||
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80";

  const formatDescription = (text) => {
    if (!text || text.trim().length === 0) return "Description unavailable";
    const trimmed = text.trim();
    return trimmed.length > 25
      ? trimmed.slice(0, trimmed.lastIndexOf(" ", 25)) + "…"
      : trimmed;
  };

  const getStockColor = () => {
    if (!availableStock && availableStock !== 0) return null;
    if (availableStock === 0) return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    if (availableStock === 1) return "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400";
    if (availableStock <= 5) return "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
  };

  const stockColor = getStockColor();

  return (
    <Link
      to={`/product/${productId}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.97] ${className}`}
      style={style}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas">
        <img
          src={imageUrl}
          alt={name || "Product"}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient fade overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Stock badge */}
        {stockColor && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-tight ${stockColor}`}
          >
            {availableStock} In Stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1 px-4 py-3">
        <h3 className="truncate text-sm font-semibold text-ink">
          {name || "Product Name"}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted">
          {formatDescription(description)}
        </p>

        <div className="mt-1.5">
          <span className="text-sm font-bold text-ink">{price}</span>
        </div>
      </div>
    </Link>
  );
}
