import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import SEO from "../components/SEO";
import Footer from "../components/Footer";
import Loader from "../components/customer/Loader";
import StoreLayout from "../components/store/StoreLayout";
import StoreHeader from "../components/store/StoreHeader";
import StoreLocation from "../components/store/StoreLocation";
import CatalogToolbar from "../components/store/CatalogToolbar";
import ProductGrid from "../components/store/ProductGrid";
import ProductQuickView from "../components/store/ProductQuickView";
import { getStoreDetails } from "../services/store";

const PRODUCTS_SECTION_ID = "store-products";

export default function PublicStore() {
  const { storeId } = useParams();

  const [details, setDetails] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchStore = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { success, data } = await getStoreDetails(storeId);
    if (success) {
      setDetails(data.business);
      setInventory(data.inventory || []);
    }
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const hasPrices = useMemo(
    () => inventory.some((item) => typeof item.price === "number" && item.price > 0),
    [inventory],
  );

  const filteredSortedInventory = useMemo(() => {
    let list = inventory;

    if (searchValue.trim()) {
      const q = searchValue.trim().toLowerCase();
      list = list.filter((item) => item?.name?.toLowerCase().includes(q));
    }

    if (sortValue !== "default") {
      list = [...list].sort((a, b) => {
        if (sortValue === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
        if (sortValue === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
        if (sortValue === "name-asc") return (a.name || "").localeCompare(b.name || "");
        return 0;
      });
    }

    return list;
  }, [inventory, searchValue, sortValue]);

  const selectedProduct = useMemo(
    () => inventory.find((item) => (item.id || item._id) === selectedProductId) || null,
    [inventory, selectedProductId],
  );

  // ── Guard: no id ───────────────────────────
  if (!storeId) {
    return (
      <>
        <SEO title="Store | Insanjo" description="Browse products from Insanjo vendors." />
        <StoreLayout>
          <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
            <div className="flex flex-col items-center justify-center rounded-store-section border border-dashed border-store-border bg-store-surface py-24">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-store-bg">
                <MapPin className="text-store-muted" size={28} />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-store-fg">Store Unavailable</h1>
              <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-store-muted-fg">
                We couldn't find this store at the moment. Please try again later.
              </p>
            </div>
          </main>
          <Footer />
        </StoreLayout>
      </>
    );
  }

  // ── Loading ────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO title="Store | Insanjo" description="Loading store details…" />
        <StoreLayout>
          <main>
            <Loader />
          </main>
          <Footer />
        </StoreLayout>
      </>
    );
  }

  // ── Not found ──────────────────────────────
  if (!details) {
    return (
      <>
        <SEO title="Store Not Found | Insanjo" description="The requested store could not be found." />
        <StoreLayout>
          <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
            <div className="flex flex-col items-center justify-center rounded-store-section border border-dashed border-store-border bg-store-surface py-24">
              <h1 className="font-serif text-2xl font-semibold text-store-fg">Store Not Found</h1>
              <p className="mt-2 text-sm text-store-muted-fg">This store doesn't exist or has been removed.</p>
            </div>
          </main>
          <Footer />
        </StoreLayout>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${details.businessName} | Insanjo`}
        description={`Browse products from ${details.businessName} on Insanjo.`}
        url={`https://insanjo.com/store/${storeId}`}
      />

      <StoreLayout searchValue={searchValue} onSearchChange={setSearchValue}>
        <main className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
          <StoreHeader details={details} />

          <StoreLocation
            businessName={details.businessName}
            address={details.businessAddress}
            phone={details.businessPhone}
            latitude={details.latitude}
            longitude={details.longitude}
          />

          <CatalogToolbar
            totalCount={inventory.length}
            matchingCount={filteredSortedInventory.length}
            searchActive={Boolean(searchValue.trim())}
            sortValue={sortValue}
            onSortChange={setSortValue}
            hasPrices={hasPrices}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={null}
          />

          <ProductGrid
            id={PRODUCTS_SECTION_ID}
            items={filteredSortedInventory}
            totalCount={inventory.length}
            searchActive={Boolean(searchValue.trim())}
            viewMode={viewMode}
            onSelectProduct={setSelectedProductId}
          />
        </main>

        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "var(--pattern-royal)", opacity: "calc(var(--pattern-glow-opacity) * 0.4)" }}
          />
          <Footer />
        </div>
      </StoreLayout>

      <ProductQuickView
        product={selectedProduct}
        storeId={storeId}
        vendorName={details.businessName}
        vendorPhone={details.businessPhone}
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => !open && setSelectedProductId(null)}
      />
    </>
  );
}
