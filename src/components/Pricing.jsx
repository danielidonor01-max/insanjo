import { Check, ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FREE = [
  'Real-time sales tracking',
  'Smart inventory management',
  'Staff & role management',
  'Get discovered locally',
];

const PREMIUM = [
  'Everything in Free',
  'Predictive business analytics',
  'Intelligent notifications',
  'Priority support',
];

export default function Pricing() {
  return (
    <section id="pricing" className="border-y border-line bg-surface px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          kicker="Pricing"
          title="Start free. Scale when you're ready."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Free */}
          <div className="reveal flex flex-col rounded-2xl border border-ink bg-canvas p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Free</h3>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink">
                Available now
              </span>
            </div>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-serif text-5xl text-ink">₦0</span>
              <span className="text-sm text-muted">/month</span>
            </p>
            <p className="mt-2 text-sm text-muted">Everything you need to start selling.</p>

            <ul className="mt-8 space-y-3.5">
              {FREE.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-ink">
                  <Check size={16} className="shrink-0 text-accent-ink" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#waitlist"
              className="group mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-canvas transition-all duration-300 hover:bg-accent"
            >
              Join Now
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Premium */}
          <div className="reveal flex flex-col rounded-2xl border border-line bg-canvas/40 p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink">Premium</h3>
              <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-faint">
                Coming soon
              </span>
            </div>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-serif text-5xl text-faint">TBD</span>
              <span className="text-sm text-faint">/month</span>
            </p>
            <p className="mt-2 text-sm text-muted">Advanced tools for businesses ready to scale.</p>

            <ul className="mt-8 space-y-3.5">
              {PREMIUM.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-muted">
                  <Check size={16} className="shrink-0 text-faint" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>

            <span className="mt-9 inline-flex cursor-not-allowed items-center justify-center rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-faint">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
