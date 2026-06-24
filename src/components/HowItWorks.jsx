import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';

const STEPS = [
  { n: '01', title: 'Create business profile', desc: 'Set up your store in a couple of taps.' },
  { n: '02', title: 'Add products & stock', desc: 'Build your catalogue and stock levels.' },
  { n: '03', title: 'Invite your team', desc: 'Add staff with the right permissions.' },
  { n: '04', title: 'Grow with data', desc: 'Sell, track, and let the insights guide you.' },
];

const EASE = [0.22, 1, 0.36, 1];
const LINE_DELAY = 0.2;
const LINE_DURATION = 1.5;

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-surface px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="How it works" title="Up and running in minutes" />

        <div className="relative mt-16">
          {/* progress rail (desktop) — spans center of step 1 to center of step 4 */}
          <div className="absolute left-[12.5%] top-5 hidden h-0.5 w-3/4 bg-line lg:block" />
          <motion.div
            className="absolute left-[12.5%] top-5 hidden h-0.5 w-3/4 origin-left rounded-full bg-brand-gradient lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: LINE_DURATION, delay: LINE_DELAY, ease: 'easeInOut' }}
          />

          <ol className="relative grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {STEPS.map((s, i) => {
              const activeDelay = LINE_DELAY + (i / (STEPS.length - 1)) * LINE_DURATION;
              return (
                <motion.li
                  key={s.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                  className="flex items-start gap-4 lg:flex-col lg:items-center lg:text-center"
                >
                  <div className="relative h-10 w-10 shrink-0">
                    {/* resting state */}
                    <span className="absolute inset-0 grid place-items-center rounded-full border border-line bg-surface font-serif text-sm text-faint">
                      {s.n}
                    </span>
                    {/* activated as the rail reaches it */}
                    <motion.span
                      className="absolute inset-0 grid place-items-center rounded-full bg-brand-gradient font-serif text-sm text-white shadow-[0_8px_20px_-6px_rgba(4,67,149,0.5)]"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.4, delay: activeDelay, ease: EASE }}
                    >
                      {s.n}
                    </motion.span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-ink lg:mt-5">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
