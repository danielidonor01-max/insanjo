import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

const PINS = [
  { left: '12%', top: '18%', size: 22, delay: 0 },
  { left: '74%', top: '16%', size: 26, delay: 0.35 },
  { left: '58%', top: '64%', size: 30, delay: 0.7 },
  { left: '20%', top: '72%', size: 20, delay: 1.05 },
  { left: '88%', top: '68%', size: 18, delay: 1.4 },
];

/** Stylised "map" visual (dotted grid, curved roads, pulsing pins) shared across the store-locator promos. */
export default function MapPreviewVisual({ className = '', reduceMotion = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-3xl border border-line bg-linear-to-br from-accent-soft via-canvas to-surface ${className}`}
    >
      {/* dotted grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-line-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* curved "roads" */}
      <svg
        className="absolute inset-0 h-full w-full text-accent/20"
        viewBox="0 0 400 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M40 250 C120 180 160 120 280 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 90 C120 120 220 70 380 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M180 280 C220 220 260 200 360 220" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* animated pins */}
      {PINS.map((pin, i) => (
        <motion.span
          key={i}
          className="absolute flex items-center justify-center rounded-full border border-accent/30 bg-canvas text-accent shadow-[0_10px_24px_-8px_rgba(6,111,242,0.55)]"
          style={{ left: pin.left, top: pin.top, width: pin.size, height: pin.size }}
          initial={{ y: 0 }}
          animate={reduceMotion ? undefined : { y: [-6, 6, -6] }}
          transition={{
            duration: 3.2,
            delay: pin.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <MapPin size={pin.size - 10} strokeWidth={2.25} />
        </motion.span>
      ))}

      {/* "you are here" pulse */}
      <motion.span
        className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gradient text-canvas shadow-[0_10px_24px_-8px_rgba(4,67,149,0.7)]"
        initial={{ scale: 1 }}
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Navigation size={12} />
      </motion.span>
    </div>
  );
}
