import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Locate,
  MapPin,
  Navigation,
  Search,
  Store,
  X,
} from "lucide-react";
import SEO from "../components/SEO";
import Logo from "../components/Logo";
import DownloadAppPrompt from "../components/DownloadAppPrompt";
import DownloadAppModal from "../components/DownloadAppModal";
import { trackEvent } from "../utils/analytics";

/* Reusable search box + suggestion dropdown (used in the sidebar and the mobile overlay) */
function StoreSearch({
  query,
  onQueryChange,
  focused,
  onFocusedChange,
  filtered,
  onSelect,
  onClear,
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface/95 px-4 py-2.5 shadow-lg backdrop-blur focus-within:border-accent dark:bg-surface">
        <Search size={18} className="text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => onFocusedChange(true)}
          onBlur={() => setTimeout(() => onFocusedChange(false), 150)}
          placeholder="Search shop name…"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-faint outline-none"
        />
        {focused && query && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="grid h-6 w-6 place-items-center rounded-full bg-line text-muted hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {focused && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mt-2 overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-xl backdrop-blur dark:bg-surface"
          >
            {filtered.length === 0 ? (
              <p className="px-5 py-4 text-center text-sm text-muted">
                No matching shops found
              </p>
            ) : (
              filtered.slice(0, 6).map((s) => (
                <button
                  key={s.publicId}
                  type="button"
                  onMouseDown={() => {
                    onQueryChange(s.businessName);
                    onFocusedChange(false);
                    onSelect(s);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-accent-soft"
                >
                  <Store size={17} className="shrink-0 text-muted" />
                  <span className="flex-1 truncate text-sm text-ink">
                    {s.businessName}
                  </span>
                  <span className="text-xs text-faint">{s.distance} km</span>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Store marker icon (accent pin; cyan dot when open) */
const makeStoreIcon = (open) =>
  L.divIcon({
    className: "insanjo-store-icon",
    iconSize: [40, 46],
    iconAnchor: [20, 44],
    html: `
      <div style="position:relative;width:40px;height:46px;filter:drop-shadow(0 10px 14px rgba(4,67,149,0.35));">
        <svg width="40" height="46" viewBox="0 0 40 46" fill="none">
        <defs>
    <!-- Define the gradient here -->
    <linearGradient id="myLinearGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#05f1db" />
      <stop offset="100%" stop-color="#066ff2"  />
    </linearGradient>
  </defs>
          <path d="M20 0C9.5 0 1 8.5 1 19c0 13.5 16 27 19 27s19-13.5 19-27C39 8.5 30.5 0 20 0Z"
                fill="url(#myLinearGradient)" />
          <circle cx="20" cy="19" r="8" fill="#fff"/>
          <path d="M20 12l1.6 3.4 3.4 1.6-3.4 1.6L20 22l-1.6-3.4-3.4-1.6 3.4-1.6Z"
                fill="${open ? "#05f1db" : "#f9fbfe"}"/>
        </svg>
        <span style="position:absolute;top:-2px;right:-2px;width:10px;height:10px;border-radius:9999px;
                     background:${open ? "#05f1db" : "#94a0b5"};border:2px solid #fff;"></span>
      </div>`,
  });

/* User-location marker (pulsing dot) */
const makeUserIcon = () =>
  L.divIcon({
    className: "insanjo-user-icon",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `
      <div style="position:relative;width:22px;height:22px;">
        <span style="position:absolute;inset:0;border-radius:9999px;background:rgba(6,111,242,0.35);animation:insanjoPulse 1.8s ease-out infinite;"></span>
        <span style="position:absolute;inset:3px;border-radius:9999px;background:#066ff2;border:2.5px solid #fff;"></span>
      </div>`,
  });

/* Drives the map camera when center/zoom change */
function CameraController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 0.9 });
  }, [center, zoom, map]);
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export default function FindStores() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [stores, setStores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(14);
  const [loadingStores, setLoadingStores] = useState(false);
  const [appPromptDismissed, setAppPromptDismissed] = useState(
    () => localStorage.getItem("insanjo:findstores:appPromptDismissed") === "1"
  );

  const dismissAppPrompt = () => {
    setAppPromptDismissed(true);
    localStorage.setItem("insanjo:findstores:appPromptDismissed", "1");
    trackEvent("app_prompt_dismiss", { source: "find_stores" });
  };

  /* ── "Get the Insanjo app" modal state ───────────────── */ 
  /* Which high-intent action the user tapped: 'shop' | 'directions' | null */
  const [appModalAction, setAppModalAction] = useState(null);

  const openAppModal = (action) => {
    setAppModalAction(action);
  };

  const closeAppModal = () => {
    setAppModalAction(null);
  };

  /* ── Get user location ─────────────────────────── */
  useEffect(() => {
  if (!("geolocation" in navigator)) {
    setLocationError("Geolocation is not supported by your browser.");
    setCoords({ lat: 6.5244, lng: 3.3792 });
    setCenter({ lat: 6.5244, lng: 3.3792 });
    setZoom(10);
    return;
  }

  const fallbackToLagos = (reason) => {
    const c = { lat: 6.5244, lng: 3.3792 };
    setCoords(c);
    setCenter(c);
    setZoom(10);
    setLocationError(reason);
  };

  const handleError = (err) => {
    console.error("Geolocation error:", err.code, err.message);
    // Retry once with relaxed accuracy + longer timeout before giving up.
    // Handles Android's slow GPS cold-start under high-accuracy mode.
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setCenter(c);
        setZoom(14);
      },
      (err2) => {
        console.error("Geolocation retry failed:", err2.code, err2.message);
        const reasons = {
          1: "Location permission denied. Showing Lagos, Nigeria.",
          2: "Location unavailable. Showing Lagos, Nigeria.",
          3: "Location request timed out. Showing Lagos, Nigeria.",
        };
        fallbackToLagos(reasons[err2.code] || "Couldn't get your location. Showing Lagos, Nigeria.");
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
    );
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setCoords(c);
      setCenter(c);
      setZoom(14);
    },
    handleError,
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
  );
}, []);

  /* ── Fetch nearby businesses ───────────────────── */
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    const fetchStores = async () => {
      try {
        setLoadingStores(true);
        const res = await fetch(
          `https://api.insanjo.com/pages/nearby-businesses?latitude=${coords.lat}&longitude=${coords.lng}&radius=500`,
        );
        const json = await res.json();
        if (cancelled) return;
        if (Array.isArray(json.businesses)) {
          setStores(
            json.businesses.map((b) => ({
              publicId: b.publicId,
              businessName: b.businessName,
              businessAddress: b.businessAddress,
              businessProfileImage: b.businessProfileImage,
              latitude: Number(b.latitude),
              longitude: Number(b.longitude),
              distance: Number(Number(b.distance).toFixed(1)),
              deliveryRadiusKm: Number(b.deliveryRadiusKm),
              isOpenNow: Boolean(b.isOpenNow),
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load nearby stores:", err);
        if (!cancelled) setLocationError("Couldn't load nearby stores.");
      } finally {
        if (!cancelled) setLoadingStores(false);
      }
    };
    fetchStores();
    return () => {
      cancelled = true;
    };
  }, [coords]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return stores.filter((s) => s.businessName.toLowerCase().includes(q));
  }, [query, stores]);

  const selectStore = (store) => {
    setSelected(store);
    setCenter({ lat: store.latitude, lng: store.longitude });
    setZoom(15);
  };

  const backToMe = () => {
    if (!coords) return;
    setSelected(null);
    setQuery("");
    setFocused(false);
    setCenter(coords);
    setZoom(13);
  };

  return (
    <>
      <SEO
        title="Find Stores Near You | Insanjo"
        description="Discover trusted local shops and vendors in your area with the Insanjo store finder."
      />
      <style>{`
        @keyframes insanjoPulse {
          0% { transform: scale(0.6); opacity: 0.9; }
          70% { transform: scale(2.1); opacity: 0; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        .insanjo-store-icon, .insanjo-user-icon { background: transparent; border: none; }
      `}</style>

      <div className="flex h-dvh w-dvw overflow-hidden bg-surface">
        {/* ── Sidebar (large screens) ─────────────────────────── */}
        <aside className="hidden min-h-0 w-95 shrink-0 flex-col border-r border-line bg-canvas lg:flex xl:w-105">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <Logo height={24} />
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Back to home"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-accent-soft hover:text-ink"
            >
              <ArrowLeft size={17} />
            </button>
          </div>



          <div className="border-b border-line p-4">
            <StoreSearch
              query={query}
              onQueryChange={setQuery}
              focused={focused}
              onFocusedChange={setFocused}
              filtered={filtered}
              onSelect={selectStore}
              onClear={() => setQuery("")}
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                Stores near you
              </p>
              {loadingStores ? (
                <Loader2 size={14} className="animate-spin text-muted" />
              ) : (
                <span className="text-xs font-medium text-muted">{stores.length}</span>
              )}
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto px-3 pb-3">
              {loadingStores && stores.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center gap-3 rounded-2xl border border-line bg-surface p-3"
                  >
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-line" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-line" />
                      <div className="h-2.5 w-1/2 rounded bg-line" />
                    </div>
                  </div>
                ))
              ) : stores.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-5 text-center">
                  <MapPin size={18} className="mx-auto text-faint" />
                  <p className="mt-2 text-sm font-medium text-ink">No stores found yet</p>
                  <p className="mt-1 text-xs text-muted">
                    Try moving the map or searching for a shop name.
                  </p>
                </div>
              ) : (
                stores.map((s) => {
                  const active = selected?.publicId === s.publicId;
                  return (
                    <button
                      key={s.publicId}
                      type="button"
                      onClick={() => selectStore(s)}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${active
                        ? "border-accent bg-accent-soft"
                        : "border-transparent hover:border-line hover:bg-surface"
                        }`}
                    >
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                        <Store size={19} strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{s.businessName}</p>
                        <p className="truncate text-xs text-muted">
                          {s.businessAddress || "Address unavailable"}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-medium">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${s.isOpenNow ? "bg-emerald-500" : "bg-faint"}`}
                          />
                          <span className={s.isOpenNow ? "text-emerald-600" : "text-faint"}>
                            {s.isOpenNow ? "Open now" : "Closed"}
                          </span>
                        </span>
                      </div>
                      <div className="flex shrink-0  items-center rounded-full bg-cyan/70 px-2.5 py-1">
                        <MapPin size={12} className="text-ink" />
                        <span className="text-xs font-semibold text-ink">{s.distance} km</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="border-t border-line p-4">
            <DownloadAppPrompt variant="sidebar" />
          </div>
        </aside>

        {/* ── Map area ────────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1">
          {coords ? (
            <MapContainer
              center={center}
              zoom={zoom}
              zoomControl={false}
              className="z-0 h-full w-full"
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <CameraController center={center} zoom={zoom} />
              {coords && (
                <Marker position={[coords.lat, coords.lng]} icon={makeUserIcon()} zIndexOffset={1000} />
              )}
              {stores.map((s) => (
                <Marker
                  key={s.publicId}
                  position={[s.latitude, s.longitude]}
                  icon={makeStoreIcon(s.isOpenNow)}
                  eventHandlers={{ click: () => selectStore(s) }}
                  zIndexOffset={s.publicId === selected?.publicId ? 900 : 10}
                />
              ))}
            </MapContainer>
          ) : (
            <div className="flex min-h-full items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <Loader2 size={34} className="animate-spin text-accent" strokeWidth={1.5} />
                <p className="mt-4 text-sm text-muted">{locationError || "Finding stores near you…"}</p>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-6 lg:hidden">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Back to home"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors hover:bg-accent-soft"
            >
              <ArrowLeft size={19} />
            </button>
            <div className="pointer-events-auto rounded-2xl border border-line bg-surface/90 px-4 py-2 shadow-sm backdrop-blur">
              <Logo height={22} />
            </div>
            <div className="pointer-events-none h-11 w-11" />
          </div>

          <div className="absolute inset-x-0 top-20 z-30 flex justify-center px-4 sm:top-24 lg:hidden">
            <div className="w-full max-w-md">
              <StoreSearch
                query={query}
                onQueryChange={setQuery}
                focused={focused}
                onFocusedChange={setFocused}
                filtered={filtered}
                onSelect={selectStore}
                onClear={() => setQuery("")}
              />
            </div>
          </div>

          {!selected && !focused && !appPromptDismissed && (
            <div className="absolute inset-x-4 top-36 z-30 mx-auto  max-w-md sm:top-40 lg:hidden">
              <DownloadAppPrompt variant="banner" onDismiss={dismissAppPrompt} />
            </div>
          )}

          {coords && !selected && (
            <button
              type="button"
              onClick={backToMe}
              aria-label="Back to my location"
              className="absolute right-4 bottom-4 z-20 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-[0_10px_24px_-8px_rgba(6,111,242,0.7)] transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
            >
              <Locate size={19} />
            </button>
          )}


          {/* the store details modal */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-4 bottom-4 z-30 mx-auto max-w-lg sm:inset-x-auto sm:right-6 sm:bottom-6"
              >
                <div className="rounded-3xl border border-line bg-surface p-5 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Store size={26} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-ink">{selected.businessName}</p>
                      <p className="truncate text-sm text-muted">{selected.businessAddress || "Address unavailable"}</p>
                      <span className={`mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium ${selected.isOpenNow ? "text-emerald-600" : "text-muted"}`}>
                        <span className={`h-2 w-2 rounded-full ${selected.isOpenNow ? "bg-emerald-500" : "bg-faint"}`} />
                        {selected.isOpenNow ? "Open now" : "Currently closed"}
                      </span>
                    </div>
                    <div className="flex shrink-0  items-center rounded-full bg-cyan/70 px-4 py-2">
                      <MapPin size={14} className="text-ink" />
                      <span className="text-sm font-semibold text-ink">{selected.distance} km</span>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openAppModal("directions")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      <Navigation size={15} />
                      Directions
                    </button>
                    <button
                      type="button"
                      onClick={() => openAppModal("shop")}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-ink"
                    >
                      <Store size={15} />
                      View Shop
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DOWNLOAD THE INSANJO APP MODAL */}
        <DownloadAppModal
          action={appModalAction}
          storeName={selected?.businessName}
          onClose={closeAppModal}
        />
      </div>
    </>
  );
}
