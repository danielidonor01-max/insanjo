import { Search, PackageOpen } from "lucide-react";

const VARIANTS = {
  "no-products": {
    icon: PackageOpen,
    title: "No products yet",
    description: "This store hasn't added products to its catalog.",
  },
  "no-results": {
    icon: Search,
    title: "No products found",
    description: "Try a different search or category.",
  },
};

export default function StoreEmptyState({ variant = "no-products" }) {
  const { icon: Icon, title, description } = VARIANTS[variant] || VARIANTS["no-products"];

  return (
    <div className="col-span-full flex flex-col items-center py-20 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-store-bg">
        <Icon size={20} className="text-store-muted" />
      </div>
      <p className="text-sm font-medium text-store-fg">{title}</p>
      <p className="mt-1 text-xs text-store-muted">{description}</p>
    </div>
  );
}
