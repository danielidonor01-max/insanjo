import { ArrowRight, Smartphone, X } from "lucide-react";
import { trackEvent } from "../utils/analytics";

/* Official Insanjo app download destination (must keep in sync) */
export const APP_STORE_URL = "https://insanjo.com/download";

/**
 * Professional "Get the Insanjo app" prompt.
 *
 * Variants:
 *  - "sidebar"  → vertical card designed to sit inside a side panel (desktop).
 *  - "compact"  → single-line CTA pill.
 *  - "banner"   → slim horizontal strip for overlays (mobile), dismissible.
 */
export default function DownloadAppPrompt({ variant = "sidebar", onDismiss }) {
  const handleClick = () => {
    trackEvent("app_download_click", { source: "find_stores", variant });
  };

  /* ── Banner variant (mobile overlay) ─────────────────── */
  if (variant === "banner") {
    return (
      <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-line bg-surface/95 p-2.5 pr-2 shadow-xl backdrop-blur">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <Smartphone size={17} strokeWidth={1.9} />
        </div>
        <p className="flex-1 text-xs leading-snug text-ink">
          Get the{" "}
          <span className="font-semibold">Insanjo app</span> for maps, directions
          &amp; deals on the go.
        </p>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
          className="inline-flex shrink-0 items-center rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent-ink"
        >
          Download
        </a>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss app reminder"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }

  /* ── Compact variant (single CTA pill) ────────────────── */
  if (variant === "compact") {
    return (
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas transition-colors hover:bg-accent"
      >
        <Smartphone size={15} />
        Download Insanjo
      </a>
    );
  }

  /* ── Sidebar variant (default) ────────────────────────── */
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
      />

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white shadow-[0_10px_24px_-10px_rgba(6,111,242,0.7)]">
            <Smartphone size={20} strokeWidth={1.9} />
          </div>
          <h3 className="font-serif text-lg font-medium leading-tight text-ink">
            Get the Insanjo app
          </h3>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Discover stores faster with smoother navigation, opening hours and
          exclusive deals — right on your phone.
        </p>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={handleClick}
          className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-ink"
        >
          Download the app
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>
      </div>
    </div>
  );
}