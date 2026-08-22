import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../SectionHeading';

const PINS = [
  { left: '12%', top: '18%', size: 22, delay: 0 },
  { left: '74%', top: '16%', size: 26, delay: 0.35 },
  { left: '58%', top: '64%', size: 30, delay: 0.7 },
  { left: '20%', top: '72%', size: 20, delay: 1.05 },
  { left: '88%', top: '68%', size: 18, delay: 1.4 },
];

const SNIPPETS = ['Pharmacies', 'Fashion boutiques', 'Food vendors', 'Hardware', 'Local brands'];

export default function StoreLocator() {
  const reduce = useReducedMotion();

  return (
    <section id="stores" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Explore nearby"
          title={
            <>
              Find stores in <span className="text-brand-gradient italic">your area</span>
            </>
          }
          intro="Wherever you are, trusted local shops and vendors are closer than you think. Discover everything you love, around the corner."
        />

        <div className="reveal relative mt-16 overflow-hidden rounded-4xl border border-line bg-surface p-8 sm:p-14">
          {/* Soft backdrop glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Copy + CTA */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-ink">
                <Sparkles size={13} />
                Nearby &amp; trusted
              </span>

              <h3 className="mt-5 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-ink">
                Your neighbourhood, <br className="hidden sm:block" />
                one tap away.
              </h3>

              <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
                Browse real vendor profiles and products in your city, support local businesses,
                and find exactly what you need — no endless scrolling.
              </p>

              <div className="mt-4 flex flex-col gap-3  sm:items-start">
                <Link
                  to="/stores"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent"
                >
                  <MapPin size={17} />
                  Find stores near me
                  <Navigation
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <div className="flex sm:mt-4 flex-wrap items-center gap-2">
                  {SNIPPETS.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stylised "map" visual */}
            <div
              aria-hidden="true"
              className="relative h-64 overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent-soft via-canvas to-surface lg:h-80"
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
                  animate={reduce ? undefined : { y: [-6, 6, -6] }}
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
                animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Navigation size={12} />
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
