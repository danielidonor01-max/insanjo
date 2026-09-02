import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Package, Sparkles, Tag } from "lucide-react";
import SEO from "../components/SEO";
import { InsanjoMark } from "../components/Logo";
import ComingSoonModal from "../components/ComingSoonModal";
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
  { icon: MapPin, text: "Discover and unlock stores near you" },
  { icon: Package, text: "Track orders and pay securely" },
  { icon: Tag, text: "Real-time stock & exclusive deals" },
];

/* Small inline store badges (self-contained, no external deps) */
const GooglePlayBadge = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
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
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="#fff"
      d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
    />
  </svg>
);

/*
 * Realistic-ish smartphone product render, built from layered CSS
 * (metallic frame gradient, inset bezel, glass reflection streak, side
 * buttons, layered shadow) since no phone mockup asset exists in the
 * project. Wrapped in an atmospheric glow + concentric-ring halo, with
 * the "Available soon on" panel tucked under its bottom edge.
 */
function PhoneShowcase({ onStoreClick }) {
  return (
    <div className="relative mx-auto w-full max-w-[21rem]">
      {/* Atmosphere: glow + concentric rings, centered behind the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="animate-breathe h-72 w-72 rounded-full bg-accent/50 blur-[85px]" />
        <div className="absolute h-40 w-40 rounded-full bg-cyan/45 blur-[55px]" />
        <div className="absolute h-108 w-108 rounded-full border border-accent/10" />
        <div className="absolute h-92 w-92 rounded-full border border-cyan/15" />
        <div className="absolute h-72 w-72 rounded-full border border-accent/20" />
        <div className="absolute h-56 w-56 rounded-full border border-cyan/25" />
        <div className="absolute h-40 w-40 rounded-full border border-accent/20" />
      </div>

      {/* Phone */}
      <div className="animate-float-slow relative z-10 mx-auto flex justify-center">
        <div
          className="relative h-90 w-44 rounded-[2.5rem] p-[3px] sm:h-96 sm:w-47"
          style={{
            background:
              "linear-gradient(155deg, #565b64 0%, #26292f 16%, #0c0d10 42%, #16181c 68%, #3d414a 100%)",
            boxShadow:
              "0 2px 2px rgba(0,0,0,0.55), 0 40px 70px -20px rgba(2,6,16,0.85), 0 0 26px 0px rgba(5,241,219,0.4), 0 0 60px 4px rgba(6,111,242,0.5), 0 0 110px 14px rgba(6,111,242,0.3)",
          }}
        >
          {/* Side controls — read as machined metal buttons on the frame edge */}
          <span className="absolute -left-[2px] top-20 h-6 w-[3px] rounded-l-sm bg-gradient-to-b from-white/40 via-white/10 to-white/0" />
          <span className="absolute -left-[2px] top-30 h-10 w-[3px] rounded-l-sm bg-gradient-to-b from-white/40 via-white/10 to-white/0" />
          <span className="absolute -right-[2px] top-28 h-14 w-[3px] rounded-r-sm bg-gradient-to-b from-white/40 via-white/10 to-white/0" />

          {/* Inner bezel */}
          <div className="h-full w-full rounded-[2.3rem] bg-[#050608] p-[9px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
            {/* Screen */}
            <div
              className="relative h-full w-full overflow-hidden rounded-[1.85rem]"
              style={{
                background:
                  "radial-gradient(120% 90% at 30% 0%, #14213c 0%, #08101f 55%, #020407 100%)",
              }}
            >
              {/* Dynamic island */}
              <div className="absolute left-1/2 top-2.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

              {/* Glass reflection streak */}
              <div className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 -rotate-12 bg-gradient-to-r from-white/[0.09] via-white/0 to-transparent" />

              {/* Splash content */}
              <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 pb-12 text-center">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute h-24 w-24 rounded-full bg-accent/40 blur-2xl"
                />
                <InsanjoMark size={40} className="relative drop-shadow-[0_4px_18px_rgba(6,111,242,0.6)]" />
                <p className="relative font-serif text-base font-medium text-white">Insanjo</p>
                <p className="relative text-[11px] leading-relaxed text-white/45">
                  The all-in-one shopping experience,
                  <br />
                  <span className="text-cyan">coming soon.</span>
                </p>
              </div>

              {/* Home indicator */}
              <div className="absolute bottom-2.5 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </div>

      {/* Store panel — tucks under the phone's bottom edge only */}
      <div className="relative z-20 -mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b2a]/95 p-4 shadow-[0_25px_60px_-18px_rgba(2,8,20,0.95)] backdrop-blur-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-28 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/25 blur-[50px]"
        />
        <p className="relative text-center text-[10px] font-semibold uppercase tracking-wider text-white/40">
          Available soon on
        </p>
        <div className="relative mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onStoreClick("google_play")}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:border-white/20 hover:bg-white/10"
          >
            <GooglePlayBadge />
            <span className="text-xs font-semibold text-white">Google Play</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-cyan">
              Coming soon
            </span>
          </button>
          <button
            type="button"
            onClick={() => onStoreClick("app_store")}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:border-white/20 hover:bg-white/10"
          >
            <AppStoreBadge />
            <span className="text-xs font-semibold text-white">App Store</span>
            <span className="text-[9px] font-semibold uppercase tracking-wide text-cyan">
              Coming soon
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Download() {
  const [comingSoonStore, setComingSoonStore] = useState(null);
  const [openAttempted, setOpenAttempted] = useState(false);

  const handleStore = useCallback((store) => {
    trackEvent("app_download_click", {
      source: "download_page",
      store,
      status: "coming_soon",
    });
    setComingSoonStore(store);
  }, []);

  const closeComingSoon = useCallback(() => setComingSoonStore(null), []);

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
        description="The Insanjo app is coming soon to the App Store and Google Play."
        url="https://insanjo.com/download"
      />

      <div className="relative overflow-hidden bg-[#060f1c] px-5 py-8 sm:px-8 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-4">
        {/* Soft brand glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-140 w-140 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-5xl">
          <div className="flex justify-center">
            <Link to="/" aria-label="Insanjo home" className="inline-flex items-center">
              <img src="/insanjo-white.svg" alt="Insanjo" className="h-6 w-auto sm:h-7" />
            </Link>
          </div>

          <div className="mt-10 grid items-center gap-10 lg:mt-8 lg:grid-cols-[1fr_0.85fr] lg:gap-10">
            {/* ── Left column: copy ────────────────────────────── */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                </span>
                Coming soon
              </div>

              <h1 className="mt-5 font-serif text-[clamp(2rem,4vw,2.9rem)] font-medium leading-[1.12] tracking-tight text-white">
                The Insanjo app
                <br />
                <span className="text-brand-gradient">is on the way.</span>
              </h1>

              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/55 lg:mx-0">
                We're building something amazing. Be the first to unlock
                exclusive deals, track orders, pay securely and more — all in
                one powerful app.
              </p>

              <ul className="mx-auto mt-7 max-w-sm space-y-3.5 lg:mx-0">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-left">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5 text-cyan ring-1 ring-white/10">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <span className="text-sm text-white/80">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Right column: phone showcase ─────────────────── */}
            <PhoneShowcase onStoreClick={handleStore} />
          </div>

          <div className="mt-8 flex justify-center lg:mt-6">
            <button
              type="button"
              onClick={handleOpenApp}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-xs text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
            >
              {openAttempted ? (
                "Opening Insanjo…"
              ) : (
                <>
                  Already have it?{" "}
                  <span className="font-semibold text-cyan">Open the app</span>
                </>
              )}
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <ComingSoonModal store={comingSoonStore} onClose={closeComingSoon} />
    </>
  );
}
