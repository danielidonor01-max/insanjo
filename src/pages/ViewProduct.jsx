import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Navigation,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Store,
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
   Component
   ─────────────────────────────────────────── */

export default function ViewProduct() {
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate()

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
            <button
              onClick={() => navigate(-1)}
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>
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
            <button
              onClick={() => navigate(-1)}
              className="group mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back
            </button>
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
        {/* ── Top navigation bar ──────────────── */}
        <div className="border-b border-line bg-surface/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} />
              Back to Store
            </button>
            <span className="text-xs text-faint">Product Details</span>
          </div>
        </div>

        {/* ── Main content ────────────────────── */}
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
            {/* ── Left: Image ──────────────────── */}
            <div className="w-full shrink-0 lg:w-120">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {/* Subtle inner shadow for depth */}
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] rounded-2xl" />
              </div>
            </div>

            {/* ── Right: Details ───────────────── */}
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              {/* Title + Price + Stock */}
              <div>
                <h1 className="font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  {product.name}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-bold text-accent">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.availableStock !== undefined && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold ${product.availableStock === 0
                        ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        : product.availableStock <= 5
                          ? "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}
                    >
                      {product.availableStock} In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-line" />

              {/* Description */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-faint">
                  About this item
                </h2>
                <div className="mt-3">
                  <p className="text-sm leading-relaxed text-ink">
                    {displayDescription}
                  </p>
                  {isLongDescription && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
                    >
                      {expanded ? (
                        <>Show less <ChevronUp size={13} /></>
                      ) : (
                        <>Read more <ChevronDown size={13} /></>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-line" />

              {/* Vendor card */}
              {vendor && (
                <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft">
                        <Store size={17} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{vendor.businessName}</h3>
                        {vendor.businessAddress && (
                          <p className="mt-0.5 text-xs text-muted">{vendor.businessAddress}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMapOpen((v) => !v)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${mapOpen
                          ? "bg-ink text-canvas"
                          : "bg-accent text-white hover:bg-accent/90"
                          }`}
                      >
                        <Navigation size={13} />
                        {mapOpen ? "Hide Map" : "Navigate"}
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

                  {/* ── Inline Map ──────────────── */}
                  <AnimatePresence>
                    {mapOpen && vendor.latitude && vendor.longitude && (
                      <motion.div
                        key="inline-map"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 200 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden rounded-xl"
                      >
                        <div className="relative mt-4 h-50 w-full overflow-hidden rounded-xl border border-line">
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
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`}
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
                </div>
              )}

              {/* Bottom price bar (desktop inline) */}
              <div className="hidden items-center justify-between rounded-2xl border border-line bg-surface p-5 shadow-sm lg:flex">
                <div>
                  <p className="text-xs text-faint">Price</p>
                  <p className="text-lg font-bold text-ink">
                    {formatPrice(product.price, product.currency)}
                  </p>
                </div>
                <span className="text-sm text-muted">Contact vendor to purchase</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Bottom price bar (mobile only) ───── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-surface/90 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-faint">Price</p>
            <p className="text-sm font-bold text-ink">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
          <span className="text-xs text-muted">Contact vendor to purchase</span>
        </div>
      </div>

      <Footer />
    </>
  );
}