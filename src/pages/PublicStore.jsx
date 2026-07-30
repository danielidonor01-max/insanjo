import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Phone,
  Navigation,
  Clock,
  MapPin,
  Search,
  X,
  ChevronRight,
  Star,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/customer/Loader";
import ProductCard from "../components/customer/ProductCard";
import { getStoreDetails, markFavorite, deleteFavorite } from "../services/store";

/* ───────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────── */

const formatTime = (time) => {
  if (!time) return "";
  const [hourStr, minuteStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const getCurrencySymbol = (currency) => {
  const map = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    GHS: "₵",
    KES: "KSh",
    ZAR: "R",
    XOF: "CFA",
    XAF: "FCFA",
  };
  return map[currency] || currency || "₦";
};

const formatPrice = (price, currency = "NGN") => {
  const num = Number(price ?? 0);
  return `${getCurrencySymbol(currency)} ${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/* ───────────────────────────────────────────
   Animation variants
   ─────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalPanel = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", damping: 28, stiffness: 260 } },
  exit: { x: "100%", transition: { duration: 0.25, ease: "easeIn" } },
};

/* ───────────────────────────────────────────
   Component
   ─────────────────────────────────────────── */

export default function PublicStore() {
  const { storeId } = useParams();

  // ── State ──────────────────────────────────
  const [details, setDetails] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [seeAllOpen, setSeeAllOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // ── Derived ────────────────────────────────
  const coverImages = useMemo(() => {
    if (!details) return [];
    return [details.coverImage1, details.coverImage2].filter(Boolean);
  }, [details]);

  const filteredInventory = useMemo(() => {
    if (!searchValue.trim()) return inventory;
    const q = searchValue.trim().toLowerCase();
    return inventory.filter((item) => item?.name?.toLowerCase().includes(q));
  }, [searchValue, inventory]);

  // ── Fetch ──────────────────────────────────
  const fetchStore = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    const { success, data } = await getStoreDetails(storeId);
    if (success) {
      setDetails(data.business);
      setInventory(data.inventory || []);
      setFavorite(data.business?.isFavorited ?? false);
    }
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  // ── Favorite toggle ────────────────────────
  const handleFavorite = async () => {
    if (!details || !storeId || favLoading) return;
    setFavLoading(true);
    if (!favorite) {
      const { success } = await markFavorite(storeId, "store");
      if (success) setFavorite(true);
    } else {
      const { success } = await deleteFavorite(storeId, "store");
      if (success) setFavorite(false);
    }
    setFavLoading(false);
  };

  // ── Image rotation ─────────────────────────
  useEffect(() => {
    if (coverImages.length < 2) return;
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % coverImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [coverImages.length]);

  // ── Guard: no id ───────────────────────────
  if (!storeId) {
    return (
      <>
        <SEO title="Store | Insanjo" description="Browse products from Insanjo vendors." />
        <Navbar />
        <main className="min-h-screen bg-canvas pt-24">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to home
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                <MapPin className="text-accent" size={28} />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-ink">Store Unavailable</h1>
              <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted">
                We couldn't find this store at the moment. Please try again later.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Loading ────────────────────────────────
  if (loading) {
    return (
      <>
        <SEO title="Store | Insanjo" description="Loading store details…" />
        <Navbar />
        <main className="min-h-screen bg-canvas pt-24">
          <Loader />
        </main>
        <Footer />
      </>
    );
  }

  // ── Not found ──────────────────────────────
  if (!details) {
    return (
      <>
        <SEO title="Store Not Found | Insanjo" description="The requested store could not be found." />
        <Navbar />
        <main className="min-h-screen bg-canvas pt-24">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to home
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <h1 className="font-serif text-2xl font-semibold text-ink">Store Not Found</h1>
              <p className="mt-2 text-sm text-muted">This store doesn't exist or has been removed.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const displayInventory = inventory.slice(0, 4);

  return (
    <>
      <SEO
        title={`${details.businessName} | Insanjo`}
        description={`Browse products from ${details.businessName} on Insanjo.`}
        url={`https://insanjo.com/store/${storeId}`}
      />

      <Navbar />

      <main className="min-h-screen bg-canvas pt-20">
        {/* ── Hero / Cover ─────────────────────────── */}
        <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-surface">
          {/* Cover image slideshow */}
          {coverImages.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={coverImages[imageIndex]}
                alt=""
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent-soft via-surface to-canvas" />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/30 to-transparent" />

          {/* Dots indicator */}
          {coverImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {coverImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === imageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Back button */}
          <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>
        </section>

        {/* ── Store info card ─────────────────────── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto -mt-16 max-w-6xl px-5 sm:px-8"
        >
          {/* Profile image + name row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6"
          >
            {/* Avatar */}
            <div className="relative -mt-4 h-24 w-24 overflow-hidden rounded-2xl border-[3px] border-surface shadow-xl sm:h-28 sm:w-28">
              {details.businessProfileImage ? (
                <img
                  src={details.businessProfileImage}
                  alt={details.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent-soft text-2xl font-bold text-accent">
                  {details.businessName?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-2.5">
                <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
                  {details.businessName}
                </h1>
                <button
                  type="button"
                  onClick={handleFavorite}
                  disabled={favLoading}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface transition-all hover:bg-accent-soft active:scale-90"
                >
                  {favLoading ? (
                    <Loader2 size={15} className="animate-spin text-red-400" />
                  ) : (
                    <Heart
                      size={16}
                      className={favorite ? "fill-red-500 text-red-500" : "text-muted"}
                    />
                  )}
                </button>
              </div>

              {/* Status + hours */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    details.isOpenNow
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      details.isOpenNow ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {details.isOpenNow ? "Open Now" : "Closed"}
                </span>
                <span className="text-muted">
                  {details.isOpenNow
                    ? `Closes ${formatTime(details.closingTime)}`
                    : `Opens ${formatTime(details.openingTime)}`}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Address card */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft">
                <MapPin size={17} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{details.businessAddress}</p>
                <p className="mt-0.5 text-xs text-faint">{details.businessName}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${details.latitude},${details.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/90 active:scale-95"
              >
                <Navigation size={15} />
                Navigate
              </a>
              {details.businessPhone && (
                <a
                  href={`tel:${details.businessPhone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-accent-soft active:scale-95"
                >
                  <Phone size={15} className="text-accent" />
                  Call
                </a>
              )}
            </div>
          </motion.div>

          {/* ── In Stock header ──────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-between"
          >
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">In Stock</h2>
              <p className="mt-0.5 text-sm text-muted">
                {inventory.length} product{inventory.length !== 1 ? "s" : ""} available
              </p>
            </div>
            {inventory.length > 4 && (
              <button
                type="button"
                onClick={() => setSeeAllOpen(true)}
                className="inline-flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent-soft"
              >
                See All
                <ChevronRight size={15} />
              </button>
            )}
          </motion.div>

          {/* ── Product grid ─────────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {displayInventory.length > 0 ? (
              displayInventory.map((item, i) => (
                <ProductCard
                  key={item.id || item._id || i}
                  name={item.name}
                  price={formatPrice(item.price, item.currency)}
                  images={item.images}
                  isFavorited={item.isFavorited}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-16 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent-soft">
                  <Search size={20} className="text-accent" />
                </div>
                <p className="text-sm font-medium text-muted">No products yet</p>
                <p className="mt-1 text-xs text-faint">This vendor hasn't added any products.</p>
              </div>
            )}
          </motion.div>

          {/* Spacer for footer */}
          <div className="h-12" />
        </motion.section>
      </main>

      {/* ─────────────────────────────────────────────
          SEE ALL MODAL (slide-in from right)
          ───────────────────────────────────────────── */}
      <AnimatePresence>
        {seeAllOpen && (
          <motion.div
            key="see-all-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setSeeAllOpen(false)}
          >
            <motion.div
              key="see-all-panel"
              variants={modalPanel}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto border-l border-line bg-canvas shadow-2xl"
            >
              {/* Search header */}
              <div className="sticky top-0 z-10 border-b border-line bg-canvas/90 backdrop-blur-xl">
                <div className="flex items-center gap-3 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setSeeAllOpen(false)}
                    aria-label="Close"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line transition-colors hover:bg-accent-soft"
                  >
                    <X size={16} />
                  </button>
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
                    />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search products…"
                      className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent"
                    />
                    {searchValue && (
                      <button
                        type="button"
                        onClick={() => setSearchValue("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Product list */}
              <div className="px-5 py-4">
                {filteredInventory.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredInventory.map((item, i) => (
                      <ProductCard
                        key={item.id || item._id || i}
                        name={item.name}
                        price={formatPrice(item.price, item.currency)}
                        images={item.images}
                        isFavorited={item.isFavorited}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-20 text-center">
                    <Search size={24} className="text-faint" />
                    <p className="mt-3 text-sm text-muted">
                      {searchValue
                        ? `No products match "${searchValue}"`
                        : "No products available"}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────
          MAP MODAL (full-screen overlay)
          ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mapOpen && (
          <motion.div
            key="map-backdrop"
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[70] bg-black"
          >
            {/* Close button */}
            <div className="absolute left-4 top-4 z-20">
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            </div>

            {/* Store name overlay */}
            <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
              <div className="rounded-2xl border border-white/10 bg-surface/90 px-5 py-3 text-center backdrop-blur-xl">
                <p className="text-sm font-semibold text-ink">{details.businessName}</p>
                <p className="mt-0.5 text-xs text-muted">{details.businessAddress}</p>
              </div>
            </div>

            {/* Map placeholder — opens Google Maps in new tab */}
            <div className="relative flex h-full w-full items-center justify-center bg-[#0a1424]">
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-accent-soft">
                  <MapPin size={28} className="text-accent" />
                </div>
                <p className="text-lg font-semibold text-white">{details.businessName}</p>
                <p className="mt-1 text-sm text-white/60">{details.businessAddress}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${details.latitude},${details.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90"
                >
                  <ExternalLink size={16} />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}