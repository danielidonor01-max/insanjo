import SortMenu from "./SortMenu";
import ViewToggle from "./ViewToggle";
import StoreCategoryTabs from "./StoreCategoryTabs";

export default function CatalogToolbar({
  totalCount,
  matchingCount,
  searchActive,
  sortValue,
  onSortChange,
  hasPrices,
  viewMode,
  onViewModeChange,
  categories,
  categoryValue,
  onCategoryChange,
}) {
  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-store-fg">All Products</h2>
          <p className="mt-1 text-sm text-store-muted-fg">Browse everything available from this store.</p>
        </div>
        <div className="flex items-center gap-2">
          <SortMenu value={sortValue} onChange={onSortChange} hasPrices={hasPrices} />
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-store-muted">
          {totalCount} product{totalCount !== 1 ? "s" : ""}
          {searchActive && matchingCount !== totalCount ? ` · ${matchingCount} matching` : ""}
        </p>
        <StoreCategoryTabs categories={categories} value={categoryValue} onChange={onCategoryChange} />
      </div>
    </div>
  );
}
