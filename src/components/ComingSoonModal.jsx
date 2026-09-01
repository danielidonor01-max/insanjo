import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, X } from "lucide-react";

const STORE_LABEL = {
  app_store: "the App Store",
  google_play: "Google Play",
};

/**
 * Lightweight "coming soon" notice shown when a visitor taps the App Store
 * or Google Play button on the Download page. The app isn't live yet, so
 * this intentionally never links out — it just explains what's coming.
 *
 * Props
 *  - store    'app_store' | 'google_play' | null — which button was tapped; null hides the modal.
 *  - onClose  Close / dismiss the modal.
 */
export default function ComingSoonModal({ store, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!store) return;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [store, onClose]);

  const storeLabel = STORE_LABEL[store] || "the App Store and Google Play";

  return (
    <AnimatePresence>
      {store && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          aria-describedby="coming-soon-description"
        >
          {/* Backdrop — a deep, blurred scrim rather than a plain dimmer */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#040a13]/80 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0d1b2a] p-6 text-center shadow-2xl"
          >
            {/* Soft brand glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/25 blur-3xl"
            />

            <button
              type="button"
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>

            <div className="relative">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_12px_28px_-10px_rgba(6,111,242,0.85)]">
                <Rocket size={24} strokeWidth={1.8} />
              </div>

              <h2
                id="coming-soon-title"
                className="mt-5 font-serif text-2xl font-medium leading-tight tracking-tight text-white"
              >
                The Insanjo app is coming soon
              </h2>

              <p
                id="coming-soon-description"
                className="mt-2.5 text-sm leading-relaxed text-white/60"
              >
                We're putting the finishing touches on the Insanjo app. It'll
                be available soon on {storeLabel} — thanks for your
                patience.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-ink"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
