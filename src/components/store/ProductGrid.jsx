import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ProductCard from "../customer/ProductCard";
import StoreEmptyState from "./StoreEmptyState";
import { formatPrice } from "../../utils/currency";
import { cn } from "../../utils/cn";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const PAGE_SIZE = 8;

export default function ProductGrid({ id, items, totalCount, searchActive, viewMode = "grid", onSelectProduct }) {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, PAGE_SIZE);
  const hasMore = items.length > PAGE_SIZE;

  if (items.length === 0) {
    return (
      <section id={id} className="mt-6 scroll-mt-24 @container">
        <StoreEmptyState variant={totalCount === 0 ? "no-products" : "no-results"} />
      </section>
    );
  }

  return (
    <section id={id} className="mt-6 scroll-mt-24 @container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid gap-4",
          viewMode === "list" ? "grid-cols-1" : "grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4",
        )}
      >
        {visibleItems.map((item, i) => (
          <motion.div key={item.id || item._id || i} variants={itemVariants}>
            <ProductCard
              id={item.id || item._id}
              name={item.name}
              price={formatPrice(item.price, item.currency)}
              image={item.image}
              description={item.description}
              availableStock={item.availableStock}
              layout={viewMode}
              onSelect={onSelectProduct}
            />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && !expanded && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1 rounded-store-button border border-store-border px-4 py-2 text-sm font-medium text-store-fg transition-colors hover:bg-store-surface-hover"
          >
            View All ({items.length})
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
