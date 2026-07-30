import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Navigation,
  MapPin,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import Footer from "../components/Footer";
import Loader from "../components/customer/Loader";
import { getProdDetails } from "../services/store";

/* ───────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────── */

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

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ───────────────────────────────────────────
   Component
   ─────────────────────────────────────────── */

export default function ViewProduct() {
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // ── Fetch ──────────────────────────────────
  const fetchProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    const { success, data } = await getProdDetails(productId);
    if (success) {
      setProduct(data.product);
      setVendor(data.vendor);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ── Guard states ───────────────────────────
  if (!productId) {
    return (
      <>
        <SEO title="Product | Insanjo" description="View product details." />
        <main className="min-h-screen bg-canvas">
          <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <MapPin className="mb-4 text-faint" size={32} />
              <h1 className="font-serif text-xl font-semibold text-ink">Product Unavailable</h1>
              <p className="mt-2 text-sm text-muted">We couldn't find this product.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEO title="Product | Insanjo" description="Loading product details…" />
        <main className="min-h-screen bg-canvas">
          <Loader />
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <SEO title="Product Not Found | Insanjo" description="Product could not be found." />
        <main className="min-h-screen bg-canvas">
          <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </Link>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-24 shadow-sm">
              <h1 className="font-serif text-xl font-semibold text-ink">Product Not Found</h1>
              <p className="mt-2 text-sm text-muted">This product doesn't exist or has been removed.</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const description = product.description || "No description available.";
  const isLongDescription = description.length > 150;
  const displayDescription = expanded || !isLongDescription
    ? description
    : description.slice(0, 150) + "…";

  return (
    <>
      <SEO
        title={`${product.name} | Insanjo`}
        description={`${product.name} — ${product.description?.slice(0, 120) || "View product details on Insanjo."}`}
        url={`https://insanjo.com/product/${productId}`}
      />

      <main className="min-h-screen bg-canvas">
        {/* ── Product Image Hero ──────────────── */}
        <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden bg-surface">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/10 to-transparent" />

          {/* Back button */}
          <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-6">
            <Link
              to={`/store/${vendor?.publicId || product.storeId || ""}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <ArrowLeft size={14} />
              Back to Store
            </Link>
          </div>

          {/* Price + stock badge on image */}
          <div className="absolute bottom-6 left-5 right-5 z-10 sm:left-8 sm:right-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                  {product.name}
                </h1>
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.availableStock !== undefined && (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${
                        product.availableStock === 0
                          ? "bg-gray-500/70 text-white"
                          : product.availableStock <= 5
                          ? "bg-orange-500/70 text-white"
                          : "bg-emerald-500/70 text-white"
                      }`}
                    >
                      {product.availableStock} In Stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Details ─────────────────── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="relative mx-auto max-w-4xl px-5 sm:px-8"
        >
          {/* Description */}
          <motion.div variants={fadeUp} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-faint">
              About this item
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              {displayDescription}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp size={13} />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown size={13} />
                  </>
                )}
              </button>
            )}
          </motion.div>

          {/* Vendor card */}
          {vendor && (
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-ink">{vendor.businessName}</h3>
                  {vendor.businessAddress && (
                    <p className="mt-0.5 text-xs text-muted">{vendor.businessAddress}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-accent/90 active:scale-95"
                  >
                    <Navigation size={13} />
                    Navigate
                  </button>
                  {vendor.businessPhone && (
                    <a
                      href={`tel:${vendor.businessPhone}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-all hover:bg-accent-soft active:scale-95"
                    >
                      <Phone size={13} className="text-accent" />
                      Call
                    </a>
                  )}
                </div>
              </div>

              {/* Mini map trigger */}
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="relative h-36 overflow-hidden rounded-xl bg-canvas"
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-soft via-surface to-canvas">
                  <div className="text-center">
                    <MapPin size={22} className="mx-auto text-accent" />
                    <p className="mt-1 text-xs text-muted">View on map</p>
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* Spacer */}
          <div className="h-12" />
        </motion.section>
      </main>

      {/* ─────────────────────────────────────────────
          MAP MODAL
          ───────────────────────────────────────────── */}
      <AnimatePresence>
        {mapOpen && vendor && (
          <motion.div
            key="map-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70]"
          >
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

            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
              <div className="rounded-2xl border border-white/10 bg-surface/90 px-5 py-3 text-center backdrop-blur-xl shadow-lg">
                <p className="text-sm font-semibold text-ink">{vendor.businessName}</p>
                {vendor.businessAddress && (
                  <p className="mt-0.5 text-xs text-muted">{vendor.businessAddress}</p>
                )}
                {vendor.latitude && vendor.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    <ExternalLink size={12} />
                    Open in Google Maps
                  </a>
                )}
              </div>
            </div>

            {vendor.latitude && vendor.longitude && (
              <iframe
                title={`${vendor.businessName} location`}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${vendor.latitude},${vendor.longitude}&center=${vendor.latitude},${vendor.longitude}&zoom=15`}
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom action bar ────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/90 px-5 py-3 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs text-faint">Total</p>
            <p className="text-sm font-bold text-ink">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent/90 active:scale-95"
          >
            <ShoppingBag size={16} />
            Add to Bag
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}