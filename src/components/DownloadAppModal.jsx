import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Smartphone, X, ArrowRight } from "lucide-react";
import { APP_STORE_URL } from "./DownloadAppPrompt";
import { trackEvent } from "../utils/analytics";

/**
 * High-intent "Get the Insanjo app" gate shown when a user taps
 * "View Shop" or "Directions" on the store details card.
 *
 * There is intentionally no "Continue on web" fallback — the only way
 * forward is to download the app and unlock the full experience.
 *
 * Props
 *  - action      'shop' | 'directions' | null  — which button invoked it; null hides the modal.
 *  - storeName   Name of the selected store (for personalised copy).
 *  - onClose     Close / dismiss the modal.
 */
export default function DownloadAppModal({ action, storeName, onClose }) {
  const isShop = action === "shop";

  const features = [
    "Unlock view shop, directions & product browsing",
    "Predictive analysis & stock management",
    "Setup you online Store, become Visible by Potential Customers",
  ];

  /* Analytics + body scroll lock while open */
  useEffect(() => {
    if (!action) return;
    trackEvent("app_prompt_show", { source: "find_stores", action, variant: "modal" });
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [action]);

  const handleDownload = () => {
    trackEvent("app_download_click", { source: "find_stores", variant: "modal", action });
  };

  return (
    <AnimatePresence>
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-app-title"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/50 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-2xl"
          >
            {/* Soft brand glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 z-99  top-4 flex justify-center h-9 w-9 items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
            >
              <X size={17} />
            </button>

            <div className="relative">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_28px_-10px_rgba(6,111,242,0.85)]">
                <Smartphone size={26} strokeWidth={1.8} />
              </div>

              <h2
                id="download-app-title"
                className="mt-5 font-serif text-2xl font-medium leading-tight tracking-tight text-ink"
              >
                Get the Insanjo app
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {isShop
                  ? `Download the app to view ${storeName || "this shop"}, browse its full product listings in your currency.`
                  : `Download the app to get turn-by-turn directions to ${storeName || "this store"} and much more.`}
              </p>

              <ul className="mt-4 space-y-2">
                {features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-sm text-ink"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                      <path
                        d="m8 12.5 2.5 2.5L16 9.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={handleDownload}
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-ink"
              >
                Download the app
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <p className="mt-4 text-center text-xs text-faint">
                Download to unlock all of Insanjo{`'`}s best features
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}