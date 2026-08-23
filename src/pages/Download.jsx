import { useCallback, useEffect, useState } from "react";
import { Check, Smartphone } from "lucide-react";
import SEO from "../components/SEO";
import Logo from "../components/Logo";
import { trackEvent } from "../utils/analytics";

/*
 * Destination deep-link helpers (mirror the reset-password pages).
 * The custom scheme "tops://" is how the installed app is launched.
 */
const APP_CUSTOM_SCHEME = "tops://";
const APP_PACKAGE_NAME = "com.lechi.insanjo";

const getDeepLink = () => {
  if (/android/i.test(navigator.userAgent)) {
    return `intent://#Intent;scheme=tops;package=${APP_PACKAGE_NAME};end`;
  }
  return APP_CUSTOM_SCHEME;
};

const FEATURES = [
  "Discover and unlock stores near you",
  "Track orders and pay securely",
  "Real-time stock & exclusive deals",
];

/* Small inline store badges (self-contained, no external deps) */
const GooglePlayBadge = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-6 w-6"
    fill="none"
  >
    <path
      d="M3.5 2.1C3.2 2.5 3 3.1 3 3.8v16.4c0 .7.2 1.3.5 1.7L13.1 12 3.5 2.1Z"
      fill="#00D7FF"
    />
    <path
      d="m16.3 15.2-3.2-3.2L3.5 21.9c.4.4 1 .4 1.6.1l11.2-6.8Z"
      fill="#00F076"
    />
    <path
      d="m20.2 10.1-3.9-2.4-3.2 3.3 3.2 3.2 3.9-2.4c1.1-.7 1.1-1.7 0-2.4Z"
      fill="#FFD600"
    />
    <path
      d="M16.3 7.7 5.1.9C4.5.5 3.9.6 3.5 1l9.6 9.9 3.2-3.2Z"
      fill="#FF3D81"
    />
  </svg>
);

const AppStoreBadge = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
    <path fill="#fff" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export default function Download() {
  const [openAttempted, setOpenAttempted] = useState(false);

  const handleStore = useCallback((store) => {
    trackEvent("app_download_click", { source: "download_page", store });
  }, []);

  const handleOpenApp = useCallback(() => {
    setOpenAttempted(true);
    trackEvent("app_open_app", { source: "download_page" });
    window.location.href = getDeepLink();
  }, []);

  useEffect(() => {
    if (!openAttempted) return;
    const t = setTimeout(() => setOpenAttempted(false), 4000);
    return () => clearTimeout(t);
  }, [openAttempted]);
return (
    <>
      <SEO
        title="Download the Insanjo App | Insanjo"
        description="Download the Insanjo app to discover stores, track orders, and unlock exclusive deals. Available now on the App Store and Google Play."
        url="https://insanjo.com/download"
      />

      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas px-5 py-16 sm:px-8">
        {/* Soft backdrop glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[15%] h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-[10%] h-80 w-80 rounded-full bg-cyan/10 blur-3xl"
        />

        <div className="relative w-full max-w-lg text-center">
          <div className="mb-8 flex justify-center">
            <Logo height={32} />
          </div>

          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-brand-gradient text-white shadow-[0_16px_40px_-12px_rgba(6,111,242,0.8)]">
            <Smartphone size={36} strokeWidth={1.7} />
          </div>

          <h1 className="font-serif text-[clamp(2rem,6vw,3rem)] font-medium leading-[1.08] tracking-tight text-ink">
            Get the Insanjo app
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            Unlock stores near you, track orders, pay securely and discover
            exclusive deals — all on the Insanjo app.
          </p>

          <ul className="mx-auto mt-8 max-w-sm space-y-2.5 text-left">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check size={13} strokeWidth={2.5} />
                </span>
                <span className="text-muted">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.lechi.insanjo"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleStore("google_play")}
              className="group flex items-center gap-3 rounded-2xl bg-accent px-5 py-3.5 text-left transition-colors duration-300 hover:bg-accent"
            >
              <GooglePlayBadge />
              <span className="leading-tight">
                <span className="block text-[11px] text-white/60">GET IT ON</span>
                <span className="block text-sm font-semibold text-canvas">
                  Google Play
                </span>
              </span>
            </a>

            <a
              href="https://apps.apple.com/app/insanjo"
              target="_blank"
              rel="noreferrer"
              onClick={() => handleStore("app_store")}
              className="group flex items-center gap-3 rounded-2xl bg-accent-ink px-5 py-3.5 text-left transition-colors duration-300 hover:bg-accent"
            >
              <AppStoreBadge />
              <span className="leading-tight">
                <span className="block text-[11px] text-white/60">Download on the</span>
                <span className="block text-sm font-semibold text-canvas">
                  App Store
                </span>
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={handleOpenApp}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <Smartphone size={15} />
            {openAttempted ? "Opening Insanjo…" : "Already have it? Open the app"}
          </button>

          <p className="mt-8 text-xs text-faint">
            Free to download · Available for iOS and Android
          </p>
        </div>
      </div>
    </>
  );
}