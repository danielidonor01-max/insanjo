import { ArrowRight } from 'lucide-react';
import ProductPreview from './ProductPreview';
import Counter from './Counter';

const STATS = [
  { value: 2, suffix: '', label: 'User types', sub: 'Vendors & Customers' },
  { value: 5, suffix: '+', label: 'Core business modules', sub: 'In one place' },
  { value: 1, suffix: '', label: 'Platform to run it all', sub: 'No patchwork tools' },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pt-32 sm:px-8 sm:pt-40">
      {/* soft accent glow, top-center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-soft blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <a
          href="#waitlist"
          className="reveal inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          For vendors, retailers &amp; growing SMEs
        </a>

        <h1 className="reveal mt-7 font-serif text-[clamp(2.6rem,7vw,4.75rem)] font-medium leading-[1.04] tracking-tight text-ink">
          The operating system for{' '}
          <span className="italic text-accent-ink">African businesses</span>
        </h1>

        <p className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          One platform to manage sales, track inventory, run your team, and get
          discovered by customers.
        </p>

        <div className="reveal mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#waitlist"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent sm:w-auto"
          >
            Join Now
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#how"
            className="inline-flex w-full items-center justify-center rounded-full border border-line-strong bg-surface px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink sm:w-auto"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Product preview */}
      <div className="relative mx-auto mt-14 max-w-2xl sm:mt-16">
        <ProductPreview />
      </div>

      {/* Stats */}
      <div className="mx-auto mt-16 max-w-4xl border-t border-line sm:mt-20">
        <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="reveal px-6 py-7 text-center">
              <dd className="font-serif text-5xl text-ink">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm font-semibold text-ink">{s.label}</dt>
              <p className="mt-0.5 text-sm text-faint">{s.sub}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
