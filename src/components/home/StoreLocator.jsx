import { useReducedMotion } from 'framer-motion';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../SectionHeading';
import MapPreviewVisual from './MapPreviewVisual';

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
            <MapPreviewVisual className="h-64 lg:h-80" reduceMotion={reduce} />
          </div>
        </div>
      </div>
    </section>
  );
}
