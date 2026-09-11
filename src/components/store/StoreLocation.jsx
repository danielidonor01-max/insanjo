import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Phone, ExternalLink } from "lucide-react";

export default function StoreLocation({ businessName, address, phone, latitude, longitude }) {
  const [mapOpen, setMapOpen] = useState(false);
  const hasCoords = latitude != null && longitude != null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 rounded-store-card border border-store-border bg-store-surface p-5"
    >
      <div className="flex flex-col flex-wrap gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-store-control bg-store-bg">
            <MapPin size={16} className="text-store-fg" />
          </div>
          <div>
            <p className="text-sm font-medium text-store-fg">{address || "Address unavailable"}</p>
            <p className="mt-0.5 text-xs text-store-muted">{businessName}</p>
          </div>
        </div>

        <div className="flex gap-2.5">
          {hasCoords && (
            <button
              type="button"
              onClick={() => setMapOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-store-button px-4 py-2.5 text-sm font-semibold transition-colors active:opacity-80 ${
                mapOpen
                  ? "bg-store-fg text-store-bg"
                  : "bg-store-primary text-store-primary-fg hover:opacity-90"
              }`}
            >
              <Navigation size={14} />
              {mapOpen ? "Hide Map" : "Navigate"}
            </button>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-2 rounded-store-button border border-store-border bg-store-surface px-4 py-2.5 text-sm font-semibold text-store-fg transition-colors hover:bg-store-surface-hover active:opacity-80"
            >
              <Phone size={14} />
              Call
            </a>
          )}
        </div>

        <AnimatePresence>
          {mapOpen && hasCoords && (
            <motion.div
              key="inline-map"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 220 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="order-last w-full overflow-hidden rounded-store-card sm:basis-full"
            >
              <div className="relative h-[220px] w-full overflow-hidden rounded-store-card border border-store-border">
                <iframe
                  title={`${businessName} location`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&center=${latitude},${longitude}&zoom=15`}
                  className="absolute inset-0 h-full w-full border-0"
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 rounded-store-control bg-store-surface/95 px-3 py-1.5 text-xs font-medium text-store-fg shadow-sm backdrop-blur-sm transition-colors hover:bg-store-surface"
                >
                  <ExternalLink size={12} className="mr-1 inline -mt-0.5" />
                  Open in Google Maps
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
