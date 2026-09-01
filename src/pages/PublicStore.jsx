import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Navigation,
  MapPin,
  Search,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import Footer from "../components/Footer";
import Loader from "../components/customer/Loader";
import ProductCard from "../components/customer/ProductCard";
import { getStoreDetails } from "../services/store";
import { formatPrice } from "../utils/currency";

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalPanel = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 28, stiffness: 260 },
  },
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
    }
    setLoading(false);
  }, [storeId]);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

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
        <SEO
          title="Store | Insanjo"
          description="Browse products from Insanjo vendors."
        />
        <main className="min-h-screen bg-canvas">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to home
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
                <MapPin className="text-accent" size={28} />
              </div>
              <h1 className="font-serif text-2xl font-semibold text-ink">
                Store Unavailable
              </h1>
              <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-muted">
                We couldn't find this store at the moment. Please try again
                later.
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
        <SEO
          title="Store | Insanjo"
          description="Loading store details…"
        />
        <main className="min-h-screen bg-canvas">
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
        <SEO
          title="Store Not Found | Insanjo"
          description="The requested store could not be found."
        />
        <main className="min-h-screen bg-canvas">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to home
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <h1 className="font-serif text-2xl font-semibold text-ink">
                Store Not Found
              </h1>
              <p className="mt-2 text-sm text-muted">
                This store doesn't exist or has been removed.
              </p>
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

      <main className="min-h-screen bg-canvas">
        {/* ── Cover Banner ─────────────────────────── */}
        <section className="relative h-[45vh] min-h-[340px] w-full overflow-hidden bg-surface">
          {/* Cover image slideshow */}
          {coverImages.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={coverImages[imageIndex]}
                alt={`${details.businessName} cover`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/20 to-transparent" />

          {/* Dots indicator */}
          {coverImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {coverImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`View cover image ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === imageIndex
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/70"
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

          {/* Store name overlay on banner */}
          <div className="absolute bottom-8 left-5 right-5 z-10 sm:left-8 sm:right-8">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="hidden h-20 w-20 overflow-hidden rounded-2xl border-[3px] border-white/30 shadow sm:block sm:h-24 sm:w-24">
                {details.businessProfileImage ? (
                  <img
                    src={details.businessProfileImage}
                    alt={details.businessName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/20 text-2xl font-bold text-white backdrop-blur-sm">
                    {details.businessName?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-bold  drop-shadow-lg sm:text-3xl">
                  {details.businessName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold backdrop-blur-md ${
                      details.isOpenNow
                        ? "bg-emerald-500/80 text-white"
                        : "bg-red-500/80 text-white"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        details.isOpenNow ? "bg-white" : "bg-white"
                      }`}
                    />
                    {details.isOpenNow ? "Open Now" : "Closed"}
                  </span>
                  <span className="text-xs opacity-80 drop-shadow-lg">
                    {details.isOpenNow
                      ? `Closes ${formatTime(details.closingTime)}`
                      : `Opens ${formatTime(details.openingTime)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Store info section ──────────────────── */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-6xl px-5 sm:px-8"
        >
          {/* Mobile avatar (visible only on small screens) */}
          <motion.div
            variants={itemVariants}
            className="-mt-6 mb-4 flex sm:hidden"
          >
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-[3px] border-surface shadow">
              {details.businessProfileImage ? (
                <img
                  src={details.businessProfileImage}
                  alt={details.businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent-soft text-xl font-bold text-accent">
                  {details.businessName?.charAt(0)?.toUpperCase() || "S"}
                </div>
              )}
            </div>
          </motion.div>

          {/* Address card */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft">
                <MapPin size={17} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">
                  {details.businessAddress}
                </p>
                <p className="mt-0.5 text-xs text-faint">
                  {details.businessName}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMapOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
                  mapOpen
                    ? "bg-ink text-canvas"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                <Navigation size={15} />
                {mapOpen ? "Hide Map" : "Navigate"}
              </button>
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

          {/* ── Inline Map ──────────────────────────── */}
          <AnimatePresence>
            {mapOpen && (
              <motion.div
                key="inline-map"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 220 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-2xl"
              >
                <div className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-line">
                  <iframe
                    title={`${details.businessName} location`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${details.latitude},${details.longitude}&center=${details.latitude},${details.longitude}&zoom=15`}
                    className="absolute inset-0 h-full w-full border-0"
                  />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${details.latitude},${details.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-sm shadow-sm transition-colors hover:bg-surface"
                  >
                    <ExternalLink size={12} className="inline -mt-0.5 mr-1" />
                    Open in Google Maps
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── In Stock header ──────────────────── */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-between"
          >
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                In Stock
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                {inventory.length} product
                {inventory.length !== 1 ? "s" : ""} available
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
                  id={item.id || item._id}
                  name={item.name}
                  price={formatPrice(item.price, item.currency)}
                  image={item.image}
                  description={item.description}
                  availableStock={item.availableStock}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-16 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent-soft">
                  <Search size={20} className="text-accent" />
                </div>
                <p className="text-sm font-medium text-muted">
                  No products yet
                </p>
                <p className="mt-1 text-xs text-faint">
                  This vendor hasn't added any products.
                </p>
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
                        id={item.id || item._id}
                        name={item.name}
                        price={formatPrice(item.price, item.currency)}
                        image={item.image}
                        description={item.description}
                        availableStock={item.availableStock}
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

      <Footer />
    </>
  );
}