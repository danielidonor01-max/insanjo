import { Check } from 'lucide-react';
import SectionHeading from '../SectionHeading';

const BUSINESSES = [
  'Retail shops',
  'Food vendors',
  'Pharmacies',
  'Fashion boutiques',
  'Hardware stores',
  'Distributors',
  'Growing local brands',
];

const POINTS = ['2 user types, not a hundred', 'Free — start at zero cost'];

export default function Audience() {
  return (
    <section id="audience" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl text-center">
        <SectionHeading
          kicker="Who it's for"
          title="If you sell something, Insanjo was built for you"
        />

        <div className="reveal mt-12 flex flex-wrap justify-center gap-3">
          {BUSINESSES.map((b) => (
            <span
              key={b}
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent-ink"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-10">
          {POINTS.map((p) => (
            <div key={p} className="inline-flex items-center gap-2.5 text-sm font-medium text-muted">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-canvas">
                <Check size={12} strokeWidth={3} />
              </span>
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
